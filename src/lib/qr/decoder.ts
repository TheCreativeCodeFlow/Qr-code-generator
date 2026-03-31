import jsQR from "jsqr";

export interface DecodedQR {
    data: string;
    type: "URL" | "WIFI" | "VCARD" | "EMAIL" | "SMS" | "TEXT";
    raw: unknown;
    source: {
        fileName: string;
        fileSize: number;
        width: number;
        height: number;
    };
    quality: ScanQuality;
}

export interface ScanQuality {
    score: number;
    label: "Excellent" | "Good" | "Fair" | "Needs review";
    summary: string;
    notes: string[];
    resolution: {
        width: number;
        height: number;
    };
    fileSize: number;
    payloadLength: number;
}

export const decodeQRFromImage = (file: File): Promise<DecodedQR | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    const quality = estimateScanQuality(file, img.width, img.height, code.data.length, code.location);
                    resolve({
                        data: code.data,
                        type: detectType(code.data),
                        raw: code,
                        source: {
                            fileName: file.name,
                            fileSize: file.size,
                            width: img.width,
                            height: img.height,
                        },
                        quality,
                    });
                } else {
                    resolve(null);
                }
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
};

const detectType = (data: string): DecodedQR["type"] => {
    if (data.startsWith("WIFI:")) return "WIFI";
    if (data.startsWith("BEGIN:VCARD")) return "VCARD";
    if (data.startsWith("mailto:")) return "EMAIL";
    if (data.startsWith("SMSTO:") || data.startsWith("sms:")) return "SMS";
    if (data.match(/^(http|https):\/\//)) return "URL";
    return "TEXT";
};

function estimateScanQuality(
    file: File,
    width: number,
    height: number,
    payloadLength: number,
    location?: QRLocation | null
): ScanQuality {
    const pixels = Math.max(width * height, 1);
    const minSide = Math.min(width, height);
    const bytesPerPixel = file.size / pixels;

    let score = 35;
    const notes: string[] = [];

    if (minSide >= 1800) {
        score += 24;
    } else if (minSide >= 1200) {
        score += 20;
    } else if (minSide >= 800) {
        score += 16;
    } else if (minSide >= 500) {
        score += 10;
        notes.push("A higher resolution image would improve scan reliability.");
    } else {
        score += 4;
        notes.push("The upload is small, so decoding may be sensitive to blur.");
    }

    if (file.size >= 120_000 && file.size <= 4_000_000) {
        score += 14;
    } else if (file.size >= 45_000) {
        score += 10;
    } else if (file.size >= 15_000) {
        score += 6;
    } else {
        score += 2;
        notes.push("The image is heavily compressed or very small.");
    }

    if (bytesPerPixel >= 0.02 && bytesPerPixel <= 0.45) {
        score += 10;
    } else if (bytesPerPixel >= 0.01) {
        score += 5;
    } else {
        score -= 4;
        notes.push("The upload may be over-compressed for a clean scan.");
    }

    if (payloadLength <= 140) {
        score += 8;
    } else if (payloadLength <= 320) {
        score += 5;
    } else if (payloadLength > 600) {
        score -= 6;
        notes.push("Longer payloads are denser and harder to scan.");
    }

    const coverage = getCoverageRatio(location, pixels);
    if (coverage > 0) {
        if (coverage >= 0.12 && coverage <= 0.72) {
            score += 8;
        } else if (coverage >= 0.05) {
            score += 4;
        }
    }

    const squareness = getSquareness(location);
    if (squareness >= 0.92) {
        score += 6;
    } else if (squareness >= 0.8) {
        score += 3;
    } else if (squareness > 0) {
        score -= 2;
        notes.push("The QR is slightly skewed in the source image.");
    }

    score = Math.max(0, Math.min(100, score));

    const label =
        score >= 85 ? "Excellent" :
            score >= 70 ? "Good" :
                score >= 50 ? "Fair" : "Needs review";

    const summary =
        label === "Excellent"
            ? "Very clean scan with strong image quality."
            : label === "Good"
                ? "Reliable scan with only minor quality tradeoffs."
                : label === "Fair"
                    ? "Readable scan, but the image could be clearer."
                    : "Scan succeeded, but the source image is fragile.";

    if (!notes.length) {
        notes.push(
            label === "Excellent"
                ? "The QR should print and share cleanly."
                : "A clearer crop or less compression would improve resilience."
        );
    }

    return {
        score,
        label,
        summary,
        notes: notes.slice(0, 3),
        resolution: { width, height },
        fileSize: file.size,
        payloadLength,
    };
}

function getCoverageRatio(
    location: QRLocation | null | undefined,
    pixels: number
): number {
    const corners = [
        location?.topLeftCorner,
        location?.topRightCorner,
        location?.bottomRightCorner,
        location?.bottomLeftCorner,
    ].filter((point): point is { x: number; y: number } => Boolean(point));

    if (corners.length !== 4) {
        return 0;
    }

    const xs = corners.map((point) => point.x);
    const ys = corners.map((point) => point.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    const area = Math.max(width, 0) * Math.max(height, 0);

    return area / pixels;
}

function getSquareness(
    location: QRLocation | null | undefined
): number {
    const topLeft = location?.topLeftCorner;
    const topRight = location?.topRightCorner;
    const bottomLeft = location?.bottomLeftCorner;

    if (!topLeft || !topRight || !bottomLeft) {
        return 0;
    }

    const horizontal = distance(topLeft, topRight);
    const vertical = distance(topLeft, bottomLeft);

    if (horizontal === 0 || vertical === 0) {
        return 0;
    }

    return Math.min(horizontal, vertical) / Math.max(horizontal, vertical);
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

interface QRLocation {
    topLeftCorner?: { x: number; y: number };
    topRightCorner?: { x: number; y: number };
    bottomRightCorner?: { x: number; y: number };
    bottomLeftCorner?: { x: number; y: number };
}
