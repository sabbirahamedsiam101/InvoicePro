
import React from 'react';
import { InvoiceData } from '../types';

interface PreviewProps {
  data: InvoiceData;
}

const InvoicePreview: React.FC<PreviewProps> = ({ data }) => {
  const { business, client, details, items, discount, taxRate, footer } = data;

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const formatCurrency = (val: number) => {
    return `${details.currencySymbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div 
      className="bg-white shadow-2xl mx-auto my-0 invoice-container print-shadow-none overflow-hidden" 
      style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4 max-w-[50%]">
          {business.logo ? (
            <img src={business.logo} alt="Business Logo" className="max-h-24 max-w-full object-contain" />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 text-xs">Logo</div>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold uppercase tracking-tight" style={{ color: business.brandColor }}>
              {business.name || 'Your Business'}
            </h1>
            <p className="text-sm text-gray-500 whitespace-pre-wrap">{business.address}</p>
            <p className="text-sm text-gray-500">{business.email}</p>
            <p className="text-sm text-gray-500">{business.phone}</p>
            {business.website && <p className="text-sm text-gray-500">{business.website}</p>}
            {business.taxId && <p className="text-xs text-gray-400 mt-2">Tax ID: {business.taxId}</p>}
          </div>
        </div>

        <div className="text-right space-y-2">
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-widest">{details.documentType}</h2>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Number: <span className="text-gray-900 font-semibold">{details.invoiceNumber}</span></p>
            <p className="text-sm text-gray-500">Date: <span className="text-gray-900 font-semibold">{details.issueDate}</span></p>
            <p className="text-sm text-gray-500">Due Date: <span className="text-gray-900 font-semibold">{details.dueDate}</span></p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bill To:</h3>
          <p className="font-bold text-lg text-gray-900">{client.name}</p>
          <p className="text-gray-600">{client.company}</p>
          <p className="text-gray-500 text-sm whitespace-pre-wrap mt-1">{client.address}</p>
          <p className="text-gray-500 text-sm">{client.email}</p>
          <p className="text-gray-500 text-sm">{client.phone}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2" style={{ borderColor: business.brandColor }}>
            <th className="text-left py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
            <th className="text-center py-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">Qty</th>
            <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Price</th>
            <th className="text-right py-3 text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-4">
                <p className="font-semibold text-gray-900">{item.name || 'Untitled Item'}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </td>
              <td className="py-4 text-center text-gray-600">{item.quantity}</td>
              <td className="py-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
              <td className="py-4 text-right font-semibold text-gray-900">{formatCurrency(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Discount ({discount}%)</span>
              <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {taxRate > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax ({taxRate}%)</span>
              <span className="text-gray-900">{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-3">
            <span className="font-bold text-gray-900">Total Due</span>
            <span className="font-bold text-xl" style={{ color: business.brandColor }}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-2 gap-12 mt-auto">
        <div className="space-y-6">
          {footer.paymentInstructions && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Payment Instructions</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{footer.paymentInstructions}</p>
            </div>
          )}
          {footer.terms && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Terms & Conditions</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{footer.terms}</p>
            </div>
          )}
          {footer.thankYouMessage && (
            <p className="text-sm font-medium italic text-gray-500">{footer.thankYouMessage}</p>
          )}
        </div>

        <div className="flex flex-col items-end justify-end">
          <div className="w-48 text-center">
            {footer.signatureType === 'text' && footer.signatureText && (
              <p className="signature-font text-3xl border-b border-gray-300 pb-2 mb-2" style={{ color: business.brandColor }}>
                {footer.signatureText}
              </p>
            )}
            {footer.signatureType === 'image' && footer.signatureImage && (
              <img src={footer.signatureImage} alt="Signature" className="max-h-16 mx-auto mb-2 border-b border-gray-300" />
            )}
            {!footer.signatureText && !footer.signatureImage && (
              <div className="h-16 border-b border-gray-200 mb-2"></div>
            )}
            <p className="text-xs font-bold text-gray-400 uppercase">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
