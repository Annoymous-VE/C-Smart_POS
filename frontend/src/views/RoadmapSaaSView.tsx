import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Layers, Lock, CheckCircle2, Check, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n';
import { Button, Badge, Card } from '../components/ui';

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
        return lang === 'fr' ? 'Licence: Plan Débutant (Solo)' : 'Active: Starter Plan';
      case 'pro':
        return lang === 'fr' ? 'Licence: Plan Pro Kinshasa' : 'Active: Kinshasa Pro Plan';
      case 'enterprise':
        return lang === 'fr' ? 'Licence: Enterprise DGI DEF' : 'Active: Enterprise DGI DEF';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0D9488]" />
          {t.saasTitle}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.saasSubtitle}
        </p>
      </div>

      {/* Subscription & Licensing Plans */}
      <Card
        title={t.pricingGridTitle}
        subtitle={t.pricingGridSub}
        action={<Badge variant="teal" size="sm" dot>{getActiveBadgeText()}</Badge>}
        padding="md"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Starter Plan */}
          <div
            onClick={() => handleSelectPlan('starter')}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              activePlan === 'starter'
                ? 'border-2 border-[#0D9488] bg-teal-50/20 shadow-md ring-2 ring-teal-500/10'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {lang === 'fr' ? 'Boutique Solo' : 'Single Store'}
                </span>
                {activePlan === 'starter' && (
                  <Badge variant="teal" size="sm">
                    {lang === 'fr' ? 'Actif' : 'Active'}
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.planStarter}</h3>
                <p className="text-xl font-mono font-bold text-slate-800 mt-1">$29 <span className="text-xs font-sans font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? '1 Terminal de Caisse POS' : '1 POS Checkout Register'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Gestion Stock & Ventes' : 'Stock & Sales Tracking'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Tickets 58mm / 80mm' : '58mm / 80mm Receipts'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Mode Hors-Ligne Local' : 'Local Offline Mode'}</li>
              </ul>
            </div>

            <Button
              variant={activePlan === 'starter' ? 'primary' : 'secondary'}
              size="sm"
              className="mt-4 w-full"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan('starter'); }}
              icon={activePlan === 'starter' ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              iconPosition={activePlan === 'starter' ? 'left' : 'right'}
            >
              {activePlan === 'starter' ? (lang === 'fr' ? 'Forfait Actuel' : 'Active Plan') : (lang === 'fr' ? 'Sélectionner' : 'Select Plan')}
            </Button>
          </div>

          {/* Pro Plan */}
          <div
            onClick={() => handleSelectPlan('pro')}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
              activePlan === 'pro'
                ? 'border-2 border-[#0D9488] bg-teal-50/20 shadow-md ring-2 ring-teal-500/10'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#0F766E] tracking-wider">
                  {lang === 'fr' ? 'Multi-Postes' : 'Multi-Register'}
                </span>
                <Badge variant="teal" size="sm">
                  {activePlan === 'pro'
                    ? (lang === 'fr' ? 'Actif & Recommandé' : 'Active & Recommended')
                    : (lang === 'fr' ? 'Recommandé' : 'Recommended')}
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.planPro}</h3>
                <p className="text-xl font-mono font-bold text-[#0D9488] mt-1">$69 <span className="text-xs font-sans font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? "Jusqu'à 3 Caisses & 2 Dépôts" : "Up to 3 Registers & 2 Stores"}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Multi-devises USD & CDF' : 'Dual Currency USD & CDF'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Gestion B2B avec NIF & RCCM' : 'B2B Accounts with NIF & RCCM'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Module DGI Facture Normalisée' : 'DGI Standardized Invoice Module'}</li>
              </ul>
            </div>

            <Button
              variant={activePlan === 'pro' ? 'primary' : 'secondary'}
              size="sm"
              className="mt-4 w-full"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan('pro'); }}
              icon={activePlan === 'pro' ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              iconPosition={activePlan === 'pro' ? 'left' : 'right'}
            >
              {activePlan === 'pro' ? (lang === 'fr' ? 'Forfait Actuel' : 'Active Plan') : (lang === 'fr' ? 'Sélectionner' : 'Select Plan')}
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div
            onClick={() => handleSelectPlan('enterprise')}
            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              activePlan === 'enterprise'
                ? 'border-2 border-[#0D9488] bg-teal-50/20 shadow-md ring-2 ring-teal-500/10'
                : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {lang === 'fr' ? 'Réseaux & Chaînes' : 'Retail Chains'}
                </span>
                {activePlan === 'enterprise' && (
                  <Badge variant="teal" size="sm">
                    {lang === 'fr' ? 'Actif' : 'Active'}
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.planEnterprise}</h3>
                <p className="text-xl font-mono font-bold text-slate-800 mt-1">$149 <span className="text-xs font-sans font-normal text-slate-500">/ {lang === 'fr' ? 'mois' : 'mo'}</span></p>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Caisses & Magasins Illimités' : 'Unlimited Registers & Stores'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Homologation DEF / MCF DGI' : 'Certified DGI DEF / MCF Integration'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'API ERP & Export SYSCOHADA' : 'ERP API & SYSCOHADA Exports'}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488] flex-shrink-0" /> {lang === 'fr' ? 'Support Dédié 24/7 Kinshasa' : 'Dedicated 24/7 Kinshasa Support'}</li>
              </ul>
            </div>

            <Button
              variant={activePlan === 'enterprise' ? 'primary' : 'secondary'}
              size="sm"
              className="mt-4 w-full"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan('enterprise'); }}
              icon={activePlan === 'enterprise' ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              iconPosition={activePlan === 'enterprise' ? 'left' : 'right'}
            >
              {activePlan === 'enterprise' ? (lang === 'fr' ? 'Forfait Actuel' : 'Active Plan') : (lang === 'fr' ? 'Sélectionner' : 'Select Plan')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Multi-Tenant & Security Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={t.superAdminTitle} padding="md">
          <div className="space-y-2 text-xs text-slate-600">
            <p className="leading-relaxed">
              {lang === 'fr'
                ? "Pour le déploiement commercial multi-entreprises, chaque société cliente dispose d'une base de données partitionnée avec chiffrement au repos."
                : 'For commercial multi-tenant deployment, each client business operates with a partitioned database and encryption at rest.'}
            </p>
            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
              <p>Tenant ID: <strong className="text-slate-900">TENANT-KIN-00412</strong></p>
              <p>{lang === 'fr' ? 'Raison Sociale:' : 'Business Name:'} <strong className="text-slate-900">DRC Smart POS Démo SARL</strong></p>
              <p>{lang === 'fr' ? 'Base locale:' : 'Local DB:'} <span className="text-emerald-700 font-semibold">SQLite WAL (Isolated)</span></p>
              <p>{lang === 'fr' ? 'Portabilité Cloud:' : 'Cloud Portability:'} <span className="text-blue-700">Compatible PostgreSQL Supabase / AWS</span></p>
            </div>
          </div>
        </Card>

        <Card title={t.securityAuditTitle} padding="md">
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
        </Card>
      </div>
    </div>
  );
};
