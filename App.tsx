import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { View, Invoice, Booking, InvoiceStatus, InvoiceLineItem } from './types';
import DashboardView from './modules/dashboard/DashboardView';
import UtilityView from './modules/utils/UtilityView';
import BookingView from './modules/booking/BookingView';
import InvoicesView from './modules/payments/InvoicesView';
import InvoiceCreatorView from './modules/creator/InvoiceCreatorView';
import { mockInvoices, mockBookings, mockBookableResources } from './data/mockData';
import HomePage from './components/HomePage';

const App: React.FC = () => {
    const [appStarted, setAppStarted] = useState(false);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);

    const handleAddBooking = (newBooking: Booking) => {
        setBookings(prevBookings => [...prevBookings, newBooking]);

        setInvoices(prevInvoices => {
            const invoiceIndex = prevInvoices.findIndex(inv => 
                inv.tenantId === newBooking.tenantId && 
                inv.status !== InvoiceStatus.Paid
            );

            if (invoiceIndex === -1) {
                console.warn("No active invoice found for tenant:", newBooking.tenantId);
                return prevInvoices;
            }

            const updatedInvoices = [...prevInvoices];
            const invoiceToUpdate = { ...updatedInvoices[invoiceIndex] };
            
            const resource = mockBookableResources.find(r => r.id === newBooking.resourceId);

            const newLineItem: InvoiceLineItem = {
                id: `li_${Date.now()}`,
                description: `${resource?.name || 'Booked Resource'} (1 hour)`,
                amount: newBooking.cost,
            };

            invoiceToUpdate.lineItems = [...invoiceToUpdate.lineItems, newLineItem];
            invoiceToUpdate.totalAmount += newBooking.cost;
            updatedInvoices[invoiceIndex] = invoiceToUpdate;

            return updatedInvoices;
        });
    };

    const handleAddInvoice = (newInvoiceData: Omit<Invoice, 'id' | 'status'>) => {
        const newInvoice: Invoice = {
            ...newInvoiceData,
            id: `inv_${Date.now()}`,
            status: InvoiceStatus.Pending,
        };
        setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
    };


    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView invoices={invoices} bookings={bookings} />;
            case 'utilities':
                return <UtilityView />;
            case 'booking':
                return <BookingView bookings={bookings} onAddBooking={handleAddBooking} />;
            case 'invoices':
                return <InvoicesView invoices={invoices} setInvoices={setInvoices} />;
            case 'creator':
                return <InvoiceCreatorView onAddInvoice={handleAddInvoice} />;
            default:
                return <DashboardView invoices={invoices} bookings={bookings} />;
        }
    };

    if (!appStarted) {
        return <HomePage onStart={() => setAppStarted(true)} />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="flex flex-col flex-1 w-full">
                <Header />
                <main className="h-full overflow-y-auto">
                    <div className="container px-2 sm:px-6 mx-auto">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;