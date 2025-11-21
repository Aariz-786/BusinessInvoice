import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { mockTenants } from '../../data/mockData';
import { Invoice, InvoiceLineItem, InvoiceStatus, Tenant } from '../../types';

interface InvoiceCreatorViewProps {
  onAddInvoice: (invoice: Omit<Invoice, 'id' | 'status'>) => void;
}

const InvoiceCreatorView: React.FC<InvoiceCreatorViewProps> = ({ onAddInvoice }) => {
  const emptyLineItem = { id: `li_${Date.now()}`, description: '', amount: 0 };
  const [tenantId, setTenantId] = useState<string>(mockTenants[0].id);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toISOString().split('T')[0];
  });
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([emptyLineItem]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setTotalAmount(total);
  }, [lineItems]);

  const handleLineItemChange = (index: number, field: 'description' | 'amount', value: string) => {
    const newItems = [...lineItems];
    if (field === 'amount') {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { id: `li_${Date.now()}`, description: '', amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    const newItems = lineItems.filter((_, i) => i !== index);
    setLineItems(newItems);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || lineItems.some(li => !li.description || li.amount <= 0)) {
        alert("Please select a tenant and ensure all line items have a description and a valid amount.");
        return;
    }
    
    const newInvoice = {
        tenantId,
        issueDate,
        dueDate,
        totalAmount,
        lineItems: lineItems.filter(li => li.description && li.amount > 0),
    };
    onAddInvoice(newInvoice);

    // Reset form
    setTenantId(mockTenants[0].id);
    setIssueDate(new Date().toISOString().split('T')[0]);
    setLineItems([emptyLineItem]);
  };

  return (
    <div className="py-4">
      <h2 className="my-6 text-2xl font-semibold text-gray-700">Invoice Creator</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="tenant-select" className="block mb-2 text-sm font-medium text-gray-900">Tenant</label>
              <select
                id="tenant-select"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {mockTenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="issue-date" className="block mb-2 text-sm font-medium text-gray-900">Issue Date</label>
              <input
                type="date"
                id="issue-date"
                value={issueDate}
                onChange={e => setIssueDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="due-date" className="block mb-2 text-sm font-medium text-gray-900">Due Date</label>
              <input
                type="date"
                id="due-date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-t pt-4">Line Items</h3>
          
          {lineItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 mb-3">
              <input
                type="text"
                placeholder="Description (e.g., 'Electricity')"
                value={item.description}
                onChange={e => handleLineItemChange(index, 'description', e.target.value)}
                className="flex-grow bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
              />
              <input
                type="number"
                placeholder="Amount"
                value={item.amount === 0 ? '' : item.amount}
                onChange={e => handleLineItemChange(index, 'amount', e.target.value)}
                className="w-32 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                step="0.01"
              />
              <button 
                type="button" 
                onClick={() => removeLineItem(index)}
                className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-300"
                disabled={lineItems.length <= 1}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addLineItem}
            className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
          >
            <i className="fa-solid fa-plus mr-2"></i>Add Line Item
          </button>

          <div className="border-t mt-6 pt-4 flex justify-between items-center">
            <p className="text-xl font-bold text-gray-800">Total: ${totalAmount.toFixed(2)}</p>
            <button
              type="submit"
              className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InvoiceCreatorView;