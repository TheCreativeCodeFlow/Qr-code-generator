export type QRType = 'URL' | 'TEXT' | 'WIFI' | 'VCARD' | 'EMAIL' | 'SMS' | 'APP' | 'PDF';

/**
 * Formats data for WiFi QR Code
 */
export function formatWifiData({ ssid, password, encryption = 'WPA', hidden = false }: { ssid: string; password?: string; encryption?: 'WPA' | 'WEP' | 'nopass'; hidden?: boolean }): string {
  // Format: WIFI:T:WPA;S:MyNetwork;P:MyPass;H:false;;
  // Characters must be escaped: \ -> \\, ; -> \;, , -> \, , : -> \:
  const escape = (str: string) => str.replace(/([\\;,:])/g, '\\$1');
  return `WIFI:T:${encryption};S:${escape(ssid)};P:${escape(password || '')};H:${hidden};;`;
}

/**
 * Formats data for vCard 3.0
 */
export function formatVCardData({ firstName, lastName, phone, email, org, url }: { firstName: string; lastName: string; phone?: string; email?: string; org?: string; url?: string }): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${firstName} ${lastName}`,
    org ? `ORG:${org}` : '',
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    email ? `EMAIL:${email}` : '',
    url ? `URL:${url}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');
}

/**
 * Formats data for Email
 */
export function formatEmailData({ to, subject, body }: { to: string; subject?: string; body?: string }): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject || '')}&body=${encodeURIComponent(body || '')}`;
}

/**
 * Formats data for SMS
 */
export function formatSMSData({ phone, message }: { phone: string; message?: string }): string {
  return `SMSTO:${phone}:${message || ''}`;
}

export function formatUrlData(url: string): string {
  // Basic validation or prepending https if needed
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
}
