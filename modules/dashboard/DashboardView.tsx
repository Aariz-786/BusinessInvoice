
import React, { useState } from 'react';
import { Invoice, InvoiceStatus, Booking } from '../../types';
import SummaryCard from './SummaryCard';
import UsageChart from './UsageChart';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import { mockTenants, mockBookableResources } from '../../data/mockData';
import { generatePresentationContent } from '../../services/geminiService';
import { generateDashboardPPT } from '../../services/pptService';


interface DashboardViewProps {
  invoices: Invoice[];
  bookings: Booking[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ invoices, bookings }) => {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalOutstanding = invoices
    .filter(inv => inv.status !== InvoiceStatus.Paid)
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;

    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;

    return "Just now";
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

  const getTenantName = (tenantId: string) => {
      return mockTenants.find(t => t.id === tenantId)?.name || 'Unknown Tenant';
  }

  const getResourceName = (resourceId: string) => {
      return mockBookableResources.find(r => r.id === resourceId)?.name || 'Unknown Resource';
  }

  const recentBookings = bookings
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 4)
    .map(booking => ({
        tenant: getTenantName(booking.tenantId),
        resource: getResourceName(booking.resourceId),
        date: formatTimeAgo(booking.startTime),
    }));
  
  const handleCommand = async () => {
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;

    if (cmd.includes('ppt') || cmd.includes('presentation') || cmd.includes('report')) {
      setIsProcessing(true);
      try {
        const statsContext = `
          Total Billed: $${totalBilled}
          Total Outstanding: $${totalOutstanding}
          Active Tenants: ${mockTenants.length}
          Number of Recent Bookings: ${bookings.length}
          Number of Invoices: ${invoices.length}
        `;

        // 1. Get AI Content
        const aiContent = await generatePresentationContent(statsContext);

        // 2. Generate PPT
        await generateDashboardPPT({
            totalBilled,
            totalOutstanding,
            activeTenants: mockTenants.length,
            anomalyCount: 1 // Mocked for now
        }, invoices, aiContent);

        setCommand('');
        alert("Presentation downloaded successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to generate presentation. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
        alert("Command not recognized. Try 'Generate PPT report'.");
    }
  };

  return (
    <div className="py-4">
      <h2 className="my-6 text-2xl font-semibold text-gray-700">Dashboard</h2>
      
      {/* AI Command Bar */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-blue-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">AI Command Center</label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 <i className="fa-solid fa-wand-magic-sparkles text-blue-400"></i>
            </div>
            <input 
                type="text" 
                placeholder="Ask AI to generate a report (e.g. 'Generate monthly PPT')..." 
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            />
          </div>
          <button 
            onClick={handleCommand}
            disabled={isProcessing || !command.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-32 flex justify-center items-center"
          >
            {isProcessing ? <Spinner /> : 'Execute'}
          </button>
        </div>
        <div className="mt-2 flex gap-2">
             <span 
                onClick={() => setCommand("Generate monthly PPT report")}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
             >
                <i className="fa-solid fa-file-powerpoint mr-1"></i> Generate monthly PPT report
             </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Billed (All Time)" value={`$${totalBilled.toFixed(2)}`} icon="fa-solid fa-dollar-sign" color="blue" />
        <SummaryCard title="Total Outstanding" value={`$${totalOutstanding.toFixed(2)}`} icon="fa-solid fa-hand-holding-dollar" color="orange" />
        <SummaryCard title="Utility Anomalies" value="1 Alert" icon="fa-solid fa-triangle-exclamation" color="red" />
        <SummaryCard title="Active Tenants" value="3" icon="fa-solid fa-users" color="green" />
      </div>

      {/* Charts and Lists */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
         <UsageChart />
      </div>
       <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Invoice Status</h3>
             <div className="overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                    <thead>
                        <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b">
                            <th className="px-4 py-3">Tenant</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                       {invoices.slice(0, 4).map(invoice => (
                           <tr key={invoice.id} className="text-gray-700">
                               <td className="px-4 py-3 text-sm">{getTenantName(invoice.tenantId)}</td>
                               <td className="px-4 py-3 text-sm">${invoice.totalAmount.toFixed(2)}</td>
                               <td className="px-4 py-3 text-xs">
                                   <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusColor(invoice.status)}`}>
                                       {invoice.status}
                                   </span>
                               </td>
                           </tr>
                       ))}
                    </tbody>
                </table>
            </div>
        </Card>
         <Card>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Bookings</h3>
            {recentBookings.length > 0 ? (
                <ul>
                {recentBookings.map((booking, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                            <p className="font-semibold text-gray-800">{booking.tenant}</p>
                            <p className="text-sm text-gray-500">{booking.resource}</p>
                        </div>
                        <p className="text-sm text-gray-500">{booking.date}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No recent bookings.</p>
            )}
        </Card>
      </div>

    </div>
  );
};

export default DashboardView;
