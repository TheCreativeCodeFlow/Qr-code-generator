'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScanQuality } from '@/lib/qr/decoder';

interface ScanQualityMeterProps {
    quality?: ScanQuality | null;
    className?: string;
}

const QUALITY_STYLES: Record<ScanQuality['label'], { track: string; fill: string; tone: string }> = {
    Excellent: {
        track: 'bg-emerald-500/10',
        fill: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
        tone: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    },
    Good: {
        track: 'bg-sky-500/10',
        fill: 'bg-gradient-to-r from-sky-400 to-cyan-400',
        tone: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
    },
    Fair: {
        track: 'bg-amber-500/10',
        fill: 'bg-gradient-to-r from-amber-400 to-orange-400',
        tone: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
    },
    'Needs review': {
        track: 'bg-rose-500/10',
        fill: 'bg-gradient-to-r from-rose-400 to-orange-400',
        tone: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
    },
};

export function ScanQualityMeter({ quality, className }: ScanQualityMeterProps) {
    if (!quality) {
        return null;
    }

    const styles = QUALITY_STYLES[quality.label];

    return (
        <Card className={cn('border-border/70 bg-background/60 shadow-sm', className)}>
            <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium">Scan quality</p>
                        <p className="text-xs text-muted-foreground">{quality.summary}</p>
                    </div>
                    <Badge variant="outline" className={cn('border', styles.tone)}>
                        {quality.label}
                    </Badge>
                </div>

                <div className={cn('h-2 overflow-hidden rounded-full', styles.track)}>
                    <div
                        className={cn('h-full rounded-full transition-all duration-500 ease-out', styles.fill)}
                        style={{ width: `${quality.score}%` }}
                        aria-hidden="true"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                        <div className="text-[10px] uppercase tracking-[0.2em]">Score</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">{quality.score}/100</div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                        <div className="text-[10px] uppercase tracking-[0.2em]">Resolution</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">
                            {quality.resolution.width}x{quality.resolution.height}
                        </div>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/40 p-2">
                        <div className="text-[10px] uppercase tracking-[0.2em]">Payload</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">{quality.payloadLength} chars</div>
                    </div>
                </div>

                <ul className="space-y-1 text-xs text-muted-foreground">
                    {quality.notes.map((note) => (
                        <li key={note} className="flex gap-2">
                            <span className="mt-[0.35rem] h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                            <span>{note}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
