import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Layers, Lock, CheckCircle2, Check, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n';

interface RoadmapSaaSViewProps {
  lang: Language;
}

export const RoadmapSaaSView: React.FC<RoadmapSaaSViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [activePlan, setActivePlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');

  const [auditLogs, setAuditLogs] = useState<Array<{ title: string; subtitle: string; status: string; statusColor: string }>>([
    {
      title: lang === 'fr' ? 'Authentification Session Caissier' : 'Cashier Session Authenticated',
      subtitle: 'User: Jeanne Kalala (POS 01)',
      status: lang === 'fr' ? 'SUCCÈS' : 'SUCCESS',
      statusColor: 'text-emerald-600'
    },
    {
      title: lang === 'fr' ? 'Validation Vente POS' : 'POS Checkout Sale Committed',
      subtitle: 'Invoice: INV-KIN-20261124-0007 (Atomic Stock Decrement)',
      status: lang === 'fr' ? 'COMMIT ATOMIQUE' : 'ATOMIC COMMIT',
      statusColor: 'text-emerald-600'
    },
    {
      title: lang === 'fr' ? 'Contrôle de Sécurité Fiscal DGI' : 'DGI Regulatory Compliance Check',
      subtitle: 'Non-homologation security watermark active',
      status: 'GUARDRAIL ACTIVE',
      statusColor: 'text-amber-600'
    }
  ]);

  const handleSelectPlan = (plan: 'starter' | 'pro' | 'enterprise') => {
    if (plan === activePlan) return;
    setActivePlan(plan);
    const planNames = {
      starter: lang === 'fr' ? 'Plan Débutant ($29/mois)' : 'Starter Plan ($29/mo)',
      pro: lang === 'fr' ? 'Plan Pro RDC ($69/mois)' : 'DRC Pro Plan ($69/mo)',
      enterprise: lang === 'fr' ? 'Plan Entreprise DGI DEF ($149/mois)' : 'Enterprise DGI DEF ($149/mo)'
    };
    setAuditLogs(prev => [
      {
        title: lang === 'fr' ? `Licence basculée: ${planNames[plan]}` : `License Plan Activated: ${planNames[plan]}`,
        subtitle: `Tenant TENANT-KIN-00412 license tier updated`,
        status: lang === 'fr' ? 'ACTIF' : 'ACTIVE',
        statusColor: 'text-teal-600 font-bold'
      },
      ...prev
    ]);
  };

  const getActiveBadgeText = () => {
    switch (activePlan) {
      case 'starter':
        return lang === 'fr' ? 'Licence Active: Plan Débutant (Solo)' : 'Active License: Starter Plan';
      case 'pro':
        return lang === 'fr' ? 'Licence Active: Plan Pro Kinshasa' : 'Active License: Kinshasa Pro Plan';
      case 'enterprise':
        return lang === 'fr' ? 'Licence Active: Enterprise DGI DEF' : 'Active License: Enterprise DGI DEF';
    }
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-700" />
              {t.pricingGridTitle}
            </h2>
            <p className="text-xs text-slate-500">{t.pricingGridSub}</p>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-bold flex items-center gap-2 self-start sm:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {getActiveBadgeText()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Starter Plan */}
          <div
            onClick={() => handleSelectPlan('starter')}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              activePlan === 'starter'
                ? 'border-2 border-teal-600 bg-teal-50/20 shadow-md ring-2 ring-teal-500/10'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {lang === 'fr' ? 'Boutique Solo' : 'Single Store'}
                </span>
                {activePlan === 'starter' && (
                  <span className="bg-teal-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {lang === 'fr' ? 'Actif' : 'Active'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.planStarter}</h3>
                <p className="text-xl font-black text-slate-800 mt-1">$29 <span className="text-xs font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? '1 Terminal de Caisse POS' : '1 POS Checkout Register'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'Gestion Stock & Ventes' : 'Stock & Sales Tracking'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'Tickets 58mm / 80mm' : '58mm / 80mm Receipts'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'Mode Hors-Ligne Local' : 'Local Offline Mode'}</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan('starter'); }}
              className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activePlan === 'starter'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200'
              }`}
            >
              {activePlan === 'starter' ? (
                <><Check className="w-3.5 h-3.5" /> {lang === 'fr' ? 'Forfait Actuel' : 'Active Plan'}</>
              ) : (
                <>{lang === 'fr' ? 'Sélectionner ce Forfait' : 'Select Plan'} <ArrowRight className="w-3 h-3" /></>
              )}
            </button>
          </div>

          {/* Pro Plan */}
          <div
            onClick={() => handleSelectPlan('pro')}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              activePlan === 'pro'
                ? 'border-2 border-teal-600 bg-teal-50/20 shadow-md ring-2 ring-teal-500/10'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">
                  {lang === 'fr' ? 'Multi-Postes' : 'Multi-Register'}
                </span>
                <span className="bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {activePlan === 'pro'
                    ? (lang === 'fr' ? 'Actif & Recommandé' : 'Active & Recommended')
                    : (lang === 'fr' ? 'Recommandé' : 'Recommended')}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.planPro}</h3>
                <p className="text-xl font-black text-teal-800 mt-1">$69 <span className="text-xs font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" /> {lang === 'fr' ? "Jusqu'à 3 Caisses & 2 Dépôts" : "Up to 3 Registers & 2 Stores"}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" /> {lang === 'fr' ? 'Multi-devises USD & CDF' : 'Dual Currency USD & CDF'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" /> {lang === 'fr' ? 'Gestion B2B avec NIF & RCCM' : 'B2B Accounts with NIF & RCCM'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" /> {lang === 'fr' ? 'Module DGI Facture Normalisée' : 'DGI Standardized Invoice Module'}</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan('pro'); }}
              className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activePlan === 'pro'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200'
              }`}
            >
              {activePlan === 'pro' ? (
                <><Check className="w-3.5 h-3.5" /> {lang === 'fr' ? 'Forfait Actuel' : 'Active Plan'}</>
              ) : (
                <>{lang === 'fr' ? 'Sélectionner ce Forfait' : 'Select Plan'} <ArrowRight className="w-3 h-3" /></>
              )}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div
            onClick={() => handleSelectPlan('enterprise')}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              activePlan === 'enterprise'
                ? 'border-2 border-teal-600 bg-teal-50/20 shadow-md ring-2 ring-teal-500/10'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {lang === 'fr' ? 'Réseaux & Chaînes' : 'Retail Chains'}
                </span>
                {activePlan === 'enterprise' && (
                  <span className="bg-teal-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {lang === 'fr' ? 'Actif' : 'Active'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.planEnterprise}</h3>
                <p className="text-xl font-black text-slate-800 mt-1">$149 <span className="text-xs font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'Caisses & Magasins Illimités' : 'Unlimited Registers & Stores'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'Homologation DEF / MCF DGI' : 'Certified DGI DEF / MCF Integration'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'API ERP & Export SYSCOHADA' : 'ERP API & SYSCOHADA Exports'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" /> {lang === 'fr' ? 'Support Dédié 24/7 Kinshasa' : 'Dedicated 24/7 Kinshasa Support'}</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan('enterprise'); }}
              className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activePlan === 'enterprise'
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200'
              }`}
            >
              {activePlan === 'enterprise' ? (
                <><Check className="w-3.5 h-3.5" /> {lang === 'fr' ? 'Forfait Actuel' : 'Active Plan'}</>
              ) : (
                <>{lang === 'fr' ? 'Sélectionner ce Forfait' : 'Select Plan'} <ArrowRight className="w-3 h-3" /></>
              )}
            </button>
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
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {auditLogs.map((log, index) => (
                <div key={index} className="py-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{log.title}</p>
                    <p className="text-[10px] text-slate-400">{log.subtitle}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${log.statusColor}`}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

