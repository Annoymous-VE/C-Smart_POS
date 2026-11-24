import React, { useState } from 'react';
import {
  Printer,
  ShieldCheck,
  Store,
  WifiOff,
  CheckCircle2,
  Usb,
  Bluetooth
} from 'lucide-react';
import { Language, translations } from '../i18n';

interface AdministrationViewProps {
  userRole: string;
  isOfflineDemo: boolean;
  lang: Language;
  onToggleOffline: () => void;
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  userRole,
  isOfflineDemo,
  lang,
  onToggleOffline
}) => {
  const t = translations[lang];
  const [printerPaperSize, setPrinterPaperSize] = useState<'80mm' | '58mm'>('80mm');
  const [cashDrawerKick, setCashDrawerKick] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Printer className="w-5 h-5 text-teal-700" />
          {t.adminTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.adminSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware & Thermal Printers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-slate-900 text-sm">{t.printersSectionTitle}</h2>
            </div>
            <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded">
              {t.demoReadyBadge}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">{t.paperFormat}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrinterPaperSize('80mm')}
                  className={`p-3 rounded-xl border text-center transition ${
                    printerPaperSize === '80mm'
                      ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm">{t.width80}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.width80Sub}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrinterPaperSize('58mm')}
                  className={`p-3 rounded-xl border text-center transition ${
                    printerPaperSize === '58mm'
                      ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm">{t.width58}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.width58Sub}</p>
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Usb className="w-3.5 h-3.5 text-slate-500" /> {t.usbConn}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{t.plannedRoadmap}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Bluetooth className="w-3.5 h-3.5 text-blue-500" /> {t.bluetoothConn}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{t.plannedRoadmap}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">{t.cashDrawerAuto}</span>
                <input
                  type="checkbox"
                  checked={cashDrawerKick}
                  onChange={(e) => setCashDrawerKick(e.target.checked)}
                  className="rounded text-teal-600 w-4 h-4"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border text-[11px] text-slate-500">
              {t.printerNote}
            </div>
          </div>
        </div>

        {/* Offline Synchronization */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-amber-700" />
              <h2 className="font-bold text-slate-900 text-sm">{t.offlineSectionTitle}</h2>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">
              {t.manualDemoControl}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-600 leading-relaxed">
              {t.offlineExplain}
            </p>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{t.simulateNetCut}</span>
                <button
                  onClick={onToggleOffline}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                    isOfflineDemo
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isOfflineDemo ? t.btnToggleOffline : t.btnToggleOnline}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {lang === 'fr'
                  ? `État actuel: ${isOfflineDemo ? "File d'attente locale active (0 vente en attente de sync)" : 'Connecté en direct au serveur local'}`
                  : `Current status: ${isOfflineDemo ? 'Local queue active (0 queued sales)' : 'Connected directly to local server'}`}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'fr' ? 'Base SQLite locale embarquée' : 'Embedded local SQLite database'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'fr' ? 'Conservation locale des numéros de série de facture' : 'Local storage of invoice serial numbers'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'fr' ? 'Synchronisation Cloud en arrière-plan (Prévu Phase Commerciale)' : 'Background Cloud sync (Planned Commercial Phase)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-slate-900 text-sm">{t.rolesSectionTitle}</h2>
            </div>
            <span className="text-xs font-bold text-teal-800">{t.activeRole} {userRole}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">{lang === 'fr' ? 'Fonctionnalité' : 'Feature'}</th>
                  <th className="py-2 px-2 text-center">{lang === 'fr' ? 'Caissier' : 'Cashier'}</th>
                  <th className="py-2 px-2 text-center">{lang === 'fr' ? 'Gérant' : 'Manager'}</th>
                  <th className="py-2 px-2 text-center">{lang === 'fr' ? 'Comptable' : 'Accountant'}</th>
                  <th className="py-2 px-2 text-center">{lang === 'fr' ? 'Directeur' : 'Director'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-medium">{lang === 'fr' ? 'Encaissement Caisse POS' : 'POS Checkout'}</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">{lang === 'fr' ? 'Ajustement Stock & Inventaire' : 'Stock Adjustment'}</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">{lang === 'fr' ? 'Réception Achats Fournisseurs' : 'Supplier Goods Receiving'}</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">{lang === 'fr' ? 'Validation Dépenses & Trésorerie' : 'Expense & Treasury Approval'}</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">{lang === 'fr' ? 'Rapports & Clôture Fiscale' : 'Reports & Fiscal Closing'}</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-slate-300">-</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2 px-2 text-center text-emerald-600 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Branch Management */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-slate-900 text-sm">{t.branchesSectionTitle}</h2>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
              {lang === 'fr' ? '2 Sites' : '2 Stores'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <p className="font-bold text-slate-900">{t.branchGombe}</p>
              <p className="text-slate-500">Ville: Kinshasa | Rôle: Flagship Store & Central Checkout</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                {lang === 'fr' ? 'Actif & En Ligne' : 'Active & Online'}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <p className="font-bold text-slate-900">{t.branchLimete}</p>
              <p className="text-slate-500">Ville: Kinshasa | Rôle: General Warehouse & Wholesale</p>
              <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                {lang === 'fr' ? 'Actif & En Ligne' : 'Active & Online'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
