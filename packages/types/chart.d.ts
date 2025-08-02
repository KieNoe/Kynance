export interface StockInfo {
  id: string;
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent?: number;
  volume: number;
  turnover?: number;
  marketCap?: number;
  pe?: number;
  pb?: number;
  isSelected?: boolean;
}
