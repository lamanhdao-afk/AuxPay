/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AssetType = 'GOLD' | 'USD' | 'AUX' | 'BTC';

export interface Asset {
  id: AssetType;
  name: string;
  symbol: string;
  balance: number;
  balanceInUSD: number;
  change24h: number; // percentage
  color: string; // Tailwind color class or hex
  sparkline: number[];
  iconName: string;
}

export interface CreditCard {
  id: string;
  type: 'GOLD_METAL' | 'TITANIUM_DEBIT' | 'CYBER_EMERALD';
  number: string;
  expiry: string;
  cvv: string;
  cardholder: string;
  balance: number;
  limit: number;
  isFrozen: boolean;
  color: string;
  metallicSheen: string;
}

export interface Transaction {
  id: string;
  title: string;
  description: string;
  merchant: string;
  category: 'Shopping' | 'Food' | 'Utilities' | 'Travel' | 'Investment' | 'Transfer';
  amount: number; // Positive for income, negative for expense
  assetType: AssetType;
  amountInUSD: number;
  date: string; // ISO string or simple text like "Today, 14:32"
  status: 'Completed' | 'Pending' | 'Failed';
  referenceId: string;
  fundingSource: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}
