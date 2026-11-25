import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Sale, FiscalInvoice } from '../types';
import { formatMoney, formatDate } from '../utils';
import { Language, translations, translateProductName, translateCustomerName } from '../i18n';
import { FileCheck2, Printer, ShieldAlert, QrCode } from 'lucide-react';
import { Button, Badge, Card } from '../components/ui';

interface FiscalInvoiceViewProps {
  currency: string;
  lang: Language;
  initialSaleId?: number;
}

export const FiscalInvoiceView: React.FC<FiscalInvoiceViewProps> = ({ currency, lang, initialSaleId }) => {
  const t = translations[lang];
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(initialSaleId || null);
  const [fiscalData, setFiscalData] = useState<FiscalInvoice | null>(null);

  useEffect(() => {
    api.getSales().then(data => {
      setSales(data);
      if (!selectedSaleId && data.length > 0) {
        setSelectedSaleId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedSaleId) {
      api.getFiscalInvoice(selectedSaleId)
        .then(setFiscalData)
        .catch(err => alert(err.message));
    }
  }, [selectedSaleId]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#0D9488]" />
            {t.fiscalTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.fiscalSubtitle}
          </p>
        </div>
        <Button
          variant="navy"
          size="md"
          icon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          {t.btnPrintInvoice}
        </Button>
      </div>

      {/* MANDATORY LEGAL DISCLAIMER BANNER */}
      <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-extrabold text-xs text-amber-950 uppercase tracking-wide">
            {t.fiscalGuardrailTitle}
          </h3>
          <p className="text-xs font-bold text-amber-900 mt-0.5">
            {t.fiscalDisclaimerBold}
          </p>
          <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
            {t.fiscalDisclaimerSub}
          </p>
        </div>
      </div>

      {/* Sale Selector for Preview */}
      <Card padding="sm" className="no-print bg-white">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">{t.selectTxToView}</label>
          <select
            value={selectedSaleId || ''}
            onChange={(e) => setSelectedSaleId(Number(e.target.value))}
            className="p-2 border border-slate-200 rounded-lg text-xs font-medium bg-[#F5F7FA] flex-1 max-w-md focus:outline-none focus:border-[#0D9488]"
          >
            {sales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.invoice_number} — {translateCustomerName(s.customer_name, lang) || t.walkInCustomer} ({formatMoney(s.total, currency)}) - {formatDate(s.created_at)}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* INVOICE DOCUMENT PAPER PREVIEW (PRINT AREA) */}
      {fiscalData && (
        <div className="print-area bg-white border border-slate-300 rounded-2xl shadow-xl max-w-3xl mx-auto p-8 space-y-6 text-slate-800 font-sans">
          {/* Top Bar: Company & DGI Facture Normalisée Stamp */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900 tracking-tight">DRC SMART POS</span>
                <Badge variant="teal" size="sm">RDC</Badge>
              </div>
              <p className="font-bold text-xs text-slate-800">{fiscalData.seller.company_name}</p>
              <p className="text-xs text-slate-600">{fiscalData.seller.address}</p>
              <p className="text-xs text-slate-600">Kinshasa, République Démocratique du Congo</p>
              <div className="text-[11px] font-mono text-slate-700 pt-1 space-y-0.5">
                <p>NIF: <strong>{fiscalData.seller.nif}</strong> | RCCM: <strong>{fiscalData.seller.rccm}</strong></p>
                <p>{lang === 'fr' ? 'Centre Fiscal:' : 'Tax Center:'} <strong>{fiscalData.seller.centre_fiscal}</strong></p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block bg-[#101B30] text-white font-extrabold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider">
                {t.fiscalInvoiceSpecimen}
              </div>
              <p className="font-mono text-xs font-bold text-[#0D9488] pt-1">
                {lang === 'fr' ? 'Réf:' : 'Ref:'} {fiscalData.invoice_number}
              </p>
              <p className="text-xs text-slate-500">Date: {fiscalData.date_time}</p>
              <p className="text-[11px] text-slate-500 font-mono">{lang === 'fr' ? 'Dispositif:' : 'Device:'} {fiscalData.fiscal_device_serial}</p>
            </div>
          </div>

          {/* Customer & Tax Details */}
          <div className="grid grid-cols-2 gap-6 bg-[#F5F7FA] p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">{t.customerBilled}</p>
              <p className="font-bold text-slate-900 text-sm">{translateCustomerName(fiscalData.customer.name, lang)}</p>
              <p className="text-slate-600 mt-0.5">{fiscalData.customer.address}</p>
              <p className="text-slate-600">{t.colPhone}: {fiscalData.customer.phone}</p>
              <p className="font-mono text-[#0D9488] font-bold mt-1">
                NIF: {fiscalData.customer.nif}
              </p>
            </div>

            <div className="border-l border-slate-200 pl-6 space-y-1">
              <p className="font-bold text-slate-500 uppercase text-[10px] tracking-wider mb-1">{t.billingDetails}</p>
              <p><span className="text-slate-500">{t.reglementMode}</span> <strong className="text-slate-800">{fiscalData.payment_method}</strong></p>
              <p><span className="text-slate-500">{t.currencyTx}</span> <strong className="text-slate-800">{fiscalData.currency}</strong></p>
              <p><span className="text-slate-500">{t.cashierIssuer}</span> <strong className="text-slate-800">{fiscalData.cashier}</strong></p>
              <p><span className="text-slate-500">{t.fiscalCounter}</span> <strong className="text-slate-800 font-mono">{fiscalData.fiscal_counter}</strong></p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-slate-700 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{lang === 'fr' ? 'Désignation' : 'Description'}</th>
                  <th className="py-2.5 px-2 text-right">{t.colQty}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'fr' ? 'Prix Unit. HT' : 'Unit Price (HT)'}</th>
                  <th className="py-2.5 px-2 text-center">{lang === 'fr' ? 'Taux TVA' : 'VAT %'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'fr' ? 'Montant TVA' : 'VAT Amount'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'fr' ? 'Total TTC' : 'Total (TTC)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {fiscalData.line_items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{translateProductName(item.product_name, lang)}</td>
                    <td className="py-2.5 px-2 text-right">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">${item.unit_price.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-center">{item.tax_rate_percent}%</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">${item.tax_amount.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">${item.total_line.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-1.5 text-xs bg-[#F5F7FA] p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>{t.totalHt}</span>
                <span className="font-mono font-semibold text-slate-800">${fiscalData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.totalVat16}</span>
                <span className="font-mono font-semibold text-[#0D9488]">${fiscalData.vat_16_total.toFixed(2)}</span>
              </div>
              {fiscalData.discount_total > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>{t.discountGranted}</span>
                  <span className="font-mono">-${fiscalData.discount_total.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                <span>{t.totalTtcPay}</span>
                <span className="text-[#0D9488] font-mono">${fiscalData.total_ttc.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* DGI Demo Security Block with QR and Digital Hash */}
          <div className="border-t-2 border-dashed border-slate-300 pt-5 flex items-center justify-between gap-6">
            <div className="space-y-1.5 flex-1">
              <div className="p-2 bg-amber-50 border border-amber-300 text-amber-900 rounded text-[10px] font-bold">
                {fiscalData.legal_disclaimer}
              </div>
              <p className="text-[10px] font-mono text-slate-500 break-all">
                {t.digitalHash} <span className="font-semibold text-slate-800">{fiscalData.digital_signature}</span>
              </p>
              <p className="text-[10px] text-slate-400">
                {t.architectureReady}
              </p>
            </div>

            {/* Non-Fiscal Demo QR */}
            <div className="w-24 h-24 bg-slate-100 border border-slate-300 rounded-xl p-2 flex flex-col items-center justify-center text-center flex-shrink-0">
              <QrCode className="w-14 h-14 text-slate-700" />
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase mt-0.5">QR DEMO</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
