import { View } from './types';

interface NavItem {
  name: string;
  view: View;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', view: 'dashboard', icon: 'fa-solid fa-chart-pie' },
  { name: 'Utilities', view: 'utilities', icon: 'fa-solid fa-bolt' },
  { name: 'Booking', view: 'booking', icon: 'fa-solid fa-calendar-alt' },
  { name: 'Invoices', view: 'invoices', icon: 'fa-solid fa-file-invoice-dollar' },
  { name: 'Invoice Creator', view: 'creator', icon: 'fa-solid fa-plus-square' },
];