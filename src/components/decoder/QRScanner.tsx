'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Copy, ExternalLink, Wifi, Mail, MessageSquare, User, FileText, Image as ImageIcon } from 'lucide-react';
import { decodeQRFromImage, DecodedQR } from '@/lib/qr/decoder';
import { cn } from '@/lib/utils';


export function QRScanner() {
    const [isDragging, setIsDragging] = useState(false);
    const [result, setResult] = useState<DecodedQR | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (file) processFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError("Please upload a valid image file.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const decoded = await decodeQRFromImage(file);
            if (decoded) {
                setResult(decoded);
            } else {
                setError("No QR code found in the image. Please try a clearer image.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to process image.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(result.data);
            // toast({ title: "Copied to clipboard" }); 
            alert("Copied!");
        }
    };

    const getAction = () => {
        if (!result) return null;
        switch (result.type) {
            case 'URL':
                return (
                    <Button onClick={() => window.open(result.data, '_blank')} className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" /> Open Link
                    </Button>
                );
            case 'EMAIL':
                return (
                    <Button onClick={() => window.location.href = result.data} className="w-full">
                        <Mail className="mr-2 h-4 w-4" /> Send Email
                    </Button>
                );
            // Add others as needed
            default:
                return (
                    <Button onClick={copyToClipboard} className="w-full">
                        <Copy className="mr-2 h-4 w-4" /> Copy Content
                    </Button>
                );
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
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Scan QR Image</CardTitle>
                <CardDescription>Upload an image containing a QR code to decode it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                        isDragging ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>

                {loading && <div className="text-center text-muted-foreground">Decoding...</div>}

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm flex items-center">
                        <X className="h-4 w-4 mr-2" /> {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                            <div className="p-2 bg-white dark:bg-slate-950 rounded border shadow-sm text-primary">
                                {getIcon()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {result.type}
                                    </span>
                                </div>
                                <p className="text-sm break-all font-mono">{result.data}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {getAction()}
                            <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                                <Copy className="mr-2 h-4 w-4" /> Copy
                            </Button>
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
