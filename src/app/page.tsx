'use client'

import { useState, useCallback } from 'react'
import { QRParamsForm } from "@/components/qr-params-form"
import { QRPreview } from "@/components/qr/QRPreview"
import { QRStyleControls } from "@/components/qr/QRStyleControls"
import { QRScanner } from "@/components/decoder/QRScanner"
import { ModeToggle } from "@/components/mode-toggle"
import { DEFAULT_CONFIG, QRConfig } from "@/lib/qr/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QrCode, ScanLine, Sparkles, ShieldCheck } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate")
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG)

  const handleDataChange = useCallback((data: string) => {
    setConfig((prev) => ({ ...prev, data }))
  }, [])

  return (
    <main className="min-h-screen pb-8">
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1700px] items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-2 text-primary-foreground shadow-lg shadow-primary/30">
              <QrCode className="size-5" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">QR Master</p>
              <p className="text-xs text-muted-foreground">Product-grade QR creation suite</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground lg:inline-flex">
              Frontend-only
            </Badge>
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1700px] px-4 py-6 md:px-8 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold md:text-4xl">Create and Decode in One Workspace</h1>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Build scan-safe QR codes with advanced style controls, then validate results instantly using local image decoding.
              </p>
            </div>

            <TabsList className="grid h-11 w-full grid-cols-2 rounded-2xl border border-border/80 bg-background/60 p-1.5 sm:w-[320px]">
              <TabsTrigger
                value="generate"
                className="rounded-xl text-sm font-semibold data-[state=active]:shadow-sm"
              >
                <Sparkles className="size-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="scan"
                className="rounded-xl text-sm font-semibold data-[state=active]:shadow-sm"
              >
                <ScanLine className="size-4" />
                Scan & Decode
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="mt-0">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(440px,1.2fr)_minmax(0,1.05fr)] 2xl:grid-cols-[minmax(0,1fr)_560px_minmax(0,1fr)]">
              <section className="space-y-6">
                <div className="surface-card glass-border rounded-2xl border p-4 text-xs text-muted-foreground md:text-sm">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 text-primary" />
                    <p>Left panel controls your payload, center panel keeps scannability visible, and right panel handles styling without context switching.</p>
                  </div>
                </div>
                <QRParamsForm onDataChange={handleDataChange} />
              </section>

              <section className="xl:sticky xl:top-24 xl:self-start">
                <QRPreview config={config} />
              </section>

              <section className="space-y-6">
                <QRStyleControls config={config} setConfig={setConfig} />
                <div className="surface-card glass-border rounded-2xl border p-4 text-xs text-muted-foreground md:text-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 size-4 text-primary" />
                    <p>Style updates are applied live while preserving error-correction-safe structure for reliable scans.</p>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="mt-0">
            <div className="grid gap-6 xl:grid-cols-[minmax(220px,0.85fr)_minmax(0,1.6fr)_minmax(220px,0.85fr)]">
              <div className="surface-card glass-border hidden rounded-2xl border p-4 text-sm text-muted-foreground xl:block">
                <p className="mb-2 font-semibold text-foreground">Scan Tips</p>
                <p>Use a high-contrast image, avoid blur, and keep quiet-zone margins visible around the QR code.</p>
              </div>
              <div className="xl:col-span-1">
                <QRScanner />
              </div>
              <div className="surface-card glass-border hidden rounded-2xl border p-4 text-sm text-muted-foreground xl:block">
                <p className="mb-2 font-semibold text-foreground">Privacy</p>
                <p>All decoding runs in your browser. Uploaded images stay client-side and are not sent to a server.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
