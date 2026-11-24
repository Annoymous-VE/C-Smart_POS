import React from 'react';
import { ShieldCheck, CreditCard, Layers, Lock, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../i18n';

interface RoadmapSaaSViewProps {
  lang: Language;
}

export const RoadmapSaaSView: React.FC<RoadmapSaaSViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          {t.saasTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.saasSubtitle}
        </p>
      </div>

      {/* Subscription & Licensing Plans */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-700" />
              {t.pricingGridTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.pricingGridSub}</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
            {t.activeLicenseBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Starter Plan */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {lang === 'fr' ? 'Boutique Solo' : 'Single Store'}
              </span>
              <h3 className="text-base font-bold text-slate-900">{t.planStarter}</h3>
              <p className="text-xl font-black text-slate-800 mt-1">$29 <span className="text-xs font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? '1 Terminal de Caisse POS' : '1 POS Checkout Register'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'Gestion Stock & Ventes' : 'Stock & Sales Tracking'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'Tickets 58mm / 80mm' : '58mm / 80mm Receipts'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'Mode Hors-Ligne Local' : 'Local Offline Mode'}</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="p-4 rounded-xl border-2 border-teal-600 bg-teal-50/20 shadow-md space-y-3 relative">
            <div className="absolute top-3 right-3 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              {lang === 'fr' ? 'Recommandé' : 'Recommended'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                {lang === 'fr' ? 'Multi-Postes' : 'Multi-Register'}
              </span>
              <h3 className="text-base font-bold text-slate-900">{t.planPro}</h3>
              <p className="text-xl font-black text-teal-800 mt-1">$69 <span className="text-xs font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> {lang === 'fr' ? "Jusqu'à 3 Caisses & 2 Dépôts" : "Up to 3 Registers & 2 Stores"}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> {lang === 'fr' ? 'Multi-devises USD & CDF' : 'Dual Currency USD & CDF'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> {lang === 'fr' ? 'Gestion B2B avec NIF & RCCM' : 'B2B Accounts with NIF & RCCM'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> {lang === 'fr' ? 'Module DGI Facture Normalisée' : 'DGI Standardized Invoice Module'}</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {lang === 'fr' ? 'Réseaux & Chaînes' : 'Retail Chains'}
              </span>
              <h3 className="text-base font-bold text-slate-900">{t.planEnterprise}</h3>
              <p className="text-xl font-black text-slate-800 mt-1">$149 <span className="text-xs font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'Caisses & Magasins Illimités' : 'Unlimited Registers & Stores'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'Homologation DEF / MCF DGI' : 'Certified DGI DEF / MCF Integration'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'API ERP & Export SYSCOHADA' : 'ERP API & SYSCOHADA Exports'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {lang === 'fr' ? 'Support Dédié 24/7 Kinshasa' : 'Dedicated 24/7 Kinshasa Support'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-Tenant & Security Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Layers className="w-4 h-4 text-teal-700" />
            <h2 className="font-bold text-slate-900 text-sm">{t.superAdminTitle}</h2>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p>
              {lang === 'fr'
                ? "Pour le déploiement commercial multi-entreprises, chaque société cliente dispose d'une base de données partitionnée avec chiffrement au repos."
                : 'For commercial multi-tenant deployment, each client business operates with a partitioned database and encryption at rest.'}
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border font-mono text-[11px] space-y-1">
              <p>Tenant ID: <strong className="text-slate-900">TENANT-KIN-00412</strong></p>
              <p>{lang === 'fr' ? 'Raison Sociale:' : 'Business Name:'} <strong className="text-slate-900">DRC Smart POS Démo SARL</strong></p>
              <p>{lang === 'fr' ? 'Base locale:' : 'Local DB:'} <span className="text-emerald-700 font-semibold">SQLite WAL (Isolated)</span></p>
              <p>{lang === 'fr' ? 'Portabilité Cloud:' : 'Cloud Portability:'} <span className="text-blue-700">Compatible PostgreSQL Supabase / AWS</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Lock className="w-4 h-4 text-teal-700" />
            <h2 className="font-bold text-slate-900 text-sm">{t.securityAuditTitle}</h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="divide-y divide-slate-100">
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{lang === 'fr' ? 'Authentification Session Caissier' : 'Cashier Session Authenticated'}</p>
                  <p className="text-[10px] text-slate-400">User: Jeanne Kalala (POS 01)</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">{lang === 'fr' ? 'SUCCÈS' : 'SUCCESS'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{lang === 'fr' ? 'Validation Vente POS' : 'POS Checkout Sale Committed'}</p>
                  <p className="text-[10px] text-slate-400">Invoice: INV-KIN-20261124-0007 (Atomic Stock Decrement)</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">{lang === 'fr' ? 'COMMIT ATOMIQUE' : 'ATOMIC COMMIT'}</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{lang === 'fr' ? 'Contrôle de Sécurité Fiscal DGI' : 'DGI Regulatory Compliance Check'}</p>
                  <p className="text-[10px] text-slate-400">Non-homologation security watermark active</p>
                </div>
                <span className="text-[10px] font-mono text-amber-600 font-bold">GUARDRAIL ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
