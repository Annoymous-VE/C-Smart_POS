import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardView } from './views/DashboardView';
import { PosView } from './views/PosView';
import { InventoryView } from './views/InventoryView';
import { PurchasesView } from './views/PurchasesView';
import { CustomersView } from './views/CustomersView';
import { SuppliersView } from './views/SuppliersView';
import { ExpensesView } from './views/ExpensesView';
import { AccountingView } from './views/AccountingView';
import { TaxManagementView } from './views/TaxManagementView';
import { FiscalInvoiceView } from './views/FiscalInvoiceView';
import { AdministrationView } from './views/AdministrationView';
import { ReportsView } from './views/ReportsView';
import { RoadmapSaaSView } from './views/RoadmapSaaSView';
import { Language } from './i18n';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [branchId, setBranchId] = useState<number>(1);
  const [currency, setCurrency] = useState<string>('USD');
  const [lang, setLang] = useState<Language>('fr');
  const [userRole, setUserRole] = useState<string>('Caissier (Jeanne Kalala)');
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(false);
  const [selectedFiscalSaleId, setSelectedFiscalSaleId] = useState<number | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleNavigate = (tab: string, extra?: any) => {
    setCurrentTab(tab);
    if (extra?.saleId) {
      setSelectedFiscalSaleId(extra.saleId);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* Sidebar Navigation (Module numbers removed!) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        lang={lang}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar
          branchId={branchId}
          onBranchChange={setBranchId}
          currency={currency}
          onCurrencyChange={setCurrency}
          lang={lang}
          onLangChange={setLang}
          userRole={userRole}
          onUserRoleChange={setUserRole}
          isOfflineDemo={isOfflineDemo}
          onToggleOffline={() => setIsOfflineDemo(!isOfflineDemo)}
          onRefreshData={handleRefresh}
        />

        <main key={refreshKey} className="flex-1 flex flex-col overflow-hidden bg-[#F5F7FA]">
          {currentTab === 'dashboard' && (
            <DashboardView
              branchId={branchId}
              currency={currency}
              lang={lang}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'pos' && (
            <PosView
              branchId={branchId}
              currency={currency}
              lang={lang}
              isOfflineDemo={isOfflineDemo}
              onSaleCompleted={handleRefresh}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryView
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'purchases' && (
            <PurchasesView
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersView
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'suppliers' && (
            <SuppliersView
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'expenses' && (
            <ExpensesView
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'accounting' && (
            <AccountingView
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'taxes' && (
            <TaxManagementView
              lang={lang}
            />
          )}

          {currentTab === 'fiscal' && (
            <FiscalInvoiceView
              currency={currency}
              lang={lang}
              initialSaleId={selectedFiscalSaleId}
            />
          )}

          {currentTab === 'admin' && (
            <AdministrationView
              userRole={userRole}
              isOfflineDemo={isOfflineDemo}
              lang={lang}
              onToggleOffline={() => setIsOfflineDemo(!isOfflineDemo)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              branchId={branchId}
              currency={currency}
              lang={lang}
            />
          )}

          {currentTab === 'saas' && (
            <RoadmapSaaSView
              lang={lang}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
