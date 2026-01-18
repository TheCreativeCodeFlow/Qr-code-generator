'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { QRData, QRType } from '@/types/qr'
import { formatUrlData, formatWifiData, formatVCardData, formatEmailData, formatSMSData } from '@/lib/qr-utils'

interface QRParamsFormProps {
    onDataChange: (data: string) => void
}

export function QRParamsForm({ onDataChange }: QRParamsFormProps) {
    const [type, setType] = useState<QRType>('URL')
    const [values, setValues] = useState<QRData>({
        type: 'URL',
        url: 'https://',
        encryption: 'WPA'
    })

    // Propagate basic data immediately
    const updateValue = (key: keyof QRData, value: string | boolean) => {
        setValues(prev => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        const generate = () => {
            try {
                switch (type) {
                    case 'URL':
                        return formatUrlData(values.url || '')
                    case 'TEXT':
                        return values.text || ''
                    case 'WIFI':
                        return formatWifiData({ ssid: values.ssid || '', password: values.password, encryption: values.encryption, hidden: values.hidden })
                    case 'VCARD':
                        return formatVCardData({
                            firstName: values.firstName || '',
                            lastName: values.lastName || '',
                            phone: values.phone,
                            email: values.email,
                            org: values.org,
                            url: values.website
                        })
                    case 'EMAIL':
                        return formatEmailData({ to: values.to || '', subject: values.subject, body: values.body })
                    case 'SMS':
                        return formatSMSData({ phone: values.phone || '', message: values.message })
                    default:
                        return ''
                }
            } catch (e) {
                return ''
            }
        }
        const data = generate()
        if (data) onDataChange(data)
    }, [type, values, onDataChange])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>QR Content</CardTitle>
                <CardDescription>Choose content type and customize</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={type} onValueChange={(v) => setType(v as QRType)} className="w-full">
                    <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
                        {['URL', 'TEXT', 'WIFI', 'VCARD', 'EMAIL', 'SMS'].map(t => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border px-4 py-2"
                            >
                                {t}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="URL" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input
                                placeholder="https://example.com"
                                value={values.url || ''}
                                onChange={e => updateValue('url', e.target.value)}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="TEXT" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Plain Text</Label>
                            <Textarea
                                placeholder="Enter your text here..."
                                value={values.text || ''}
                                onChange={e => updateValue('text', e.target.value)}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="WIFI" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Network Name (SSID)</Label>
                            <Input value={values.ssid || ''} onChange={e => updateValue('ssid', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input type="password" value={values.password || ''} onChange={e => updateValue('password', e.target.value)} />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="space-y-2 flex-1">
                                <Label>Encryption</Label>
                                <Select value={values.encryption} onValueChange={v => updateValue('encryption', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WPA">WPA/WPA2</SelectItem>
                                        <SelectItem value="WEP">WEP</SelectItem>
                                        <SelectItem value="nopass">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Switch checked={values.hidden} onCheckedChange={c => updateValue('hidden', c)} />
                                <Label>Hidden Network</Label>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="VCARD" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input value={values.firstName || ''} onChange={e => updateValue('firstName', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={values.lastName || ''} onChange={e => updateValue('lastName', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input type="tel" value={values.phone || ''} onChange={e => updateValue('phone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={values.email || ''} onChange={e => updateValue('email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Website</Label>
                            <Input value={values.website || ''} onChange={e => updateValue('website', e.target.value)} />
                        </div>
                    </TabsContent>

                    <TabsContent value="EMAIL" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email To</Label>
                            <Input value={values.to || ''} onChange={e => updateValue('to', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input value={values.subject || ''} onChange={e => updateValue('subject', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea value={values.body || ''} onChange={e => updateValue('body', e.target.value)} />
                        </div>
                    </TabsContent>

                    <TabsContent value="SMS" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input type="tel" value={values.phone || ''} onChange={e => updateValue('phone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea value={values.message || ''} onChange={e => updateValue('message', e.target.value)} />
                        </div>
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    )
}
