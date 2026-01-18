declare module 'jsqr' {
    export interface QRCode {
        binaryData: number[];
        data: string;
        chunks: any[];
        location: any;
    }

    function jsQR(data: Uint8ClampedArray, width: number, height: number, options?: any): QRCode | null;
    export = jsQR;
}
