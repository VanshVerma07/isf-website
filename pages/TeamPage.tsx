import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { TeamMember } from '../types';
import { LinkedInIcon, InstagramIcon, CloseIcon } from '../components/IconComponents';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

const TeamMemberCard: React.FC<{ member: TeamMember; onMessage: (member: TeamMember) => void }> = ({ member, onMessage }) => (
    <div className="bg-white/30 dark:bg-dark-card/30 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-primary/40 border border-white/20 dark:border-gray-800/20 text-center p-6 flex flex-col items-center group transform hover:-translate-y-2 transition-transform duration-300">
        <img src={member.photo_url} alt={member.name} className="w-36 h-36 rounded-full mb-4 border-4 border-primary/50 group-hover:border-primary transition-colors" />
        <h3 className="font-orbitron text-xl font-bold text-secondary dark:text-white">{member.name}</h3>
        <p className="text-primary font-semibold mb-4">{member.position}</p>
        <div className="flex space-x-4 mb-4">
            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
            <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
        </div>
        <button 
            onClick={() => onMessage(member)}
            className="mt-auto w-full px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all text-sm">
            Message
        </button>
    </div>
);

const MessageModal: React.FC<{ member: TeamMember; onClose: () => void }> = ({ member, onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
             <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10">
                <CloseIcon className="h-6 w-6"/>
            </button>
            <div className="p-8 text-center">
                 <h2 className="font-orbitron text-2xl font-bold mt-2 text-secondary dark:text-white">Send a Message</h2>
                 <p className="text-gray-600 dark:text-gray-400 mt-2">to <span className="font-bold text-primary">{member.name}</span></p>
                 <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> This feature would be powered by Supabase Realtime for 1:1 messaging in a full application.
                 </div>
                 <button onClick={onClose} className="mt-6 w-full px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all">
                    Close
                </button>
            </div>
        </div>
    </div>
);

const LoginPromptModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10">
                <CloseIcon className="h-6 w-6"/>
            </button>
            <h2 className="font-orbitron text-2xl font-bold text-secondary dark:text-white">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to message team members.</p>
            <div className="mt-6 flex gap-4">
                 <Link to="/login" className="flex-1 px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all">
                    Login
                </Link>
                <button onClick={onClose} className="flex-1 px-6 py-2 bg-gray-200 dark:bg-gray-700 font-bold rounded-full hover:bg-opacity-80 transition-all">
                    Cancel
                </button>
            </div>
        </div>
    </div>
);


const TeamPage: React.FC = () => {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [messagingMember, setMessagingMember] = useState<TeamMember | null>(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        const fetchTeam = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) {
                console.error("Error fetching team members:", error);
            } else {
                setTeamMembers(data as TeamMember[]);
            }
            setLoading(false);
        };
        fetchTeam();
    }, []);

    const handleMessageClick = (member: TeamMember) => {
        if (user) {
            setMessagingMember(member);
        } else {
            setShowLoginPrompt(true);
        }
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-secondary dark:text-white">Executive Committee</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">The student leaders driving the ISF community forward.</p>
                </div>
                {loading ? (
                     <p className="text-center text-gray-500 dark:text-gray-400">Loading team...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {teamMembers.map(member => (
                            <TeamMemberCard key={member.id} member={member} onMessage={handleMessageClick} />
                        ))}
                    </div>
                )}
            </div>
            {messagingMember && <MessageModal member={messagingMember} onClose={() => setMessagingMember(null)} />}
            {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
        </div>
    );
};

export default TeamPage;
