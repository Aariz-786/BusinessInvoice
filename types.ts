export enum InvoiceStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Retrying = 'Retrying',
  Overdue = 'Overdue'
}

export interface Tenant {
  id: string;
  name: string;
  unit: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  tenantId: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
}

export interface UtilityMeter {
  id: string;
  tenantId: string;
  unit: string;
  utilityType: 'Power' | 'Water' | 'Gas';
  historicalUsage: number[];
}

export interface BookableResource {
  id: string;
  name: string;
  hourlyRate: number;
  availability: {
    day: string;
    startHour: number;
    endHour: number;
  }[];
}

export interface Booking {
  id: string;
  resourceId: string;
  tenantId: string;
  startTime: Date;
  endTime: Date;
  cost: number;
}

export type View = 'dashboard' | 'utilities' | 'booking' | 'invoices' | 'creator';

export interface BillDetails {
  totalAmount: number;
  billingPeriod: string;
  totalUsage: string;
}

export interface AnomalyReport {
  isAnomaly: boolean;
  reasoning: string;
}