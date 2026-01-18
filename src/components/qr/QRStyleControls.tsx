'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from '@/components/ui/color-picker';
import { QRConfig, QR_PRESETS, QRStyleType, QREyeFrameType, QREyeBallType } from '@/lib/qr/config';

interface QRStyleControlsProps {
    config: QRConfig;
    setConfig: (config: QRConfig) => void;
}

export function QRStyleControls({ config, setConfig }: QRStyleControlsProps) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateConfig = (key: keyof QRConfig, value: any) => {
        setConfig({ ...config, [key]: value });
    };

    const applyPreset = (presetName: string) => {
        const preset = QR_PRESETS[presetName];
        if (preset) {
            setConfig({ ...config, ...preset });
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result as string) {
                    updateConfig('image', e.target!.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Design & Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Presets */}
                <div className="space-y-2">
                    <Label>Presets</Label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(QR_PRESETS).map((preset) => (
                            <button
                                key={preset}
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-1 text-xs border rounded-full hover:bg-neutral-100 capitalize"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dots Options */}
                <div className="space-y-4">
                    <Label>Pattern Style</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Main Shape</Label>
                            <Select
                                value={config.shape}
                                onValueChange={(v) => updateConfig('shape', v as QRStyleType)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="square">Square</SelectItem>
                                    <SelectItem value="dots">Dots</SelectItem>
                                    <SelectItem value="rounded">Rounded</SelectItem>
                                    <SelectItem value="classy">Classy</SelectItem>
                                    <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Color</Label>
                            <ColorPicker color={config.color} onChange={(c) => updateConfig('color', c)} />
                        </div>
                    </div>
                </div>

                {/* Background */}
                <div className="space-y-2">
                    <Label>Background Color</Label>
                    <ColorPicker color={config.backgroundColor} onChange={(c) => updateConfig('backgroundColor', c)} />
                </div>

                {/* Eyes Options */}
                <div className="space-y-4 border-t pt-4">
                    <Label>Finder Eyes</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Frame</Label>
                            <Select
                                value={config.eyeFrame}
                                onValueChange={(v) => updateConfig('eyeFrame', v as QREyeFrameType)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="square">Square</SelectItem>
                                    <SelectItem value="circle">Circle</SelectItem>
                                    <SelectItem value="rounded">Rounded</SelectItem>
                                    <SelectItem value="classy">Classy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Center</Label>
                            <Select
                                value={config.eyeBall}
                                onValueChange={(v) => updateConfig('eyeBall', v as QREyeBallType)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="square">Square</SelectItem>
                                    <SelectItem value="circle">Circle</SelectItem>
                                    <SelectItem value="rounded">Rounded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Logo */}
                <div className="space-y-2 border-t pt-4">
                    <Label>Logo</Label>
                    <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                    {config.image && (
                        <div className="mt-2 text-xs text-red-500 cursor-pointer" onClick={() => updateConfig('image', '')}>
                            Remove Logo
                        </div>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}
