'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'

interface QRPreviewProps {
    data: string
    options?: any // QRCode.QRCodeToDataURLOptions
    className?: string
}

export function QRPreview({ data, options, className }: QRPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        // Default to a placeholder if no data
        const text = data || 'https://example.com'

        QRCode.toCanvas(canvasRef.current, text, {
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
            ...options
        }, (err: any) => {
            if (err) {
                console.error(err)
                setError(err.message)
            } else {
                setError(null)
            }
        })
    }, [data, options])

    return (
        <div className={cn("flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-xl border shadow-sm", className)}>
            <div className="relative group">
                <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
                {/* Overlay for actions could go here */}
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center break-all max-w-[280px]">
                {data || 'Enter content to update'}
            </p>
        </div>
    )
}
