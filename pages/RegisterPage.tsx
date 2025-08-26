import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!name || !studentId || !email || !password) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const { error: registerError } = await register(name, studentId, email, password);

        if (registerError) {
            setError(registerError.message || 'Failed to register. The email or student ID might already be in use.');
        } else {
            setSuccessMessage('Registration successful! Please check your email to verify your account.');
            // Don't navigate immediately; user needs to confirm their email.
            // In a real app, you'd protect routes until the email is confirmed.
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/30 dark:bg-dark-card/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-800/20 p-10">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-orbitron font-extrabold text-secondary dark:text-white">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="name" className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                        <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)}
                               className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                               placeholder="Your Full Name" disabled={loading}/>
                    </div>
                    <div>
                        <label htmlFor="student-id" className="text-sm font-bold text-gray-700 dark:text-gray-300">Student ID</label>
                        <input id="student-id" name="studentId" type="text" required value={studentId} onChange={e => setStudentId(e.target.value)}
                               className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                               placeholder="e.g., BK2023C07" disabled={loading}/>
                    </div>
                     <div>
                        <label htmlFor="email-address" className="text-sm font-bold text-gray-700 dark:text-gray-300">Email address</label>
                        <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}
                               className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                               placeholder="you@example.com" disabled={loading}/>
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                        <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)}
                               className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                               placeholder="Choose a strong password" disabled={loading}/>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
                    
                    <div>
                        <button type="submit"
                                disabled={loading}
                                className="group mt-4 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:bg-gray-500 disabled:cursor-not-allowed">
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-blue-400">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
