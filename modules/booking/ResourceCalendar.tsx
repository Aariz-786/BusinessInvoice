import React, { useState, useEffect } from 'react';
import { BookableResource, Booking } from '../../types';

interface ResourceCalendarProps {
    resource: BookableResource;
    bookings: Booking[];
    onAddBooking: (booking: Booking) => void;
}

type SlotStatus = 'available' | 'booked' | 'locked';

interface TimeSlot {
    time: string;
    status: SlotStatus;
}

const ResourceCalendar: React.FC<ResourceCalendarProps> = ({ resource, bookings, onAddBooking }) => {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    useEffect(() => {
        const generateTimeSlots = (start: number, end: number): TimeSlot[] => {
            const generatedSlots: TimeSlot[] = [];
            for (let i = start; i < end; i++) {
                const isBooked = bookings.some(booking =>
                    booking.resourceId === resource.id &&
                    new Date(booking.startTime).getHours() === i
                );
                generatedSlots.push({ time: `${i}:00`, status: isBooked ? 'booked' : 'available' });
            }
            return generatedSlots;
        };

        const availability = resource.availability[0];
        setSlots(generateTimeSlots(availability.startHour, availability.endHour));
        setSelectedSlot(null); // Reset selection when resource changes
    }, [resource, bookings]);

    const handleSlotClick = (clickedSlot: TimeSlot, index: number) => {
        if (clickedSlot.status !== 'available') return;

        // Reset previously locked slot and lock the new one
        const newSlots = slots.map((s, i) => {
            if (s.status === 'locked') return { ...s, status: 'available' };
            if (i === index) return { ...s, status: 'locked' };
            return s;
        });

        setSlots(newSlots);
        setSelectedSlot(newSlots[index]);

        // Simulate lock timeout - not implemented for this version for simplicity
    };
    
    const handleConfirmBooking = () => {
        if (!selectedSlot) return;

        const hour = parseInt(selectedSlot.time.split(':')[0], 10);
        const newBooking: Booking = {
            id: `bk_${Date.now()}`,
            resourceId: resource.id,
            tenantId: 't1', // Hardcoded to Smith Accounting LLC for demo
            startTime: new Date(new Date().setHours(hour, 0, 0, 0)),
            endTime: new Date(new Date().setHours(hour + 1, 0, 0, 0)),
            cost: resource.hourlyRate,
        };
        
        onAddBooking(newBooking);
        setSelectedSlot(null);
    };

    const getStatusClasses = (status: SlotStatus) => {
        switch (status) {
            case 'available': return 'bg-white text-blue-700 hover:bg-blue-50 border-gray-300';
            case 'booked': return 'bg-gray-200 text-gray-500 cursor-not-allowed';
            case 'locked': return 'bg-blue-500 text-white border-blue-500';
        }
    };

    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-800">{resource.name} - ${resource.hourlyRate}/hr</h4>
            <div className="grid grid-cols-4 gap-2 mt-4">
                {slots.map((slot, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlotClick(slot, index)}
                        disabled={slot.status === 'booked'}
                        className={`p-2 border rounded-lg text-sm font-medium transition-colors duration-150 ${getStatusClasses(slot.status)}`}
                    >
                        {slot.time}
                    </button>
                ))}
            </div>
            {selectedSlot && (
                 <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        Confirm booking for <span className="font-bold">{resource.name}</span> at <span className="font-bold">{selectedSlot.time}</span>?
                    </p>
                    <button 
                        onClick={handleConfirmBooking}
                        className="w-full mt-2 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResourceCalendar;