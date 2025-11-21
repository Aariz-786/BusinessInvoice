import { Tenant, Invoice, InvoiceStatus, UtilityMeter, BookableResource, Booking } from '../types';

export const mockTenants: Tenant[] = [
  { id: 't1', name: 'Smith Accounting LLC', unit: 'Suite 101' },
  { id: 't2', name: 'Innovate Tech Inc.', unit: 'Suite 102' },
  { id: 't3', name: 'Creative Designs Co.', unit: 'Suite 205' },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv001',
    tenantId: 't1',
    issueDate: '2023-10-01',
    dueDate: '2023-10-05',
    totalAmount: 350.75,
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li1', description: 'Electricity', amount: 150.75 },
      { id: 'li2', description: 'Conference Room A (2 hours)', amount: 200.00 },
    ],
  },
  {
    id: 'inv002',
    tenantId: 't2',
    issueDate: '2023-10-01',
    dueDate: '2023-10-05',
    totalAmount: 1250.00,
    status: InvoiceStatus.Retrying,
    lineItems: [
        { id: 'li3', description: 'Electricity', amount: 350.00 },
        { id: 'li4', description: 'Water', amount: 100.00 },
        { id: 'li5', description: 'Podcast Studio (4 hours)', amount: 800.00 },
    ],
  },
  {
    id: 'inv003',
    tenantId: 't3',
    issueDate: '2023-10-01',
    dueDate: '2023-10-05',
    totalAmount: 220.50,
    status: InvoiceStatus.Overdue,
    lineItems: [
        { id: 'li6', description: 'Electricity', amount: 220.50 },
    ],
  },
    {
    id: 'inv004',
    tenantId: 't1',
    issueDate: '2023-09-01',
    dueDate: '2023-09-05',
    totalAmount: 340.00,
    status: InvoiceStatus.Paid,
    lineItems: [
      { id: 'li7', description: 'Electricity', amount: 140.00 },
      { id: 'li8', description: 'Event Hall (4 hours)', amount: 200.00 },
    ],
  },
  {
    id: 'inv005',
    tenantId: 't1',
    issueDate: '2023-11-01',
    dueDate: '2023-11-05',
    totalAmount: 155.00,
    status: InvoiceStatus.Pending,
    lineItems: [
      { id: 'li9', description: 'Electricity', amount: 155.00 },
    ],
  },
];

export const mockUtilityMeters: UtilityMeter[] = [
    { id: 'um1', tenantId: 't1', unit: 'Suite 101', utilityType: 'Power', historicalUsage: [120, 125, 122, 130, 128, 135] },
    { id: 'um2', tenantId: 't1', unit: 'Suite 101', utilityType: 'Water', historicalUsage: [30, 32, 29, 33, 95, 34] },
    { id: 'um3', tenantId: 't2', unit: 'Suite 102', utilityType: 'Power', historicalUsage: [250, 260, 255, 265, 270, 268] },
];

export const mockBookableResources: BookableResource[] = [
    { id: 'br1', name: 'Conference Room A', hourlyRate: 100, availability: [{ day: 'Mon-Fri', startHour: 9, endHour: 17 }] },
    { id: 'br2', name: 'Podcast Studio', hourlyRate: 200, availability: [{ day: 'Mon-Fri', startHour: 9, endHour: 17 }] },
    { id: 'br3', name: 'Event Hall', hourlyRate: 50, availability: [{ day: 'Mon-Fri', startHour: 9, endHour: 21 }] },
];

export const mockBookings: Booking[] = [
    { id: 'bk1', resourceId: 'br1', tenantId: 't1', startTime: new Date(new Date().setHours(14, 0, 0, 0)), endTime: new Date(new Date().setHours(15, 0, 0, 0)), cost: 100 },
];