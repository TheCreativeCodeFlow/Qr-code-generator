'use client'

import * as React from 'react'
import { Check, ChevronDown, SquareDashedMousePointer, Type, Wifi, Mail, MessageSquare, Contact, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ContentTabValue = 'URL' | 'TEXT' | 'WIFI' | 'VCARD' | 'EMAIL' | 'SMS'

type ContentTabMeta = {
  value: ContentTabValue
  label: string
  description: string
  icon: LucideIcon
}

export const CONTENT_TABS: ContentTabMeta[] = [
  { value: 'URL', label: 'Link', description: 'Web address', icon: SquareDashedMousePointer },
  { value: 'TEXT', label: 'Text', description: 'Plain content', icon: Type },
  { value: 'WIFI', label: 'Wi-Fi', description: 'Network access', icon: Wifi },
  { value: 'VCARD', label: 'Contact', description: 'People details', icon: Contact },
  { value: 'EMAIL', label: 'Email', description: 'Mailto action', icon: Mail },
  { value: 'SMS', label: 'SMS', description: 'Text message', icon: MessageSquare },
]

interface SegmentedTabSelectorProps {
  value: ContentTabValue
  onValueChange: (value: ContentTabValue) => void
}

export function SegmentedTabSelector({ value, onValueChange }: SegmentedTabSelectorProps) {
  const tabs = CONTENT_TABS

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.value === value)
    if (currentIndex === -1) return

    const move = (nextIndex: number) => {
      const normalized = (nextIndex + tabs.length) % tabs.length
      onValueChange(tabs[normalized].value)
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        move(currentIndex + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        move(currentIndex - 1)
        break
      case 'Home':
        event.preventDefault()
        onValueChange(tabs[0].value)
        break
      case 'End':
        event.preventDefault()
        onValueChange(tabs[tabs.length - 1].value)
        break
      default:
        break
    }
  }

  return (
    <div
      role="tablist"
      aria-label="QR content type"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 gap-2 rounded-2xl border border-border/70 bg-background/70 p-2 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:grid-cols-3"
    >
      {tabs.map((tab) => {
        const selected = tab.value === value
        const Icon = tab.icon

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`qr-content-panel-${tab.value}`}
            id={`qr-content-tab-${tab.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              'group relative overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              selected
                ? 'border-cyan-400/30 bg-gradient-to-br from-cyan-500/15 to-sky-500/10 shadow-[0_16px_40px_-24px_rgba(56,189,248,0.8)]'
                : 'border-border/70 bg-background/70 hover:border-border hover:bg-accent/40'
            )}
          >
            {selected && <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-xl border transition-colors',
                  selected
                    ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
                    : 'border-border/70 bg-background/80 text-muted-foreground group-hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className={cn('text-sm font-medium', selected ? 'text-foreground' : 'text-foreground/90')}>
                  {tab.label}
                </div>
                <div className="text-xs text-muted-foreground">{tab.description}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={cn('text-[11px] uppercase tracking-[0.2em]', selected ? 'text-cyan-300' : 'text-muted-foreground')}>
                {tab.value}
              </span>
              {selected ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-cyan-400 text-slate-950">
                  <Check className="size-3.5" />
                </span>
              ) : (
                <span className="size-5 rounded-full border border-border/70" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

interface QRSectionProps {
  title: string
  description: string
  icon: LucideIcon
  defaultOpen?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}

export function QRSection({ title, description, icon: Icon, defaultOpen = true, action, children }: QRSectionProps) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-border/70 bg-background/70 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-4 outline-none transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/80 text-cyan-300">
            <Icon className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="mt-1 text-xs leading-5 text-muted-foreground">{description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <ChevronDown className="mt-1 size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </details>
  )
}

export function MiniQRPreview({ pattern = 'square' }: { pattern?: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded' }) {
  const classes: Record<string, string> = {
    square: 'rounded-sm',
    rounded: 'rounded-md',
    dots: 'rounded-full',
    classy: 'rounded-[2px]',
    'classy-rounded': 'rounded-[5px]',
    'extra-rounded': 'rounded-[7px]',
  }

  return (
    <div className="relative flex size-14 items-center justify-center rounded-xl border border-border/70 bg-background/80 p-2">
      <div className="grid grid-cols-5 gap-0.5">
        {Array.from({ length: 25 }).map((_, index) => {
          const active = [0, 1, 2, 5, 7, 10, 12, 13, 16, 18, 20, 21, 22, 24].includes(index)
          const isFinder = [0, 1, 5, 6, 20, 21].includes(index)

          return (
            <span
              key={index}
              className={cn(
                'block size-1.5',
                classes[pattern],
                active ? 'bg-foreground' : 'bg-foreground/10',
                isFinder ? 'bg-cyan-300' : ''
              )}
            />
          )
        })}
      </div>
      <span className="absolute inset-x-2 bottom-2 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 opacity-80" />
    </div>
  )
}

export function SectionHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-muted-foreground">{children}</p>
}
