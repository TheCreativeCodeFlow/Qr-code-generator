declare module 'jsqr' {
    interface QRPoint {
        x: number;
        y: number;
    }

    interface QRCodeLocation {
        topLeftCorner: QRPoint;
        topRightCorner: QRPoint;
        bottomRightCorner: QRPoint;
        bottomLeftCorner: QRPoint;
        topLeftFinderPattern?: QRPoint;
        topRightFinderPattern?: QRPoint;
        bottomLeftFinderPattern?: QRPoint;
        bottomRightAlignmentPattern?: QRPoint;
    }

    interface QRChunk {
        type: string;
        bytes: number[];
        text: string;
    }

    export interface QRCode {
        binaryData: number[];
        data: string;
        chunks: QRChunk[];
        location: QRCodeLocation;
    }

    interface JsQROptions {
        inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst";
    }

    function jsQR(data: Uint8ClampedArray, width: number, height: number, options?: JsQROptions): QRCode | null;
    export = jsQR;
}
