'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QRCodeStyling, { Options } from 'qr-code-styling';
import { Copy, Download, FileImage, FileDown, Sparkles } from 'lucide-react';
import { QRConfig } from '@/lib/qr/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QRPreviewProps {
    config: QRConfig;
}

function mapConfigToOptions(cfg: QRConfig): Options {
    return {
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
            color: cfg.color,
        },
        cornersDotOptions: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: cfg.eyeBall as any,
            color: cfg.color,
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 5,
            imageSize: 0.4,
        },
    };
}

function buildPreviewKey(cfg: QRConfig) {
    return JSON.stringify([
        cfg.data,
        cfg.width,
        cfg.height,
        cfg.margin,
        cfg.image || '',
        cfg.shape,
        cfg.color,
        cfg.backgroundColor,
        cfg.eyeFrame,
        cfg.eyeBall,
        cfg.gradient?.type || '',
        cfg.gradient?.rotation || 0,
        cfg.gradient?.color1 || '',
        cfg.gradient?.color2 || '',
    ]);
}

export const QRPreview: React.FC<QRPreviewProps> = ({ config }) => {
    const qrContainerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const feedbackTimeoutRef = useRef<number | null>(null);
    const [actionFeedback, setActionFeedback] = useState('Live preview synced');

    const qrOptions = useMemo(() => mapConfigToOptions(config), [config]);
    const previewKey = useMemo(() => buildPreviewKey(config), [config]);
    const canCopyImage = useMemo(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return 'ClipboardItem' in window && Boolean(navigator.clipboard?.write);
    }, []);

    useEffect(() => {
        if (!qrCodeRef.current) {
            qrCodeRef.current = new QRCodeStyling(qrOptions);
        } else {
            qrCodeRef.current.update(qrOptions);
        }

        if (qrCodeRef.current && qrContainerRef.current && qrContainerRef.current.childElementCount === 0) {
            qrCodeRef.current.append(qrContainerRef.current);
        }
    }, [qrOptions, previewKey]);

    useEffect(() => {
        return () => {
            if (feedbackTimeoutRef.current) {
                window.clearTimeout(feedbackTimeoutRef.current);
            }
        };
    }, []);

    const announce = useCallback((message: string) => {
        setActionFeedback(message);
        if (feedbackTimeoutRef.current) {
            window.clearTimeout(feedbackTimeoutRef.current);
        }
        feedbackTimeoutRef.current = window.setTimeout(() => {
            setActionFeedback('Live preview synced');
        }, 1800);
    }, []);

    const handleDownload = useCallback(async (ext: 'png' | 'svg') => {
        if (!qrCodeRef.current) {
            return;
        }

        try {
            await qrCodeRef.current.download({ extension: ext, name: 'qr-master' });
            announce(`Downloaded ${ext.toUpperCase()} file`);
        } catch (error) {
            console.error(error);
            announce(`Unable to download ${ext.toUpperCase()}`);
        }
    }, [announce]);

    const handleCopyData = useCallback(async () => {
        if (!config.data) {
            return;
        }

        try {
            await navigator.clipboard.writeText(config.data);
            announce('Copied QR content');
        } catch (error) {
            console.error(error);
            announce('Copy failed');
        }
    }, [announce, config.data]);

    const handleCopyImage = useCallback(async () => {
        if (!qrCodeRef.current || !canCopyImage) {
            return;
        }

        const raw = await qrCodeRef.current.getRawData('png');
        if (!(raw instanceof Blob)) {
            announce('Image copy is not available in this browser');
            return;
        }

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [raw.type || 'image/png']: raw,
                }),
            ]);

            announce('Copied QR image');
        } catch (error) {
            console.error(error);
            announce('Image copy failed');
        }
    }, [announce, canCopyImage]);

    return (
        <Card className="relative overflow-hidden border-border/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] shadow-[0_30px_80px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_22%)]" />
            <CardHeader className="relative space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                            Live QR Preview
                        </CardTitle>
                        <CardDescription>
                            High-fidelity render with instant sync from content and style controls.
                        </CardDescription>
                    </div>

                    <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Client-side only
                    </div>
                </div>
            </CardHeader>

            <CardContent className="relative space-y-5">
                <div className="rounded-[2rem] border border-border/70 bg-background/60 p-5 shadow-inner backdrop-blur">
                    <div className="flex min-h-[360px] items-center justify-center rounded-[1.5rem] border border-dashed border-border/50 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_55%)] p-4">
                        <div
                            key={previewKey}
                            className="animate-in fade-in zoom-in-95 duration-300"
                        >
                            <div
                                ref={qrContainerRef}
                                className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                                style={{ width: '100%', maxWidth: 360 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyData}
                        disabled={!config.data}
                        className="h-11 justify-start rounded-xl border-border/70 bg-background/70 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Copy className="h-4 w-4" />
                        Copy content
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyImage}
                        disabled={!canCopyImage}
                        title={canCopyImage ? 'Copy QR image to clipboard' : 'Image clipboard support is not available in this browser'}
                        className="h-11 justify-start rounded-xl border-border/70 bg-background/70 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <FileImage className="h-4 w-4" />
                        Copy image
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => void handleDownload('png')}
                        className="h-11 justify-start rounded-xl transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Download className="h-4 w-4" />
                        PNG
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => void handleDownload('svg')}
                        className="h-11 justify-start rounded-xl transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <FileDown className="h-4 w-4" />
                        SVG
                    </Button>
                </div>

                <div
                    aria-live="polite"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground"
                >
                    <span>{actionFeedback}</span>
                    <span className="rounded-full border border-border/60 bg-background px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                        {config.width}x{config.height}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};
