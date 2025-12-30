
export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface BusinessInfo {
  logo?: string;
  brandColor: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  taxId: string;
}

export interface ClientInfo {
  name: string;
  company: string;
  address: string;
  email: string;
  phone: string;
}

export interface InvoiceDetails {
  documentType: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
}

export interface FooterInfo {
  paymentInstructions: string;
  terms: string;
  thankYouMessage: string;
  signatureType: 'text' | 'image';
  signatureText: string;
  signatureImage?: string;
}

export interface InvoiceData {
  business: BusinessInfo;
  client: ClientInfo;
  details: InvoiceDetails;
  items: LineItem[];
  discount: number;
  taxRate: number;
  footer: FooterInfo;
}
