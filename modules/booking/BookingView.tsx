import React, { useState } from 'react';
import Card from '../../components/Card';
import { mockBookableResources } from '../../data/mockData';
import ResourceCalendar from './ResourceCalendar';
import { Booking } from '../../types';

interface BookingViewProps {
    bookings: Booking[];
    onAddBooking: (booking: Booking) => void;
}

const BookingView: React.FC<BookingViewProps> = ({ bookings, onAddBooking }) => {
    const [selectedResourceId, setSelectedResourceId] = useState(mockBookableResources[0].id);

    const selectedResource = mockBookableResources.find(r => r.id === selectedResourceId)!;

    return (
        <div className="py-4">
            <h2 className="my-6 text-2xl font-semibold text-gray-700">Real-time Resource Booking</h2>
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Resource List */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
                        <div className="space-y-2">
                           {mockBookableResources.map(resource => (
                               <button 
                                   key={resource.id}
                                   onClick={() => setSelectedResourceId(resource.id)}
                                   className={`w-full text-left p-3 rounded-lg text-sm transition-colors duration-150 ${selectedResourceId === resource.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                   {resource.name}
                                </button>
                           ))}
                        </div>
                    </div>

                    {/* Calendar View */}
                    <div className="md:col-span-3">
                         <ResourceCalendar 
                            resource={selectedResource} 
                            bookings={bookings}
                            onAddBooking={onAddBooking}
                          />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BookingView;