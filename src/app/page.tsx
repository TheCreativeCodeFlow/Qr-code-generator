'use client'

import { useState } from 'react'
import { QRParamsForm } from "@/components/qr-params-form"
import { QRPreview } from "@/components/qr-preview"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [data, setData] = useState("https://example.com")

  const handleDownload = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const a = document.createElement('a')
      a.href = url
      a.download = 'qrcode.png'
      a.click()
    }
  }

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

      <div className="container mx-auto py-8 px-4 md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Left: Configuration */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Generate QR Code</h1>
            <p className="text-muted-foreground">Select a type and enter your content to create a QR code immediately.</p>
          </div>
          <QRParamsForm onDataChange={setData} />
        </div>

        {/* Right: Preview (Sticky) */}
        <div className="lg:w-[400px]">
          <div className="sticky top-24 space-y-4">
            <QRPreview data={data} className="w-full aspect-square shadow-xl border-slate-200 dark:border-slate-800" />

            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" onClick={handleDownload} variant="default">
                <Download className="mr-2 h-4 w-4" /> Download PNG
              </Button>
              <Button className="w-full" variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground">
              High quality render • Error correction M
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
