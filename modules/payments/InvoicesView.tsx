

import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { mockTenants } from '../../data/mockData';
import { Invoice, InvoiceStatus, Tenant } from '../../types';
import Card from '../../components/Card';

// NOTE: Removed invalid module augmentation for jspdf.
// Using type casting (as any) for plugin methods instead.

interface InvoicesViewProps {
    invoices: Invoice[];
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const InvoicesView: React.FC<InvoicesViewProps> = ({ invoices, setInvoices }) => {
    const getTenant = (tenantId: string): Tenant | undefined => {
        return mockTenants.find(t => t.id === tenantId);
    };

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.Paid: return 'bg-green-100 text-green-700';
            case InvoiceStatus.Pending: return 'bg-yellow-100 text-yellow-700';
            case InvoiceStatus.Retrying: return 'bg-orange-100 text-orange-700';
            case InvoiceStatus.Overdue:
            case InvoiceStatus.Failed: return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    const handlePaymentAction = (invoiceId: string, action: 'success' | 'hard_fail' | 'soft_fail') => {
        setInvoices(prevInvoices => prevInvoices.map(inv => {
            if (inv.id !== invoiceId) return inv;

            switch(action) {
                case 'success':
                    return { ...inv, status: InvoiceStatus.Paid };
                case 'hard_fail':
                    return { ...inv, status: InvoiceStatus.Failed };
                case 'soft_fail':
                    const newStatus = inv.status === InvoiceStatus.Retrying ? InvoiceStatus.Overdue : InvoiceStatus.Retrying;
                    return { ...inv, status: newStatus };
                default:
                    return inv;
            }
        }));
    };

    const handleDownloadPdf = (invoice: Invoice) => {
        const doc = new jsPDF();
        const tenant = getTenant(invoice.tenantId);

        // Header
        doc.setFontSize(20);
        doc.text('Invoice', 14, 22);
        doc.setFontSize(12);
        doc.text('BusinessInvoice Platform', 14, 30);

        // Invoice Info
        doc.setFontSize(10);
        doc.text(`Invoice ID: ${invoice.id}`, 14, 40);
        doc.text(`Issue Date: ${invoice.issueDate}`, 14, 45);
        doc.text(`Due Date: ${invoice.dueDate}`, 14, 50);
        
        // Tenant Info
        doc.text('Bill To:', 140, 40);
        doc.text(tenant?.name || 'N/A', 140, 45);
        doc.text(tenant?.unit || 'N/A', 140, 50);

        // Line Items Table
        const tableColumn = ["Description", "Amount"];
        const tableRows: (string | number)[][] = [];
        invoice.lineItems.forEach(item => {
            const itemData = [
                item.description,
                `$${item.amount.toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        // Fix: Cast doc to any to access autoTable plugin method
        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
        });

        // Total
        // Fix: Cast doc to any to access lastAutoTable property
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total: $${invoice.totalAmount.toFixed(2)}`, 140, finalY + 15);

        doc.save(`invoice-${invoice.id}.pdf`);
    };

    return (
        <div className="py-4">
            <h2 className="my-6 text-2xl font-semibold text-gray-700">Invoices & Payments</h2>
            <Card className="overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b">
                            <th className="px-4 py-3">Invoice ID</th>
                            <th className="px-4 py-3">Tenant</th>
                            <th className="px-4 py-3">Due Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-center">Payment Simulation</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="text-gray-700">
                                <td className="px-4 py-3 text-sm">{invoice.id}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center text-sm">
                                        <p className="font-semibold">{getTenant(invoice.tenantId)?.name}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm">{invoice.dueDate}</td>
                                <td className="px-4 py-3 text-sm">${invoice.totalAmount.toFixed(2)}</td>
                                <td className="px-4 py-3 text-xs">
                                    <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusColor(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                 <td className="px-4 py-3 text-sm">
                                    {invoice.status !== InvoiceStatus.Paid && (
                                        <div className="flex items-center space-x-2 justify-center">
                                            <button onClick={() => handlePaymentAction(invoice.id, 'success')} className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600" title="Simulate Success">Success</button>
                                            <button onClick={() => handlePaymentAction(invoice.id, 'soft_fail')} className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded hover:bg-orange-600" title="Simulate Soft Fail">Soft Fail</button>
                                            <button onClick={() => handlePaymentAction(invoice.id, 'hard_fail')} className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600" title="Simulate Hard Fail">Hard Fail</button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        onClick={() => handleDownloadPdf(invoice)}
                                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        title="Download PDF"
                                    >
                                        <i className="fa-solid fa-file-pdf"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default InvoicesView;