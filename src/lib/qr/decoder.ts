import jsQR from "jsqr";

export interface DecodedQR {
    data: string;
    type: "URL" | "WIFI" | "VCARD" | "EMAIL" | "SMS" | "TEXT";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raw: any;
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
                    resolve({
                        data: code.data,
                        type: detectType(code.data),
                        raw: code,
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
