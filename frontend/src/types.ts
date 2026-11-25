export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  unit: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  minimum_stock: number;
  tax_category: string;
  active: boolean;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  nif?: string;
  credit_limit: number;
  opening_balance: number;
  current_balance: number;
}

export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  nif?: string;
  rccm?: string;
  opening_balance: number;
  current_balance: number;
}

export interface SaleItem {
  id: number;
  product_id: number;
  product_name_snapshot: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  line_total: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer_id?: number;
  customer_name?: string;
  branch_id: number;
  branch_name?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  cashier_name: string;
  items: SaleItem[];
}

export interface PurchaseItem {
  id: number;
  product_id: number;
  product_name_snapshot: string;
  quantity: number;
  unit_cost: number;
  line_total: number;
}

export interface Purchase {
  id: number;
  reference: string;
  supplier_id: number;
  supplier_name?: string;
  subtotal: number;
  total: number;
  currency: string;
  status: string;
  created_at: string;
  received_at?: string;
  items: PurchaseItem[];
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  currency: string;
  payment_method: string;
  expense_date: string;
  created_by: string;
}

export interface DashboardSummary {
  today_sales: number;
  today_transactions_count: number;
  total_revenue: number;
  gross_profit_estimate: number;
  low_stock_count: number;
  out_of_stock_count: number;
  currency: string;
  payment_methods_breakdown: Record<string, number>;
  recent_sales: Sale[];
  low_stock_products: Product[];
}

export interface FiscalInvoice {
  legal_disclaimer: string;
  invoice_number: string;
  fiscal_device_serial: string;
  fiscal_counter: string;
  digital_signature: string;
  qr_code_data: string;
  date_time: string;
  seller: {
    company_name: string;
    rccm: string;
    nif: string;
    centre_fiscal: string;
    address: string;
    phone: string;
    email: string;
  };
  customer: {
    name: string;
    nif: string;
    phone: string;
    address: string;
  };
  currency: string;
  payment_method: string;
  subtotal: number;
  vat_16_total: number;
  discount_total: number;
  total_ttc: number;
  line_items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    tax_rate_percent: number;
    tax_amount: number;
    discount: number;
    total_line: number;
  }>;
  cashier: string;
}

export interface DailyTrendPoint {
  date: string;
  revenue: number;
  expenses: number;
  net_margin: number;
}

export interface ReportSummary {
  total_sales: number;
  total_tax_collected: number;
  total_expenses: number;
  net_estimated_margin: number;
  total_transactions: number;
  top_selling_products: Array<{
    name: string;
    quantity_sold: number;
    revenue: number;
  }>;
  payment_methods: Record<string, number>;
  expense_categories: Record<string, number>;
  expenses_by_category: Record<string, number>;
  daily_trend: DailyTrendPoint[];
  granularity?: 'hour' | 'day' | 'week';
}
