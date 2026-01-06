export type QRType = 'URL' | 'TEXT' | 'WIFI' | 'VCARD' | 'EMAIL' | 'SMS' | 'PDF';

export interface QRData {
    type: QRType;
    // URL
    url?: string;
    // TEXT
    text?: string;
    // WIFI
    ssid?: string;
    password?: string;
    encryption?: 'WPA' | 'WEP' | 'nopass';
    hidden?: boolean;
    // VCARD
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    org?: string;
    website?: string;
    // EMAIL
    to?: string;
    subject?: string;
    body?: string;
    // SMS
    message?: string;
    // PDF
    pdfUrl?: string; // Uploaded URL
    pdfName?: string;
}

export const INITIAL_QR_DATA: QRData = {
    type: 'URL',
    url: 'https://example.com',
    encryption: 'WPA',
    hidden: false,
};
