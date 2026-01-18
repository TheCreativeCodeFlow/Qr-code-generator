'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { QRConfig } from '@/lib/qr/config';
import { Button } from '@/components/ui/button';

interface QRPreviewProps {
    config: QRConfig;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ config }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

    useEffect(() => {
        // Initialize component-side only to avoid SSR issues with canvas
        const qr = new QRCodeStyling(mapConfigToOptions(config));
        setQrCode(qr);
    }, []);

    useEffect(() => {
        if (qrCode && ref.current) {
            if (ref.current.innerHTML === '') {
                qrCode.append(ref.current);
            }
        }
    }, [qrCode, ref]);

    useEffect(() => {
        if (qrCode) {
            qrCode.update(mapConfigToOptions(config));
        }
    }, [config, qrCode]);

    const mapConfigToOptions = (cfg: QRConfig): Options => {
        const options: Options = {
            width: cfg.width,
            height: cfg.height,
            data: cfg.data,
            margin: cfg.margin,
            image: cfg.image || undefined,
            dotsOptions: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: cfg.shape as any,
                color: cfg.gradient ? undefined : cfg.color,
                gradient: cfg.gradient
                    ? {
                        type: cfg.gradient.type,
                        rotation: cfg.gradient.rotation,
                        colorStops: [
                            { offset: 0, color: cfg.gradient.color1 },
                            { offset: 1, color: cfg.gradient.color2 },
                        ],
                    }
                    : undefined,
            },
            backgroundOptions: {
                color: cfg.backgroundColor,
            },
            cornersSquareOptions: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: cfg.eyeFrame as any,
                color: cfg.color, // Sync with main color for now, could be separate
            },
            cornersDotOptions: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: cfg.eyeBall as any,
                color: cfg.color,
            },
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: 5,
                imageSize: 0.4
            }
        };
        return options;
    };

    const handleDownload = (ext: 'png' | 'svg' | 'jpeg') => {
        if (qrCode) {
            qrCode.download({ extension: ext, name: 'qr-code' });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                ref={ref}
                className="bg-white p-4 rounded-xl shadow-sm border border-border"
            />

            <div className="flex gap-2">
                <Button onClick={() => handleDownload('png')} variant="secondary" size="sm">
                    Download PNG
                </Button>
                <Button onClick={() => handleDownload('svg')} variant="secondary" size="sm">
                    Download SVG
                </Button>
            </div>
        </div>
    );
};
