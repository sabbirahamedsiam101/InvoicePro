import React, { useState, useRef } from "react";
import {
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Image as ImageIcon,
  CreditCard,
  User,
  FileText,
  Settings,
  Layout,
} from "lucide-react";
import { InvoiceData, LineItem } from "./types";
import { Input, TextArea } from "./components/Input";
import InvoicePreview from "./components/InvoicePreview";

const INITIAL_STATE: InvoiceData = {
  business: {
    brandColor: "#2563eb",
    name: "OneSphere Solution",
    address: "Corporis ut ea asper",
    email: "clientcare.onespheresolution@gmail.com",
    phone: "+1 (335) 164-5254",
    website: "https://onespheresolution.com",
    taxId: "Ea velit quo iusto",
  },
  client: {
    name: "John Doe",
    company: "Client Company",
    address: "123 Client Street City, State 12345 Country",
    email: "client@company.com",
    phone: "+1 (555) 000-0000",
  },
  details: {
    documentType: "Invoice",
    invoiceNumber: "INV-202512-172",
    issueDate: "2025-12-30",
    dueDate: "2026-01-29",
    currency: "USD",
    currencySymbol: "$",
  },
  items: [
    {
      id: "1",
      name: "Item name",
      description: "Description",
      quantity: 0,
      price: 0,
    },
  ],
  discount: 0,
  taxRate: 0,
  footer: {
    paymentInstructions:
      "Bank: ABC Bank Account: 1234567890 Routing: 987654321",
    terms: "Payment is due within 30 days of invoice date...",
    thankYouMessage: "Thank you for your business!",
    signatureType: "text",
    signatureText: "Sabbir",
  },
};

