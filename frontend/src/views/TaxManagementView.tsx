import React from 'react';
import { Percent, Info } from 'lucide-react';
import { Language, translations } from '../i18n';

interface TaxManagementViewProps {
  lang: Language;
}

export const TaxManagementView: React.FC<TaxManagementViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Percent className="w-5 h-5 text-teal-700" />
          {t.taxTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.taxSubtitle}
        </p>
      </div>

      {/* DGI Regulatory Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">{t.taxDisclaimerTitle}</p>
          <p>{t.taxDisclaimerText}</p>
        </div>
      </div>

      {/* Tax Rates Configuration Grid */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900">{t.taxGridTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">{lang === 'fr' ? 'Code Fiscal' : 'Tax Code'}</th>
                <th className="py-2.5 px-3">{lang === 'fr' ? 'Désignation Légale' : 'Statutory Description'}</th>
                <th className="py-2.5 px-3">{lang === 'fr' ? 'Taux Applicable' : 'Applicable Rate'}</th>
                <th className="py-2.5 px-3">{lang === 'fr' ? 'Statut' : 'Status'}</th>
                <th className="py-2.5 px-3">{lang === 'fr' ? 'Exemples de Produits Applicables' : 'Applicable Product Examples'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">STANDARD_16</td>
                <td className="py-3 px-3 font-medium text-slate-800">{lang === 'fr' ? 'TVA Standard RDC' : 'Standard DRC VAT'}</td>
                <td className="py-3 px-3 font-bold text-teal-700">16.0%</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    {lang === 'fr' ? 'Actif (Défaut)' : 'Active (Default)'}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">{lang === 'fr' ? 'Boissons, Électronique, Farine, Huile, Matériel informatique' : 'Beverages, Electronics, Flour, Cooking Oil, Hardware'}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">EXEMPT_0</td>
                <td className="py-3 px-3 font-medium text-slate-800">{lang === 'fr' ? 'Exonération Légale / Taux Zéro' : 'Zero-Rated / Statutory Exemption'}</td>
                <td className="py-3 px-3 font-bold text-slate-600">0.0%</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {lang === 'fr' ? 'Configuré' : 'Configured'}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">{lang === 'fr' ? 'Médicaments essentiels, intrants agricoles, livres scolaires' : 'Essential pharmaceuticals, agricultural supplies, school books'}</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-slate-900">EXPORT_0</td>
                <td className="py-3 px-3 font-medium text-slate-800">{lang === 'fr' ? "Ventes à l'Exportation" : 'Export Goods'}</td>
                <td className="py-3 px-3 font-bold text-slate-600">0.0%</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {lang === 'fr' ? 'Sur Déclaration' : 'Declaration Required'}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-500">{lang === 'fr' ? 'Marchandises expédiées hors des frontières douanières RDC' : 'Goods delivered across DRC customs borders'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Calculation Mode & Pricing Policy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-xs">{lang === 'fr' ? "Politique d'Affichage des Prix Caisse" : 'Cashier Display Price Policy'}</h3>
          <p className="text-xs text-slate-500">
            {lang === 'fr'
              ? 'En RDC, les prix affichés aux consommateurs finals sont exprimés Toutes Taxes Comprises (TTC), tandis que les factures B2B détaillent la ventilation Hors Taxe (HT) et le montant de la TVA 16%.'
              : 'In the DRC, retail consumer prices are displayed tax-inclusive (TTC), while B2B commercial invoices breakdown Net (HT) and 16% VAT.'}
          </p>
          <div className="pt-2">
            <span className="inline-block px-2.5 py-1 rounded bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200">
              {lang === 'fr' ? 'Mode actif: Prix TTC avec ventilation automatique HT + TVA 16%' : 'Active mode: Tax-inclusive display with automatic HT + 16% VAT breakdown'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-xs">{lang === 'fr' ? "Identifiants Fiscaux de l'Entreprise" : 'Company Tax Identifiers'}</h3>
          <div className="space-y-1 text-xs text-slate-600">
            <p>NIF: <strong className="text-slate-900 font-mono">A2109845X</strong></p>
            <p>{lang === 'fr' ? 'Centre des Impôts:' : 'Tax Center:'} <strong className="text-slate-900">CDI Gombe, Kinshasa</strong></p>
            <p>{lang === 'fr' ? "Régime d'Imposition:" : 'Tax Regime:'} <strong className="text-slate-900">{lang === 'fr' ? 'Grandes et Moyennes Entreprises' : 'Large & Medium Business'}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
