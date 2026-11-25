import React from 'react';
import { Percent, Info } from 'lucide-react';
import { Language, translations } from '../i18n';
import { Badge, Card } from '../components/ui';

interface TaxManagementViewProps {
  lang: Language;
}

export const TaxManagementView: React.FC<TaxManagementViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Percent className="w-5 h-5 text-[#0D9488]" />
          {t.taxTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.taxSubtitle}
        </p>
      </div>

      {/* DGI Regulatory Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">{t.taxDisclaimerTitle}</p>
          <p className="leading-relaxed">{t.taxDisclaimerText}</p>
        </div>
      </div>

      {/* Tax Rates Configuration Grid */}
      <Card
        title={t.taxGridTitle}
        subtitle={lang === 'fr' ? 'Barème officiel de la TVA en République Démocratique du Congo' : 'Official VAT schedule in the Democratic Republic of Congo'}
        padding="none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">{lang === 'fr' ? 'Code Fiscal' : 'Tax Code'}</th>
                <th className="py-2.5 px-3 font-semibold">{lang === 'fr' ? 'Désignation Légale' : 'Statutory Description'}</th>
                <th className="py-2.5 px-3 font-semibold text-center">{lang === 'fr' ? 'Taux' : 'Rate'}</th>
                <th className="py-2.5 px-3 font-semibold text-center">{lang === 'fr' ? 'Statut' : 'Status'}</th>
                <th className="py-2.5 px-4 font-semibold">{lang === 'fr' ? 'Exemples de Produits Applicables' : 'Applicable Product Examples'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">STANDARD_16</td>
                <td className="py-3 px-3 font-medium text-slate-800">{lang === 'fr' ? 'TVA Standard RDC' : 'Standard DRC VAT'}</td>
                <td className="py-3 px-3 font-mono font-bold text-[#0D9488] text-center">16.0%</td>
                <td className="py-3 px-3 text-center">
                  <Badge variant="teal" size="sm" dot>
                    {lang === 'fr' ? 'Actif (Défaut)' : 'Active (Default)'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-500 text-[11px]">{lang === 'fr' ? 'Boissons, Électronique, Farine, Huile, Matériel informatique' : 'Beverages, Electronics, Flour, Cooking Oil, Hardware'}</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">EXEMPT_0</td>
                <td className="py-3 px-3 font-medium text-slate-800">{lang === 'fr' ? 'Exonération Légale / Taux Zéro' : 'Zero-Rated / Statutory Exemption'}</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-600 text-center">0.0%</td>
                <td className="py-3 px-3 text-center">
                  <Badge variant="slate" size="sm">
                    {lang === 'fr' ? 'Configuré' : 'Configured'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-500 text-[11px]">{lang === 'fr' ? 'Médicaments essentiels, intrants agricoles, livres scolaires' : 'Essential pharmaceuticals, agricultural supplies, school books'}</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">EXPORT_0</td>
                <td className="py-3 px-3 font-medium text-slate-800">{lang === 'fr' ? "Ventes à l'Exportation" : 'Export Goods'}</td>
                <td className="py-3 px-3 font-mono font-bold text-slate-600 text-center">0.0%</td>
                <td className="py-3 px-3 text-center">
                  <Badge variant="slate" size="sm">
                    {lang === 'fr' ? 'Sur Déclaration' : 'Declaration'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-500 text-[11px]">{lang === 'fr' ? 'Marchandises expédiées hors des frontières douanières RDC' : 'Goods delivered across DRC customs borders'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tax Calculation Mode & Pricing Policy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title={lang === 'fr' ? "Politique d'Affichage des Prix Caisse" : 'Cashier Display Price Policy'} padding="md">
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'fr'
              ? 'En RDC, les prix affichés aux consommateurs finals sont exprimés Toutes Taxes Comprises (TTC), tandis que les factures B2B détaillent la ventilation Hors Taxe (HT) et le montant de la TVA 16%.'
              : 'In the DRC, retail consumer prices are displayed tax-inclusive (TTC), while B2B commercial invoices breakdown Net (HT) and 16% VAT.'}
          </p>
          <div className="pt-3">
            <Badge variant="teal" size="md">
              {lang === 'fr' ? 'Mode actif: Prix TTC avec ventilation automatique HT + TVA 16%' : 'Active mode: Tax-inclusive display with automatic HT + 16% VAT breakdown'}
            </Badge>
          </div>
        </Card>

        <Card title={lang === 'fr' ? 'Centre des Impôts Compétent (DGI)' : 'Jurisdiction Tax Center (DGI)'} padding="md">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Centre des Impôts:</span>
              <span className="font-semibold text-slate-900">CDI Kinshasa Gombe</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Régime Fiscal:</span>
              <span className="font-semibold text-slate-900">Régime Général d'Imposition (TVA)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Échéance Déclarative:</span>
              <span className="font-semibold text-slate-900">Le 15 du mois suivant</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
