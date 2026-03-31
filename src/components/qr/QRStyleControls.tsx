'use client'

import { useMemo, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPicker } from '@/components/ui/color-picker'
import { QRConfig, QR_PRESETS, QRStyleType, QREyeFrameType, QREyeBallType } from '@/lib/qr/config'
import { cn } from '@/lib/utils'
import { Grid2X2, Image as ImageIcon, Paintbrush, Shapes, Sparkles, Gauge, Eye, Layers3, UploadCloud, Trash2, type LucideIcon } from 'lucide-react'
import { MiniQRPreview, QRSection, SectionHint } from '@/components/qr/qr-ui'
import type { ReactNode } from 'react'

interface QRStyleControlsProps {
  config: QRConfig
  setConfig: (config: QRConfig) => void
}

function updatePresetConfig(config: QRConfig, presetName: string) {
  const preset = QR_PRESETS[presetName]
  if (!preset) return config
  return { ...config, ...preset }
}

function isPresetActive(config: QRConfig, presetName: string) {
  const preset = QR_PRESETS[presetName]
  return Boolean(
    preset &&
      config.shape === preset.shape &&
      config.eyeFrame === preset.eyeFrame &&
      config.eyeBall === preset.eyeBall
  )
}

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <Label className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{label}</Label>
        {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

function PresetCard({
  name,
  active,
  onSelect,
}: {
  name: string
  active: boolean
  onSelect: () => void
}) {
  const pattern = (QR_PRESETS[name]?.shape || 'square') as 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'group rounded-2xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'border-cyan-400/30 bg-cyan-400/10 shadow-[0_16px_48px_-28px_rgba(56,189,248,0.85)]'
          : 'border-border/70 bg-background/65 hover:border-border hover:bg-accent/35'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground capitalize">{name}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {active ? 'Active style' : 'Click to apply'}
          </div>
        </div>
        {active ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
            <Sparkles className="size-3.5" />
          </span>
        ) : (
          <span className="size-6 rounded-full border border-border/70" />
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <MiniQRPreview pattern={pattern} />
        <div className="flex-1 space-y-1 pl-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <Grid2X2 className="size-3.5" />
            <span>{QR_PRESETS[name]?.shape || 'square'}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <Eye className="size-3.5" />
            <span>{QR_PRESETS[name]?.eyeFrame || 'square'}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

function LogoUpload({
  image,
  onUpload,
  onRemove,
}: {
  image?: string
  onUpload: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    onUpload(file)
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'group relative flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed px-4 py-5 text-center transition-all duration-200',
          isDragging
            ? 'border-cyan-400/60 bg-cyan-400/10 shadow-[0_18px_50px_-30px_rgba(56,189,248,0.8)]'
            : 'border-border/70 bg-background/65 hover:border-border hover:bg-accent/35'
        )}
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          processFile(e.dataTransfer.files?.[0])
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => processFile(e.target.files?.[0])}
        />

        <div className="relative flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/80 text-cyan-300">
          <UploadCloud className="size-5" />
        </div>
        <div className="mt-4 space-y-1">
          <div className="text-sm font-medium text-foreground">Drop a logo or browse files</div>
          <div className="text-xs text-muted-foreground">PNG, JPG, SVG compatible. Keep contrast high for scannability.</div>
        </div>
      </div>

      {image ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/65 p-3">
          <div className="size-14 overflow-hidden rounded-xl border border-border/70 bg-background/80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Uploaded QR logo preview" className="h-full w-full object-contain p-1.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground">Logo applied</div>
            <div className="truncate text-xs text-muted-foreground">This is embedded directly into the QR styling layer.</div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function QRStyleControls({ config, setConfig }: QRStyleControlsProps) {
  const presetNames = useMemo(() => Object.keys(QR_PRESETS), [])

  const updateConfig = <K extends keyof QRConfig>(key: K, value: QRConfig[K]) => {
    setConfig({ ...config, [key]: value })
  }

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') updateConfig('image', result)
    }
    reader.readAsDataURL(file)
  }

  const styleGroups: Array<{
    key: string
    title: string
    description: string
    icon: LucideIcon
    defaultOpen?: boolean
    body: ReactNode
  }> = [
    {
      key: 'color',
      title: 'Color',
      description: 'Primary color and canvas background',
      icon: Paintbrush,
      defaultOpen: true,
      body: (
        <div className="grid gap-4 md:grid-cols-2">
          <FieldRow label="Foreground">
            <ColorPicker color={config.color} onChange={(color) => updateConfig('color', color)} className="w-full" />
          </FieldRow>
          <FieldRow label="Background">
            <ColorPicker
              color={config.backgroundColor}
              onChange={(color) => updateConfig('backgroundColor', color)}
              className="w-full"
            />
          </FieldRow>
        </div>
      ),
    },
    {
      key: 'shape',
      title: 'Shape',
      description: 'Module style and edge treatment',
      icon: Shapes,
      defaultOpen: true,
      body: (
        <div className="grid gap-4 md:grid-cols-2">
          <FieldRow label="Pattern" hint="Main QR modules">
            <Select value={config.shape} onValueChange={(value) => updateConfig('shape', value as QRStyleType)}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/70 text-sm">
                <SelectValue placeholder="Select pattern style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
                <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Density" hint="Scan-safe by default">
            <div className="rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Higher contrast and stronger margin preserve readability across output sizes.
            </div>
          </FieldRow>
        </div>
      ),
    },
    {
      key: 'eyes',
      title: 'Eyes',
      description: 'Finder frame and inner dot styling',
      icon: Eye,
      defaultOpen: true,
      body: (
        <div className="grid gap-4 md:grid-cols-2">
          <FieldRow label="Frame">
            <Select value={config.eyeFrame} onValueChange={(value) => updateConfig('eyeFrame', value as QREyeFrameType)}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/70 text-sm">
                <SelectValue placeholder="Select frame style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="classy">Classy</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
          <FieldRow label="Center">
            <Select value={config.eyeBall} onValueChange={(value) => updateConfig('eyeBall', value as QREyeBallType)}>
              <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/70 text-sm">
                <SelectValue placeholder="Select center style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
              </SelectContent>
            </Select>
          </FieldRow>
        </div>
      ),
    },
    {
      key: 'logo',
      title: 'Logo',
      description: 'Embed a brand asset without breaking the scan path',
      icon: ImageIcon,
      defaultOpen: true,
      body: (
        <LogoUpload
          image={config.image}
          onUpload={handleLogoUpload}
          onRemove={() => updateConfig('image', '')}
        />
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-border/70 bg-background/70 text-foreground shadow-[0_28px_90px_-52px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-background/80 to-transparent pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-300">
                <Sparkles className="size-3.5" />
                Style Studio
              </div>
              <div>
                <CardTitle className="text-xl">Visual design controls</CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Collapsible controls with live preview sync and scan-safe defaults.
                </CardDescription>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Palette</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="size-4 rounded-full border border-border/70" style={{ backgroundColor: config.color }} />
                <span className="size-4 rounded-full border border-border/70" style={{ backgroundColor: config.backgroundColor }} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <QRSection
            title="Preset gallery"
            description="Quick styles with small preview cards. These only change the safe, visual parts of the QR."
            icon={Layers3}
            defaultOpen
            action={<SectionHint>Choose a base look, then fine-tune below.</SectionHint>}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {presetNames.map((presetName) => (
                <PresetCard
                  key={presetName}
                  name={presetName}
                  active={isPresetActive(config, presetName)}
                  onSelect={() => setConfig(updatePresetConfig(config, presetName))}
                />
              ))}
            </div>
          </QRSection>

          {styleGroups.map((group) => (
            <QRSection
              key={group.key}
              title={group.title}
              description={group.description}
              icon={group.icon}
              defaultOpen={group.defaultOpen}
            >
              {group.body}
            </QRSection>
          ))}

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/8 px-4 py-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-cyan-300">
              <Gauge className="size-4" />
              Scan quality guidance
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep background and foreground colors separated. Avoid low-opacity logos and large decorative effects if the QR will be printed small.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
