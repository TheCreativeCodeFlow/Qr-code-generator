'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { QRData } from '@/types/qr'
import { formatEmailData, formatSMSData, formatUrlData, formatVCardData, formatWifiData } from '@/lib/qr-utils'
import { CONTENT_TABS, SegmentedTabSelector, SectionHint, type ContentTabValue } from '@/components/qr/qr-ui'
import { Link2, Keyboard, QrCode, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface QRParamsFormProps {
  onDataChange: (data: string) => void
}

type FieldShellProps = {
  label: string
  hint?: string
  children: ReactNode
}

function FieldShell({ label, hint, children }: FieldShellProps) {
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

export function QRParamsForm({ onDataChange }: QRParamsFormProps) {
  const [type, setType] = useState<ContentTabValue>('URL')
  const [values, setValues] = useState<QRData>({
    type: 'URL',
    url: 'https://',
    encryption: 'WPA',
    hidden: false,
  })

  const updateValue = <K extends keyof QRData>(key: K, value: QRData[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const generatedData = useMemo(() => {
    try {
      switch (type) {
        case 'URL':
          return formatUrlData(values.url || '')
        case 'TEXT':
          return values.text || ''
        case 'WIFI':
          return formatWifiData({
            ssid: values.ssid || '',
            password: values.password,
            encryption: values.encryption,
            hidden: values.hidden,
          })
        case 'VCARD':
          return formatVCardData({
            firstName: values.firstName || '',
            lastName: values.lastName || '',
            phone: values.phone,
            email: values.email,
            org: values.org,
            url: values.website,
          })
        case 'EMAIL':
          return formatEmailData({ to: values.to || '', subject: values.subject, body: values.body })
        case 'SMS':
          return formatSMSData({ phone: values.phone || '', message: values.message })
        default:
          return ''
      }
    } catch {
      return ''
    }
  }, [type, values])

  useEffect(() => {
    onDataChange(generatedData)
  }, [generatedData, onDataChange])

  const contentHint = CONTENT_TABS.find((tab) => tab.value === type)?.description ?? 'Choose a content type'

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-border/70 bg-background/70 text-foreground shadow-[0_28px_90px_-52px_rgba(15,23,42,0.45)] backdrop-blur">
        <CardHeader className="border-b border-border/60 bg-gradient-to-r from-background/80 to-transparent pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-300">
                <QrCode className="size-3.5" />
                Content Builder
              </div>
              <div>
                <CardTitle className="text-xl">Choose what the QR should encode</CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Structured content forms with immediate preview sync.
                </CardDescription>
              </div>
            </div>
            <div className="hidden rounded-2xl border border-border/70 bg-background/70 p-3 text-right md:block">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Mode</div>
              <div className="mt-1 text-sm font-medium text-foreground">{type}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-5">
          <SegmentedTabSelector value={type} onValueChange={(next) => setType(next)} />

          <div
            role="tabpanel"
            id={`qr-content-panel-${type}`}
            aria-labelledby={`qr-content-tab-${type}`}
            className="rounded-2xl border border-border/70 bg-background/60 p-4 shadow-inner"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-foreground">{contentHint}</div>
                <div className="mt-1 text-xs text-muted-foreground">Keyboard friendly tabs, smooth state changes, no feature loss.</div>
              </div>
              <SectionHint>
                Current payload updates instantly as fields change.
              </SectionHint>
            </div>

            <div className="space-y-4">
              {type === 'URL' && (
                <FieldShell label="Website URL" hint="Starts with https:// if missing">
                  <Input
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="https://example.com"
                    value={values.url || ''}
                    onChange={(e) => updateValue('url', e.target.value)}
                  />
                </FieldShell>
              )}

              {type === 'TEXT' && (
                <FieldShell label="Plain text" hint="Any short message or note">
                  <Textarea
                    placeholder="Enter your text here..."
                    value={values.text || ''}
                    onChange={(e) => updateValue('text', e.target.value)}
                    className="min-h-32"
                  />
                </FieldShell>
              )}

              {type === 'WIFI' && (
                <div className="grid gap-4">
                  <FieldShell label="Network name" hint="SSID">
                    <Input
                      placeholder="MyNetwork"
                      value={values.ssid || ''}
                      onChange={(e) => updateValue('ssid', e.target.value)}
                    />
                  </FieldShell>

                  <FieldShell label="Password" hint="Hidden by default in the field">
                    <Input
                      type="password"
                      autoComplete="current-password"
                      value={values.password || ''}
                      onChange={(e) => updateValue('password', e.target.value)}
                    />
                  </FieldShell>

                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <FieldShell label="Encryption">
                      <Select value={values.encryption} onValueChange={(v) => updateValue('encryption', v as QRData['encryption'])}>
                        <SelectTrigger className="h-11 w-full rounded-xl border-border/70 bg-background/70 text-sm">
                          <SelectValue placeholder="Select encryption" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA / WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldShell>

                    <div className="flex items-end justify-between rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Hidden</div>
                        <div className="mt-1 text-sm text-muted-foreground">Broadcast off</div>
                      </div>
                      <Switch checked={Boolean(values.hidden)} onCheckedChange={(checked) => updateValue('hidden', checked)} />
                    </div>
                  </div>
                </div>
              )}

              {type === 'VCARD' && (
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FieldShell label="First name">
                      <Input value={values.firstName || ''} onChange={(e) => updateValue('firstName', e.target.value)} />
                    </FieldShell>
                    <FieldShell label="Last name">
                      <Input value={values.lastName || ''} onChange={(e) => updateValue('lastName', e.target.value)} />
                    </FieldShell>
                  </div>
                  <FieldShell label="Phone number">
                    <Input type="tel" inputMode="tel" value={values.phone || ''} onChange={(e) => updateValue('phone', e.target.value)} />
                  </FieldShell>
                  <FieldShell label="Email address">
                    <Input type="email" autoComplete="email" value={values.email || ''} onChange={(e) => updateValue('email', e.target.value)} />
                  </FieldShell>
                  <FieldShell label="Website">
                    <Input type="url" inputMode="url" value={values.website || ''} onChange={(e) => updateValue('website', e.target.value)} />
                  </FieldShell>
                </div>
              )}

              {type === 'EMAIL' && (
                <div className="grid gap-4">
                  <FieldShell label="Recipient email">
                    <Input type="email" autoComplete="email" value={values.to || ''} onChange={(e) => updateValue('to', e.target.value)} />
                  </FieldShell>
                  <FieldShell label="Subject">
                    <Input value={values.subject || ''} onChange={(e) => updateValue('subject', e.target.value)} />
                  </FieldShell>
                  <FieldShell label="Message">
                    <Textarea value={values.body || ''} onChange={(e) => updateValue('body', e.target.value)} className="min-h-28" />
                  </FieldShell>
                </div>
              )}

              {type === 'SMS' && (
                <div className="grid gap-4">
                  <FieldShell label="Phone number">
                    <Input type="tel" inputMode="tel" value={values.phone || ''} onChange={(e) => updateValue('phone', e.target.value)} />
                  </FieldShell>
                  <FieldShell label="Message">
                    <Textarea value={values.message || ''} onChange={(e) => updateValue('message', e.target.value)} className="min-h-28" />
                  </FieldShell>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-gradient-to-br from-background/85 to-background/55 text-foreground shadow-[0_20px_70px_-42px_rgba(15,23,42,0.38)] backdrop-blur">
        <CardContent className="grid gap-3 !px-4 !py-4 sm:grid-cols-3">
          {[
            { label: 'Content types', value: '6', icon: Type },
            { label: 'Live sync', value: 'On', icon: Link2 },
            { label: 'Accessibility', value: 'Keyboard-first', icon: Keyboard },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 px-3 py-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-background/80 text-cyan-300">
                <Icon className="size-4" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                <div className={cn('text-sm font-medium text-foreground')}>{value}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