const App: React.FC = () => {
  const [data, setData] = useState<InvoiceData>(INITIAL_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  const updateBusiness = (updates: Partial<InvoiceData["business"]>) => {
    setData((prev) => ({
      ...prev,
      business: { ...prev.business, ...updates },
    }));
  };

  const updateClient = (updates: Partial<InvoiceData["client"]>) => {
    setData((prev) => ({ ...prev, client: { ...prev.client, ...updates } }));
  };

  const updateDetails = (updates: Partial<InvoiceData["details"]>) => {
    setData((prev) => ({ ...prev, details: { ...prev.details, ...updates } }));
  };

  const updateFooter = (updates: Partial<InvoiceData["footer"]>) => {
    setData((prev) => ({ ...prev, footer: { ...prev.footer, ...updates } }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      description: "",
      quantity: 1,
      price: 0,
    };
    setData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id: string, updates: Partial<LineItem>) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "signature"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          updateBusiness({ logo: reader.result as string });
        } else {
          updateFooter({ signatureImage: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    if (confirm("Are you sure you want to reset the entire form?")) {
      setData(INITIAL_STATE);
    }
  };

  const handleDownload = async () => {
    if (!downloadRef.current) return;
    setIsGenerating(true);

    const element = downloadRef.current;
    const opt = {
      margin: 0,
      filename: `${data.details.documentType}_${data.details.invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try the standard Print function.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
      {/* Sticky Top Bar - Full width with 50px padding */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-[50px] py-4 no-print w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                InvoicePro
              </h1>
              <p className="text-xs text-gray-500">Live Invoice Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full px-[50px] py-[40px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Editor Side */}
        <div className="space-y-8 no-print pb-24">
          {/* Business Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <Settings className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Your Business</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Business Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {data.business.logo && (
                      <img
                        src={data.business.logo}
                        className="w-12 h-12 rounded object-contain border bg-gray-50"
                      />
                    )}
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group">
                      <ImageIcon
                        size={18}
                        className="text-gray-400 group-hover:text-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">
                        Upload Logo
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "logo")}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.business.brandColor}
                      onChange={(e) =>
                        updateBusiness({ brandColor: e.target.value })
                      }
                      className="w-10 h-10 p-0 border-0 rounded-lg cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-gray-400 font-mono uppercase">
                      {data.business.brandColor}
                    </span>
                  </div>
                </div>
              </div>

              <Input
                label="Business Name *"
                value={data.business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextArea
                label="Address"
                value={data.business.address}
                onChange={(e) => updateBusiness({ address: e.target.value })}
              />
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={data.business.email}
                  onChange={(e) => updateBusiness({ email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={data.business.phone}
                  onChange={(e) => updateBusiness({ phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Website"
                value={data.business.website}
                onChange={(e) => updateBusiness({ website: e.target.value })}
              />
              <Input
                label="Tax ID / VAT"
                value={data.business.taxId}
                onChange={(e) => updateBusiness({ taxId: e.target.value })}
              />
            </div>
          </section>

          {/* Client Section */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <User className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Bill To</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Client Name *"
                value={data.client.name}
                onChange={(e) => updateClient({ name: e.target.value })}
              />
              <Input
                label="Company"
                value={data.client.company}
                onChange={(e) => updateClient({ company: e.target.value })}
              />
            </div>
            <TextArea
              label="Address"
              value={data.client.address}
              onChange={(e) => updateClient({ address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                value={data.client.email}
                onChange={(e) => updateClient({ email: e.target.value })}
              />
              <Input
                label="Phone"
                value={data.client.phone}
                onChange={(e) => updateClient({ phone: e.target.value })}
              />
            </div>
          </section>

          {/* Invoice Details */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <Layout className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">
                Invoice Details
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Document Type"
                value={data.details.documentType}
                onChange={(e) =>
                  updateDetails({ documentType: e.target.value })
                }
              />
              <Input
                label="Invoice Number"
                value={data.details.invoiceNumber}
                onChange={(e) =>
                  updateDetails({ invoiceNumber: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Issue Date"
                type="date"
                value={data.details.issueDate}
                onChange={(e) => updateDetails({ issueDate: e.target.value })}
              />
              <Input
                label="Due Date"
                type="date"
                value={data.details.dueDate}
                onChange={(e) => updateDetails({ dueDate: e.target.value })}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Currency
                </label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-black"
                  value={data.details.currency}
                  onChange={(e) => {
                    const symbol =
                      e.target.value === "BD"
                      ? "৳"
                      : e.target.value === "EUR"
                      ? "€"
                      : "$";
                    updateDetails({
                      currency: e.target.value,
                      currencySymbol: symbol,
                    });
                  }}
                >
                  <option value="BD" className="text-black">
                    BD - Bangladeshi Taka
                  </option>
                  <option value="USD" className="text-black">
                    $ USD - US Dollar
                  </option>
                  <option value="EUR" className="text-black">
                    € EUR - Euro
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* Line Items */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-gray-900">Line Items</h2>
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
              >
                <Plus size={16} />
                Add Line Item
              </button>
            </div>

            <div className="space-y-4">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-xl space-y-4 group relative"
                >
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-5">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 text-sm">
                          {data.details.currencySymbol}
                        </span>
                        <Input
                          type="number"
                          className="pl-7"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(item.id, {
                              price: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <Input
                    placeholder="Description (optional)"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-gray-50 pt-6">
              <div className="space-y-4">
                <Input
                  label="Discount (%)"
                  type="number"
                  value={data.discount}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      discount: Number(e.target.value),
                    }))
                  }
                />
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={data.taxRate}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      taxRate: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 flex flex-col justify-center">
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="text-black">Subtotal:</span>
                  <span className="text-black">
                    {data.details.currencySymbol}
                    {data.items
                      .reduce((a, b) => a + b.quantity * b.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
                  <span className="text-black">Grand Total:</span>
                  <span className="text-black">
                    {data.details.currencySymbol}
                    {(() => {
                      const sub = data.items.reduce(
                        (a, b) => a + b.quantity * b.price,
                        0
                      );
                      const disc = (sub * data.discount) / 100;
                      const tax = ((sub - disc) * data.taxRate) / 100;
                      return (sub - disc + tax).toFixed(2);
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer & Signature */}
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <FileText className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">
                Footer & Signature
              </h2>
            </div>
            <TextArea
              label="Payment Instructions"
              value={data.footer.paymentInstructions}
              onChange={(e) =>
                updateFooter({ paymentInstructions: e.target.value })
              }
            />
            <TextArea
              label="Terms & Conditions"
              value={data.footer.terms}
              onChange={(e) => updateFooter({ terms: e.target.value })}
            />
            <Input
              label="Thank You Message"
              value={data.footer.thankYouMessage}
              onChange={(e) =>
                updateFooter({ thankYouMessage: e.target.value })
              }
            />

            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700">
                Signature
              </label>
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
                <button
                  onClick={() => updateFooter({ signatureType: "text" })}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                    data.footer.signatureType === "text"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Type Name
                </button>
                <button
                  onClick={() => updateFooter({ signatureType: "image" })}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                    data.footer.signatureType === "image"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upload Image
                </button>
              </div>

              {data.footer.signatureType === "text" ? (
                <Input
                  placeholder="Type your name for signature"
                  value={data.footer.signatureText}
                  onChange={(e) =>
                    updateFooter({ signatureText: e.target.value })
                  }
                />
              ) : (
                <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <ImageIcon size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    Upload Signature Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "signature")}
                  />
                </label>
              )}
            </div>
          </section>
        </div>

        {/* Preview Side */}
        <div className="lg:sticky lg:top-28 w-full">
          <div className="bg-white p-2 rounded-2xl shadow-xl overflow-hidden no-print mb-4 border border-gray-100">
            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">
              Live Preview
            </div>
            <div className="flex justify-center bg-slate-100 py-8 rounded-xl">
              <div className="scale-[0.4] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.5] xl:scale-[0.75] origin-top transition-transform duration-300">
                <InvoicePreview data={data} />
              </div>
            </div>
          </div>

          {/* Hidden full-size area for PDF generation */}
          <div className="fixed left-[-9999px] top-0">
            <div ref={downloadRef}>
              <InvoicePreview data={data} />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full px-[50px] py-12 text-center text-gray-400 text-sm no-print border-t border-gray-200 bg-white">
        &copy; 2025 InvoicePro. Professional invoicing made easy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default App;
