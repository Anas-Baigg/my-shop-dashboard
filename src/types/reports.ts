export interface Employee {
    name: string;
}

export interface TransactionItem{
    id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    transaction_id: string;
}

export interface Transaction {
    id: string;
    created_at : string;
    employee_id : string;
    employee?: Employee;
    payment_method: "Cash" | "Card";
    base_total: number;
    discount: number;
    tip: number;
    final_total: number;
    shop_id: string;
}

export interface TillBalance{
    id: string;
    balance_date: string;
    balance_amount: number;
    shop_id: string;
}

export interface DailyReportRow {
  date: string;
  openingBalance: number;
  cashSales: number;
  cardSales: number;
  expectedCashInTill: number;
}