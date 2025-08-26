
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IETE_DESCRIPTION } from '../constants';
import type { TeamMember, Event as EventType, Announcement } from '../types';
import { supabase } from '../services/supabaseClient';


const HeroSection: React.FC = () => (
  <div className="relative h-[80vh] w-full overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
      src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-circuit-board-with-moving-electrons-and-light-39783-large.mp4"
    />
    <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
    <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
      <h1 className="font-orbitron text-4xl md:text-7xl font-bold uppercase tracking-widest animate-fadeIn">
        IETE Student Forum
      </h1>
      <p className="font-rajdhani text-lg md:text-2xl mt-4 max-w-3xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        BK Birla Institute of Engineering & Technology, Pilani
      </p>
      <Link to="/events" className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-transform hover:scale-105 transform animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        Explore Our Events
      </Link>
    </div>
  </div>
);

const AboutSection: React.FC = () => (
    <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="font-orbitron text-3xl font-bold text-secondary dark:text-white mb-4">About IETE Student Forum</h2>
        <p className="max-w-4xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{IETE_DESCRIPTION}</p>
    </div>
);

const EventCard: React.FC<{ event: EventType }> = ({ event }) => (
    <div className="relative overflow-hidden rounded-lg shadow-lg group">
        <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-6">
            <h3 className="font-orbitron text-xl font-bold text-white">{event.title}</h3>
            <p className="text-gray-300 text-sm mt-2">{event.description}</p>
        </div>
    </div>
);


const EventsSection: React.FC = () => {
    const [events, setEvents] = useState<EventType[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false })
                .limit(3);
            if (error) console.error("Error fetching events", error);
            else setEvents(data as EventType[]);
        };
        fetchEvents();
    }, []);
    
    return (
        <div className="bg-light-bg dark:bg-dark-bg py-16">
            <div className="container mx-auto px-6">
                <h2 className="font-orbitron text-3xl font-bold text-center text-secondary dark:text-white mb-8">Recent Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.length > 0 ? events.map(event => <EventCard key={event.id} event={event} />) : <p className="text-center col-span-full text-gray-500">Loading events...</p>}
                </div>
                <div className="text-center mt-12">
                    <Link to="/events" className="px-8 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all">
                        View All Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="text-center p-4 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-2 transition-all duration-300">
        <img src={member.photo_url} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary/50" />
        <h3 className="font-orbitron text-xl font-bold text-secondary dark:text-white">{member.name}</h3>
        <p className="text-primary font-semibold">{member.position}</p>
    </div>
);

const TeamSection: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeam = async () => {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .limit(4);
            if (error) console.error("Error fetching team members", error);
            else setTeamMembers(data as TeamMember[]);
        };
        fetchTeam();
    }, []);

    return (
        <div className="container mx-auto px-6 py-16">
            <h2 className="font-orbitron text-3xl font-bold text-center text-secondary dark:text-white mb-8">Our Executive Committee</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.length > 0 ? teamMembers.map(member => <TeamMemberCard key={member.id} member={member} />) : <p className="text-center col-span-full text-gray-500">Loading team...</p>}
            </div>
            <div className="text-center mt-12">
                <Link to="/team" className="px-8 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all">
                    Meet The Full Team
                </Link>
            </div>
        </div>
    );
};

const AnnouncementsSection: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2);
            if (error) console.error("Error fetching announcements", error);
            else setAnnouncements(data as Announcement[]);
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="bg-light-bg dark:bg-dark-bg py-16">
            <div className="container mx-auto px-6">
                <h2 className="font-orbitron text-3xl font-bold text-center text-secondary dark:text-white mb-8">Announcements</h2>
                <div className="max-w-2xl mx-auto space-y-6">
                    {announcements.length > 0 ? announcements.map(announcement => (
                        <div key={announcement.id} className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-md rounded-lg p-6 shadow-md border border-gray-200/20 dark:border-gray-800/20">
                            <h3 className="font-orbitron text-xl font-bold text-secondary dark:text-white">{announcement.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">By {announcement.author} on {new Date(announcement.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 dark:text-gray-300">{announcement.content}</p>
                        </div>
                    )) : <p className="text-center text-gray-500">Loading announcements...</p>}
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <TeamSection />
      <AnnouncementsSection />
    </div>
  );
};

export default HomePage;
