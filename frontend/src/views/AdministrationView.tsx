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
import { Button, Badge, Card } from '../components/ui';

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
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Printer className="w-5 h-5 text-[#0D9488]" />
          {t.adminTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.adminSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware & Thermal Printers */}
        <Card
          title={t.printersSectionTitle}
          action={<Badge variant="teal" size="sm">{t.demoReadyBadge}</Badge>}
          padding="md"
        >
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">{t.paperFormat}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrinterPaperSize('80mm')}
                  className={`p-3 rounded-xl border text-center transition ${
                    printerPaperSize === '80mm'
                      ? 'border-[#0D9488] bg-teal-50 text-[#0F766E] font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-bold">{t.width80}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.width80Sub}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrinterPaperSize('58mm')}
                  className={`p-3 rounded-xl border text-center transition ${
                    printerPaperSize === '58mm'
                      ? 'border-[#0D9488] bg-teal-50 text-[#0F766E] font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-sm font-bold">{t.width58}</p>
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
                  className="rounded text-[#0D9488] focus:ring-[#0D9488] w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              {t.printerNote}
            </div>
          </div>
        </Card>

        {/* Offline Synchronization */}
        <Card
          title={t.offlineSectionTitle}
          action={<Badge variant="amber" size="sm">{t.manualDemoControl}</Badge>}
          padding="md"
        >
          <div className="space-y-3.5 text-xs">
            <p className="text-slate-600 leading-relaxed">
              {t.offlineExplain}
            </p>

            <div className="p-4 rounded-xl border border-slate-200 bg-[#F5F7FA] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{t.simulateNetCut}</span>
                <Button
                  variant={isOfflineDemo ? 'danger' : 'secondary'}
                  size="xs"
                  onClick={onToggleOffline}
                >
                  {isOfflineDemo ? t.btnToggleOffline : t.btnToggleOnline}
                </Button>
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
        </Card>

        {/* Roles & Permissions */}
        <Card
          title={t.rolesSectionTitle}
          action={<Badge variant="teal" size="sm">{t.activeRole} {userRole}</Badge>}
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">{lang === 'fr' ? 'Fonctionnalité' : 'Feature'}</th>
                  <th className="py-2.5 px-2 text-center font-semibold">{lang === 'fr' ? 'Caissier' : 'Cashier'}</th>
                  <th className="py-2.5 px-2 text-center font-semibold">{lang === 'fr' ? 'Gérant' : 'Manager'}</th>
                  <th className="py-2.5 px-2 text-center font-semibold">{lang === 'fr' ? 'Comptable' : 'Accountant'}</th>
                  <th className="py-2.5 px-4 text-center font-semibold">{lang === 'fr' ? 'Directeur' : 'Director'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{lang === 'fr' ? 'Encaissement Caisse POS' : 'POS Checkout'}</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{lang === 'fr' ? 'Ajustement Stock & Inventaire' : 'Stock Adjustment'}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{lang === 'fr' ? 'Réception Achats Fournisseurs' : 'Supplier Goods Receiving'}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{lang === 'fr' ? 'Validation Dépenses & Trésorerie' : 'Expense & Treasury Approval'}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-medium text-slate-800">{lang === 'fr' ? 'Rapports & Clôture Fiscale' : 'Reports & Fiscal Closing'}</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-slate-300">-</td>
                  <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Multi-Branch Management */}
        <Card
          title={t.branchesSectionTitle}
          action={<Badge variant="slate" size="sm">{lang === 'fr' ? '2 Sites Actifs' : '2 Active Stores'}</Badge>}
          padding="md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-[#F5F7FA] space-y-1">
              <p className="font-bold text-slate-900">{t.branchGombe}</p>
              <p className="text-slate-500">Ville: Kinshasa | Rôle: Flagship Store & Central Checkout</p>
              <Badge variant="teal" size="sm" dot>
                {lang === 'fr' ? 'Actif & En Ligne' : 'Active & Online'}
              </Badge>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-[#F5F7FA] space-y-1">
              <p className="font-bold text-slate-900">{t.branchLimete}</p>
              <p className="text-slate-500">Ville: Kinshasa | Rôle: General Warehouse & Wholesale</p>
              <Badge variant="teal" size="sm" dot>
                {lang === 'fr' ? 'Actif & En Ligne' : 'Active & Online'}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
