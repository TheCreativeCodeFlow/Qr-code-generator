'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Upload,
    X,
    Copy,
    ExternalLink,
    Wifi,
    Mail,
    MessageSquare,
    User,
    FileText,
    Image as ImageIcon,
    Loader2,
    ScanLine,
    FileDown,
} from 'lucide-react';
import { decodeQRFromImage, DecodedQR } from '@/lib/qr/decoder';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanQualityMeter } from './ScanQualityMeter';

const RESULT_ACTION_TYPES = new Set<DecodedQR['type']>(['URL', 'EMAIL', 'SMS']);

export function QRScanner() {
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<DecodedQR | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('Ready to scan');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const statusTimeoutRef = useRef<number | null>(null);

    const announce = useCallback((message: string) => {
        setStatus(message);
        if (statusTimeoutRef.current) {
            window.clearTimeout(statusTimeoutRef.current);
        }

        statusTimeoutRef.current = window.setTimeout(() => {
            setStatus('Ready to scan');
        }, 1800);
    }, []);

    useEffect(() => {
        return () => {
            if (statusTimeoutRef.current) {
                window.clearTimeout(statusTimeoutRef.current);
            }
        };
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            await processFile(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processFile(file);
        }
        e.target.value = '';
    };

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            setResult(null);
            announce('Unsupported file type');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        announce(`Decoding ${file.name}`);

        try {
            const decoded = await decodeQRFromImage(file);
            if (decoded) {
                setResult(decoded);
                announce(`Decoded ${decoded.type} content`);
            } else {
                setError('No QR code found in the image. Try a clearer crop or higher resolution.');
                announce('No QR code detected');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to process image.');
            announce('Scan failed');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = useCallback(async () => {
        if (!result?.data) {
            return;
        }

        try {
            await navigator.clipboard.writeText(result.data);
            announce('Copied decoded content');
        } catch (error) {
            console.error(error);
            setError('Unable to copy decoded content.');
            announce('Copy failed');
        }
    }, [announce, result?.data]);

    const openResult = useCallback(() => {
        if (!result) {
            return;
        }

        if (result.type === 'URL') {
            const opened = window.open(result.data, '_blank', 'noopener,noreferrer');
            if (opened) {
                announce('Opened link in a new tab');
            } else {
                setError('The browser blocked opening the link.');
            }
            return;
        }

        if (result.type === 'EMAIL' || result.type === 'SMS') {
            try {
                window.location.href = result.data;
                announce(`Opened ${result.type.toLowerCase()} app`);
            } catch (error) {
                console.error(error);
                setError('Unable to open the selected app.');
            }
        }
    }, [announce, result]);

    const getActionLabel = useMemo(() => {
        if (!result) {
            return 'Copy content';
        }

        if (result.type === 'URL') {
            return 'Open link';
        }

        if (RESULT_ACTION_TYPES.has(result.type)) {
            return 'Open app';
        }

        return 'Copy content';
    }, [result]);

    const getActionIcon = () => {
        if (!result) return <Copy className="h-4 w-4" />;
        switch (result.type) {
            case 'URL':
                return <ExternalLink className="h-4 w-4" />;
            case 'EMAIL':
                return <Mail className="h-4 w-4" />;
            case 'SMS':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <Copy className="h-4 w-4" />;
        }
    };

    const getIcon = () => {
        if (!result) return <FileText className="h-6 w-6" />;
        switch (result.type) {
            case 'WIFI': return <Wifi className="h-6 w-6" />;
            case 'URL': return <ExternalLink className="h-6 w-6" />;
            case 'EMAIL': return <Mail className="h-6 w-6" />;
            case 'SMS': return <MessageSquare className="h-6 w-6" />;
            case 'VCARD': return <User className="h-6 w-6" />;
            default: return <FileText className="h-6 w-6" />;
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const uploadPrompt = loading
        ? 'Decoding image...'
        : isDragging
            ? 'Drop to decode'
            : 'Click or drag an image here';

    return (
        <Card className="border-border/70 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] shadow-[0_24px_80px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
            <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <ScanLine className="h-4 w-4 text-cyan-400" />
                            Scan & Decode
                        </CardTitle>
                        <CardDescription>
                            Drop in an image and decode QR content entirely in the browser.
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-border/70 bg-background/80 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-5">
                <div
                    className={cn(
                        'group relative rounded-[1.5rem] border-2 border-dashed p-6 text-center transition-all duration-300 outline-none',
                        'focus-within:ring-2 focus-within:ring-cyan-400/40 focus-within:ring-offset-2 focus-within:ring-offset-background',
                        isDragging
                            ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_20px_50px_rgba(34,211,238,0.12)]'
                            : 'border-border/70 bg-background/40 hover:border-cyan-400/50 hover:bg-background/60'
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload QR image to decode"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            fileInputRef.current?.click();
                        }
                    }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />

                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm transition-transform duration-300 group-hover:scale-105">
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
                        ) : (
                            <ImageIcon className="h-6 w-6 text-cyan-400" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold">{uploadPrompt}</p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF, WebP, and other image formats supported.
                        </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
                        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1">Drag and drop</span>
                        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1">Keyboard friendly</span>
                        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1">Client-side decode</span>
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                        Reading image and searching for a QR code.
                    </div>
                )}

                {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {result && (
                    <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-background/70 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/40 text-cyan-400 shadow-sm">
                                    {getIcon()}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                                            {result.type}
                                        </Badge>
                                        <Badge variant="outline" className="rounded-full border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                            {result.quality.label}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {result.quality.summary}
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setResult(null);
                                    setError(null);
                                    announce('Result cleared');
                                }}
                                className="h-9 w-9 rounded-full"
                                aria-label="Clear decoded result"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <ScanQualityMeter quality={result.quality} />

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Source file</div>
                                <div className="mt-1 truncate text-sm font-medium">{result.source.fileName}</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    {formatBytes(result.source.fileSize)} - {result.source.width}x{result.source.height}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Payload length</div>
                                <div className="mt-1 text-sm font-medium">{result.quality.payloadLength} characters</div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                    Decoded locally with jsQR
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Decoded content
                                </span>
                                <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                    {result.type}
                                </Badge>
                            </div>
                            <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-background px-3 py-3 text-sm leading-6 text-foreground">
                                {result.data}
                            </pre>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                            <Button
                                type="button"
                                onClick={() => void copyToClipboard()}
                                variant="default"
                                className="h-11 rounded-xl transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Copy className="h-4 w-4" />
                                Copy
                            </Button>
                            {RESULT_ACTION_TYPES.has(result.type) ? (
                                <Button
                                    type="button"
                                    onClick={openResult}
                                    variant="secondary"
                                    className="h-11 rounded-xl transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {getActionIcon()}
                                    {getActionLabel}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    variant="secondary"
                                    className="h-11 rounded-xl transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <FileDown className="h-4 w-4" />
                                    Upload another
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-xl border-border/70 bg-background/70 transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-4 w-4" />
                                New image
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
