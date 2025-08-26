import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../services/supabaseClient';

// Assuming a table `threads` with a similar structure
interface Thread {
    id: number;
    title: string;
    author: string; // This would ideally be a foreign key to a user profile
    replies: number;
    last_post: string; // A timestampz from postgres
}

const CommunityPage: React.FC = () => {
    const { user } = useAuth();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchThreads = async () => {
            if (!loading) setLoading(true);
            const { data, error } = await supabase
                .from('threads')
                .select('*')
                .order('last_post', { ascending: false });
            
            if (error) console.error("Error fetching threads", error);
            else setThreads(data as Thread[]);
            setLoading(false);
        };
        fetchThreads();

        const channel = supabase
            .channel('public:threads')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'threads' }, payload => {
                console.log('Thread change received!', payload);
                fetchThreads(); // Refetch data on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-secondary dark:text-white">Community Forum</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">A place for ISF members to connect, collaborate, and ask questions.</p>
                </div>
                
                <div className="max-w-4xl mx-auto bg-white/30 dark:bg-dark-card/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-800/20 p-6">
                   {user ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-orbitron text-2xl font-bold">Welcome, {user.name.split(' ')[0]}!</h2>
                                <button className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all text-sm">
                                    New Post
                                </button>
                            </div>
                            <div className="space-y-4 mt-6">
                                {loading ? (
                                    <p className="text-center text-gray-500">Loading threads...</p>
                                ) : threads.length > 0 ? (
                                    threads.map(thread => (
                                         <div key={thread.id} className="p-4 rounded-lg bg-white/50 dark:bg-dark-card/50 hover:bg-white dark:hover:bg-dark-card transition-colors flex justify-between items-center cursor-pointer">
                                            <div>
                                                <h3 className="font-bold text-lg text-secondary dark:text-white">{thread.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">by {thread.author} • {thread.replies} replies</p>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(thread.last_post).toLocaleDateString()}</span>
                                         </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No threads yet. Start the conversation!</p>
                                )}
                            </div>
                        </>
                    ) : (
                         <div className="mt-6 text-center p-6 bg-gray-100 dark:bg-gray-900/50 rounded-lg">
                            <h3 className="font-bold text-xl">Join the Conversation!</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Become an ISF member to post, reply, and access exclusive resources.</p>
                            <Link to="/login" className="mt-4 inline-block px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-opacity-80 transition-all">
                                Login or Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
