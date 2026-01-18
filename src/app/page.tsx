'use client'

import { useState, useCallback } from 'react'
import { QRParamsForm } from "@/components/qr-params-form"
import { QRPreview } from "@/components/qr/QRPreview"
import { QRStyleControls } from "@/components/qr/QRStyleControls"
import { QRScanner } from "@/components/decoder/QRScanner"
import { ModeToggle } from "@/components/mode-toggle"
import { DEFAULT_CONFIG, QRConfig } from "@/lib/qr/config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate")
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG)

  const handleDataChange = useCallback((data: string) => {
    setConfig((prev) => ({ ...prev, data }))
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-8 h-14 flex items-center justify-between mx-auto">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-md p-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><rect width="5" height="5" x="7" y="7" /><rect width="5" height="5" x="12" y="7" /><rect width="5" height="5" x="7" y="12" /><rect width="5" height="5" x="12" y="12" /></svg>
            </div>
            <span className="font-bold text-lg">QR Master</span>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 md:px-8">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left Column: Controls */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">QR Generator</h1>
              </div>

              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="scan">Scan & Decode</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-6 mt-0">
                <QRParamsForm onDataChange={handleDataChange} />
                <QRStyleControls config={config} setConfig={setConfig} />
              </TabsContent>

              <TabsContent value="scan">
                <QRScanner />
              </TabsContent>
            </div>

            {/* Right Column: Preview */}
            <div className="lg:w-[400px]">
              <div className="sticky top-24 space-y-4">
                <QRPreview config={config} />

                <div className="text-xs text-center text-muted-foreground">
                  High quality render • Client-side only
                </div>
              </div>
            </div>

          </div>
        </Tabs>

      </div>
    </main>
  )
}
