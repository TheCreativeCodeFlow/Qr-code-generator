import { Options } from "qr-code-styling";

export type QRStyleType = "square" | "dots" | "rounded" | "classy" | "classy-rounded" | "extra-rounded";
export type QREyeFrameType = "square" | "circle" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
export type QREyeBallType = "square" | "circle" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";

export interface QRConfig {
    data: string;
    width: number;
    height: number;
    margin: number;
    image?: string;
    shape: QRStyleType;
    color: string;
    backgroundColor: string;
    gradient?: {
        type: "linear" | "radial";
        color1: string;
        color2: string;
        rotation: number;
    };
    eyeFrame: QREyeFrameType;
    eyeBall: QREyeBallType;
}

export const DEFAULT_CONFIG: QRConfig = {
    data: "https://example.com",
    width: 300,
    height: 300,
    margin: 10,
    shape: "square",
    color: "#000000",
    backgroundColor: "#ffffff",
    eyeFrame: "square",
    eyeBall: "square",
};

export const QR_PRESETS: Record<string, Partial<QRConfig>> = {
    classic: {
        shape: "square",
        eyeFrame: "square",
        eyeBall: "square",
    },
    rounded: {
        shape: "rounded",
        eyeFrame: "rounded",
        eyeBall: "rounded",
    },
    circles: {
        shape: "dots",
        eyeFrame: "circle",
        eyeBall: "circle",
    },
    modern: {
        shape: "extra-rounded",
        eyeFrame: "extra-rounded",
        eyeBall: "extra-rounded",
    },
    elegant: {
        shape: "classy",
        eyeFrame: "classy",
        eyeBall: "classy",
    },
};
