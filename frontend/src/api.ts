import { DashboardSummary, Product, Sale, Purchase, Customer, Supplier, Expense, FiscalInvoice, ReportSummary } from './types';

// Resolve Backend API base URL
const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;

let API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

if (envUrl) {
  API_BASE_URL = envUrl.replace(/\/+$/, '');
  if (!API_BASE_URL.endsWith('/api/v1')) {
    API_BASE_URL += '/api/v1';
  }
} else if (typeof window !== 'undefined') {
  if (window.location.hostname.includes('vercel.app')) {
    // Automatically use the live Render backend when running on Vercel
    API_BASE_URL = 'https://c-smart-pos.onrender.com/api/v1';
  } else if (window.location.port === '8000') {
    API_BASE_URL = '/api/v1';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let errorMsg = `Erreur serveur (${res.status})`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err: any) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('connexion')) {
      throw new Error(`Impossible de se connecter au serveur DRC Smart POS (${url}). Veuillez vous assurer que le serveur backend est démarré.`);
    }
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardSummary: (branchId?: number, currency: string = 'USD') => {
    const query = new URLSearchParams({ currency });
    if (branchId) query.append('branch_id', branchId.toString());
    return request<DashboardSummary>(`/dashboard/summary?${query.toString()}`);
  },

  // Products
  getProducts: (search?: string, category?: string, lowStockOnly?: boolean) => {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    if (category) query.append('category', category);
    if (lowStockOnly) query.append('low_stock_only', 'true');
    return request<Product[]>(`/products?${query.toString()}`);
  },

  createProduct: (productData: Partial<Product>) => {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  adjustStock: (productId: number, quantityChange: number, reason: string = 'Correction manuelle') => {
    return request<Product>(`/products/${productId}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ quantity_change: quantityChange, reason })
    });
  },

  // Sales
  getSales: (branchId?: number) => {
    const query = branchId ? `?branch_id=${branchId}` : '';
    return request<Sale[]>(`/sales${query}`);
  },

  getSale: (saleId: number) => {
    return request<Sale>(`/sales/${saleId}`);
  },

  createSale: (saleData: {
    customer_id?: number;
    branch_id: number;
    currency: string;
    payment_method: string;
    discount_amount: number;
    items: Array<{ product_id: number; quantity: number; discount_amount: number }>;
  }) => {
    return request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData)
    });
  },

  // Purchases
  getPurchases: () => {
    return request<Purchase[]>('/purchases');
  },

  createPurchase: (purchaseData: {
    supplier_id: number;
    currency: string;
    items: Array<{ product_id: number; quantity: number; unit_cost: number }>;
  }) => {
    return request<Purchase>('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData)
    });
  },

  receivePurchase: (purchaseId: number) => {
    return request<Purchase>(`/purchases/${purchaseId}/receive`, {
      method: 'POST'
    });
  },

  // Customers
  getCustomers: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Customer[]>(`/customers${query}`);
  },

  createCustomer: (customerData: Partial<Customer>) => {
    return request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  },

  // Suppliers
  getSuppliers: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Supplier[]>(`/suppliers${query}`);
  },

  createSupplier: (supplierData: Partial<Supplier>) => {
    return request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData)
    });
  },

  // Expenses
  getExpenses: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request<Expense[]>(`/expenses${query}`);
  },

  createExpense: (expenseData: Partial<Expense>) => {
    return request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expenseData)
    });
  },

  // Reports
  getReportsSummary: (branchId?: number, startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (branchId) query.append('branch_id', String(branchId));
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);
    const qs = query.toString();
    return request<ReportSummary>(`/reports/summary${qs ? `?${qs}` : ''}`);
  },

  exportSalesCsvUrl: `${API_BASE_URL}/reports/export/csv`,

  // Fiscal
  getFiscalInvoice: (saleId: number) => {
    return request<FiscalInvoice>(`/fiscal/invoice/${saleId}`);
  }
};
