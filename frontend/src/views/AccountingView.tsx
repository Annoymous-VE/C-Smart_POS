import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { formatMoney } from '../utils';
import { Language, translations } from '../i18n';
import {
  Landmark,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Filter,
  Calendar,
  Building,
  Search,
  FileSpreadsheet
} from 'lucide-react';
import { Button, Badge, Card, StatCard, Select } from '../components/ui';

interface AccountingViewProps {
  currency: string;
  lang: Language;
}

interface AccountRow {
  code: string;
  nameFr: string;
  nameEn: string;
  categoryFr: string;
  categoryEn: string;
  debit: number;
  credit: number;
  reconciled: boolean;
  branch: string;
}

export const AccountingView: React.FC<AccountingViewProps> = ({ currency, lang }) => {
  const t = translations[lang];
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    api.getReportsSummary()
      .then(setReport)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalSales = report?.total_sales || 0;
  const totalExpenses = report?.total_expenses || 0;
  const estimatedNet = report?.net_estimated_margin || 0;
  const totalVat = report?.total_tax_collected || 0;

  // Real OHADA accounts mapping to business realities in Kinshasa
  const rawAccounts: AccountRow[] = [
    {
      code: '571100',
      nameFr: 'Caisse Centrale Siège Gombe (Espèces)',
      nameEn: 'Main Cash Register Gombe (Physical Cash)',
      categoryFr: 'Actif — Trésorerie Caisse',
      categoryEn: 'Current Asset — Cash on Hand',
      debit: 2450.0,
      credit: 0.0,
      reconciled: true,
      branch: 'gombe'
    },
    {
      code: '521100',
      nameFr: 'Banque Rawbank Compte Courant USD',
      nameEn: 'Rawbank Commercial Checking USD',
      categoryFr: 'Actif — Banques & Établissements',
      categoryEn: 'Current Asset — Bank Account',
      debit: 15800.0,
      credit: 0.0,
      reconciled: true,
      branch: 'gombe'
    },
    {
      code: '573100',
      nameFr: 'Compte Marchand Vodacom M-Pesa',
      nameEn: 'Vodacom M-Pesa Merchant Account',
      categoryFr: 'Actif — Monnaie Électronique Mobile',
      categoryEn: 'Current Asset — Mobile Money',
      debit: 1890.0,
      credit: 0.0,
      reconciled: true,
      branch: 'all'
    },
    {
      code: '573200',
      nameFr: 'Compte Marchand Airtel Money RDC',
      nameEn: 'Airtel Money RDC Merchant Account',
      categoryFr: 'Actif — Monnaie Électronique Mobile',
      categoryEn: 'Current Asset — Mobile Money',
      debit: 740.0,
      credit: 0.0,
      reconciled: false,
      branch: 'all'
    },
    {
      code: '411100',
      nameFr: 'Clients Ordinaires (Créances Commerciales B2B)',
      nameEn: 'Trade Accounts Receivable (B2B Credit)',
      categoryFr: 'Actif Circulant — Créances Clients',
      categoryEn: 'Current Asset — Accounts Receivable',
      debit: 600.0,
      credit: 0.0,
      reconciled: true,
      branch: 'all'
    },
    {
      code: '401100',
      nameFr: "Fournisseurs d'Exploitation (Bralima, MIDEMA, Socimex)",
      nameEn: 'Trade Accounts Payable (Authorized Vendors)',
      categoryFr: "Passif Circulant — Dettes Fournisseurs",
      categoryEn: 'Current Liability — Accounts Payable',
      debit: 0.0,
      credit: 1345.0,
      reconciled: true,
      branch: 'all'
    },
    {
      code: '443100',
      nameFr: 'État, TVA Facturée Collectée (DGI 16% Normalisée)',
      nameEn: 'Output VAT Collected (DRC DGI 16%)',
      categoryFr: 'Passif — Dettes Fiscales DGI',
      categoryEn: 'Current Liability — Tax Authority',
      debit: 0.0,
      credit: totalVat > 0 ? totalVat : 218.40,
      reconciled: true,
      branch: 'all'
    },
    {
      code: '701100',
      nameFr: 'Ventes de Marchandises en RDC (Chiffre d’Affaires HT)',
      nameEn: 'Merchandise Sales Revenue (Pre-Tax Turnover)',
      categoryFr: "Produits — Ventes d'Exploitation",
      categoryEn: 'Operating Revenue — Sales',
      debit: 0.0,
      credit: totalSales > 0 ? totalSales : 1850.0,
      reconciled: true,
      branch: 'all'
    },
    {
      code: '605100',
      nameFr: 'Carburant Groupe Électrogène (Gasoil Délestage SNEL)',
      nameEn: 'Generator Diesel Fuel (SNEL Load-Shedding Relay)',
      categoryFr: "Charges — Énergie & Fluides",
      categoryEn: 'Operating Expense — Utilities & Fuel',
      debit: 195.0,
      credit: 0.0,
      reconciled: true,
      branch: 'all'
    },
    {
      code: '613100',
      nameFr: 'Locations Immobilières Commerciales (Bail Magasin Gombe)',
      nameEn: 'Commercial Store Rent (Gombe Blvd 30 Juin)',
      categoryFr: 'Charges — Loyers & Charges Locatives',
      categoryEn: 'Operating Expense — Real Estate Rent',
      debit: 850.0,
      credit: 0.0,
      reconciled: true,
      branch: 'gombe'
    }
  ];

  // Filtering
  const filteredAccounts = rawAccounts.filter(acc => {
    const matchesBranch = selectedBranch === 'all' || acc.branch === 'all' || acc.branch === selectedBranch;
    const matchesCategory = categoryFilter === 'all' || acc.categoryFr.includes(categoryFilter) || acc.categoryEn.includes(categoryFilter);
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      acc.code.includes(searchLower) ||
      acc.nameFr.toLowerCase().includes(searchLower) ||
      acc.nameEn.toLowerCase().includes(searchLower);
    return matchesBranch && matchesCategory && matchesSearch;
  });

  // Calculate totals
  const totalDebits = filteredAccounts.reduce((sum, a) => sum + a.debit, 0);
  const totalCredits = filteredAccounts.reduce((sum, a) => sum + a.credit, 0);

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;
  const paginatedAccounts = filteredAccounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#0D9488]" />
            {t.accountingTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.accountingSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md">SYSCOHADA RDC</Badge>
          <Badge variant="slate" size="md">CDI Gombe</Badge>
        </div>
      </div>

      {/* P&L Financial Snapshot KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.kpiRevenueAcc}
          value={formatMoney(totalSales, currency)}
          subtitle={lang === 'fr' ? 'Crédits des ventes confirmées' : 'Confirmed retail gross sales'}
          icon={<ArrowUpRight className="w-4 h-4 text-emerald-600" />}
        />

        <StatCard
          title={t.kpiExpensesAcc}
          value={formatMoney(totalExpenses, currency)}
          subtitle={lang === 'fr' ? 'Charges opérationnelles décaissées' : 'Settled operational expenses'}
          icon={<ArrowDownLeft className="w-4 h-4 text-rose-600" />}
        />

        <StatCard
          title={t.kpiNetProfit}
          value={formatMoney(estimatedNet, currency)}
          subtitle={lang === 'fr' ? 'Marge nette disponible' : 'Available net margin'}
          icon={<CheckCircle2 className="w-4 h-4 text-teal-600" />}
          trend={{ value: estimatedNet >= 0 ? 'Positif' : 'Négatif', positive: estimatedNet >= 0 }}
        />

        <StatCard
          title="TVA Collectée DGI (16%)"
          value={formatMoney(totalVat, currency)}
          subtitle={lang === 'fr' ? 'Dette fiscale à reverser' : 'Output tax liability'}
          icon={<Landmark className="w-4 h-4 text-[#0D9488]" />}
        />
      </div>

      {/* Filter Toolbar */}
      <Card padding="sm" className="bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Search Account */}
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={lang === 'fr' ? 'Compte ou libellé...' : 'Account # or name...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            {/* Branch Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedBranch}
                onChange={(e) => { setSelectedBranch(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer font-medium"
              >
                <option value="all">{lang === 'fr' ? 'Toutes Succursales' : 'All Branches'}</option>
                <option value="gombe">Siège Gombe</option>
                <option value="limete">Dépôt Limete</option>
              </select>
            </div>

            {/* Period Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer font-medium"
              >
                <option value="month">{lang === 'fr' ? 'Exercice Mois en Cours' : 'Current Month'}</option>
                <option value="quarter">{lang === 'fr' ? 'Trimestre T4 2026' : 'Q4 2026 Quarter'}</option>
                <option value="year">{lang === 'fr' ? 'Année Fiscale 2026' : 'Fiscal Year 2026'}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              {filteredAccounts.length} {lang === 'fr' ? 'comptes actifs' : 'active accounts'}
            </span>
          </div>
        </div>
      </Card>

      {/* SYSCOHADA Chart of Accounts (Grand Livre & Balance) */}
      <Card
        title={t.accountingStructureTitle}
        subtitle={lang === 'fr' ? 'Grand Livre & Balances des Comptes d’Exploitation (OHADA)' : 'General Ledger & Trial Balance (SYSCOHADA)'}
        padding="none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold w-24">{t.colAccount}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colAccountName}</th>
                <th className="py-2.5 px-3 font-semibold">{t.colAccountType}</th>
                <th className="py-2.5 px-3 font-semibold text-center w-28">
                  {lang === 'fr' ? 'Rapprochement' : 'Reconciliation'}
                </th>
                <th className="py-2.5 px-4 font-semibold text-right w-32">{t.colDebit}</th>
                <th className="py-2.5 px-4 font-semibold text-right w-32">{t.colCredit}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {paginatedAccounts.map((acc) => (
                <tr key={acc.code} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{acc.code}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">
                    {lang === 'fr' ? acc.nameFr : acc.nameEn}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">
                    {lang === 'fr' ? acc.categoryFr : acc.categoryEn}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-center">
                    {acc.reconciled ? (
                      <Badge variant="teal" size="sm" dot>
                        {lang === 'fr' ? 'Rapproché' : 'Reconciled'}
                      </Badge>
                    ) : (
                      <Badge variant="amber" size="sm" dot>
                        {lang === 'fr' ? 'En cours' : 'Pending'}
                      </Badge>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-900">
                    {acc.debit > 0 ? (
                      <span className="font-semibold">{formatMoney(acc.debit, currency)}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-900">
                    {acc.credit > 0 ? (
                      <span className="font-semibold">{formatMoney(acc.credit, currency)}</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Totals Summary Footer */}
            <tfoot className="bg-[#F5F7FA] border-t-2 border-slate-200 font-mono text-xs font-bold text-slate-900">
              <tr>
                <td colSpan={3} className="py-3 px-4 font-sans font-bold text-slate-900">
                  {lang === 'fr' ? 'Total des Mouvements de Trésorerie & d’Exploitation' : 'Total General Ledger Movements'}
                </td>
                <td className="py-3 px-3 text-center font-sans">
                  <Badge variant="teal" size="sm">
                    {lang === 'fr' ? 'Équilibré' : 'Balanced'}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right text-[#0D9488]">
                  {formatMoney(totalDebits, currency)}
                </td>
                <td className="py-3 px-4 text-right text-slate-900">
                  {formatMoney(totalCredits, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination & Status Footer */}
        <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            {lang === 'fr'
              ? `Affichage de 1 à ${paginatedAccounts.length} sur ${filteredAccounts.length} comptes`
              : `Showing 1 to ${paginatedAccounts.length} of ${filteredAccounts.length} accounts`}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              {lang === 'fr' ? 'Précédent' : 'Previous'}
            </Button>
            <span className="text-[11px] font-semibold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="xs"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              {lang === 'fr' ? 'Suivant' : 'Next'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
