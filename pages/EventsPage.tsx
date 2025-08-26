
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Event } from '../types';
import { CloseIcon } from '../components/IconComponents';

const EventCard: React.FC<{ event: Event; onSelect: (event: Event) => void }> = ({ event, onSelect }) => (
  <div 
    className="bg-white/30 dark:bg-dark-card/30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden group cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 border border-white/20 dark:border-gray-800/20"
    onClick={() => onSelect(event)}
  >
    <img src={event.image_url} alt={event.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
    <div className="p-6">
      <p className="text-sm text-primary font-bold">{new Date(event.date).toLocaleDateString()}</p>
      <h3 className="font-orbitron text-2xl font-bold mt-2 text-secondary dark:text-white">{event.title}</h3>
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed truncate">{event.description}</p>
    </div>
  </div>
);

const EventModal: React.FC<{ event: Event; onClose: () => void }> = ({ event, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative bg-white dark:bg-dark-card w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10">
                <CloseIcon className="h-6 w-6"/>
            </button>
            <img src={event.image_url} alt={event.title} className="w-full md:w-1/2 h-64 md:h-auto object-cover"/>
            <div className="p-8 flex flex-col">
                <p className="text-primary font-bold">{new Date(event.date).toLocaleDateString()}</p>
                <h2 className="font-orbitron text-3xl font-bold mt-2 text-secondary dark:text-white">{event.title}</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed flex-grow overflow-y-auto">{event.description}</p>
            </div>
        </div>
    </div>
);

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });
            
            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data as Event[]);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-secondary dark:text-white">Event Gallery</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">A showcase of our activities, workshops, and seminars.</p>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Loading events...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
                        ))}
                    </div>
                )}
            </div>
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </div>
    );
};

export default EventsPage;
