import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '../types'; // Using User type, which is equivalent to Profile
import { useAuth } from '../components/AuthContext';


type Tab = 'events' | 'members' | 'announcements';

const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('events');
    const [showSuccess, setShowSuccess] = useState('');
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'members') {
            const fetchMembers = async () => {
                setLoading(true);
                const { data, error } = await supabase.from('profiles').select('*');
                if (error) console.error("Error fetching members", error);
                else setMembers(data as User[]);
                setLoading(false);
            };
            fetchMembers();
        }
    }, [activeTab]);

    const handleEventSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const imageFile = formData.get('image') as File;

        // 1. Upload image to Supabase Storage
        let imageUrl = 'https://picsum.photos/seed/default/600/400'; // Default image
        if (imageFile && imageFile.size > 0) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('event-images') // Assumes a bucket named 'event-images'
                .upload(`${Date.now()}_${imageFile.name}`, imageFile);

            if (uploadError) {
                alert(`Storage Error: ${uploadError.message}`);
                return;
            }
            
            // 2. Get public URL of the uploaded image
            const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(uploadData.path);
            imageUrl = publicUrl;
        }

        // 3. Insert event details into the database
        const eventData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            date: formData.get('date') as string,
            image_url: imageUrl,
        };
        
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) {
            alert(`Error adding event: ${error.message}`);
        } else {
            setShowSuccess('Event added successfully!');
            e.currentTarget.reset();
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };

    const handleAnnouncementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const announcementData = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            author: user?.name || 'Admin',
            date: new Date().toISOString(),
        };

        const { error } = await supabase.from('announcements').insert([announcementData]);
        if (error) {
            alert(`Error posting announcement: ${error.message}`);
        } else {
            setShowSuccess('Announcement posted successfully!');
            e.currentTarget.reset();
            setTimeout(() => setShowSuccess(''), 3000);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return (
                    <form onSubmit={handleEventSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold">Event Title</label>
                            <input name="title" type="text" placeholder="e.g., Innovate-a-Thon 2025" required className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-primary"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold">Event Date</label>
                            <input name="date" type="date" required className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-primary"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold">Description</label>
                            <textarea name="description" placeholder="Details about the event..." rows={4} required className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-primary"></textarea>
                        </div>
                        <div>
                            <label className="text-sm font-bold block mb-1">Event Image</label>
                            <input 
                                name="image"
                                type="file" 
                                accept="image/*"
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-primary dark:hover:file:bg-primary/30"
                            />
                        </div>
                        <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all">
                            Add Event
                        </button>
                    </form>
                );
            case 'announcements':
                return (
                     <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-bold">Announcement Title</label>
                            <input name="title" type="text" placeholder="e.g., Call for Volunteers" required className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-primary"/>
                        </div>
                        <div>
                            <label className="text-sm font-bold">Content</label>
                            <textarea name="content" placeholder="Write your announcement here..." rows={6} required className="w-full mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-primary"></textarea>
                        </div>
                        <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all">
                            Post Announcement
                        </button>
                    </form>
                );
             case 'members':
                 return (
                     <div>
                        <h3 className="text-xl font-bold mb-4">Registered Members ({members.length})</h3>
                        {loading ? <p>Loading members...</p> : (
                             <div className="overflow-x-auto rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                                <table className="w-full text-left table-auto">
                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                            <th className="p-3 font-bold uppercase text-sm text-gray-600 dark:text-gray-300">Name</th>
                                            <th className="p-3 font-bold uppercase text-sm text-gray-600 dark:text-gray-300">Student ID</th>
                                            <th className="p-3 font-bold uppercase text-sm text-gray-600 dark:text-gray-300">Email</th>
                                            <th className="p-3 font-bold uppercase text-sm text-gray-600 dark:text-gray-300">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map(member => (
                                            <tr key={member.id} className="border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0">
                                                <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{member.name}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-400">{member.student_id}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-400">{member.email}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-400 capitalize">{member.role}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                     </div>
                 );
        }
    };

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-secondary dark:text-white">Admin Dashboard</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Manage website content and community members.</p>
                </div>
                
                <div className="max-w-3xl mx-auto bg-white/30 dark:bg-dark-card/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-800/20">
                    <div className="flex border-b border-gray-200/20 dark:border-gray-800/20">
                        <button onClick={() => setActiveTab('events')} className={`flex-1 p-4 font-bold transition-colors ${activeTab === 'events' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>Manage Events</button>
                        <button onClick={() => setActiveTab('announcements')} className={`flex-1 p-4 font-bold transition-colors ${activeTab === 'announcements' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>Announcements</button>
                        <button onClick={() => setActiveTab('members')} className={`flex-1 p-4 font-bold transition-colors ${activeTab === 'members' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}>Members</button>
                    </div>
                    <div className="p-8">
                        {renderContent()}
                    </div>
                </div>

                {showSuccess && (
                    <div className="fixed bottom-10 right-10 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
                        {showSuccess}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
