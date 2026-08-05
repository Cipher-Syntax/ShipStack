import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus } from 'lucide-react';
import softwareRequestService from '../../services/softwareRequestService';

const RequestsBrowsePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await softwareRequestService.getRequests();
                setRequests(data);
            } catch (err) {
                console.error("Failed to fetch requests", err);
                setError('Failed to load requests.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <button 
                onClick={() => navigate('/dashboard')} 
                className="mb-8 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group w-max"
            >
                <div className="p-1.5 rounded-full bg-background-secondary group-hover:bg-border-primary transition-colors">
                    <ArrowLeft size={16} />
                </div>
                Back to Dashboard
            </button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">Software Requests</h1>
                    <p className="mt-2 text-lg text-text-secondary font-light">
                        Browse custom software development requests from our community.
                    </p>
                </div>
                {user && (
                    <Link
                        to="/requests/new"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-hover active:scale-[0.98] transition-all shadow-lg shadow-accent-primary/20"
                    >
                        <Plus size={18} />
                        Post a Request
                    </Link>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-12">{error}</div>
            ) : requests.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active requests</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Check back later or post your own.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {requests.map(req => (
                        <Link key={req.id} to={`/requests/${req.id}`} className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 h-full transition duration-300 ease-in-out transform group-hover:-translate-y-1 group-hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{req.title}</h3>
                                    {req.category_detail && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                            {req.category_detail.name}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                                    {req.description}
                                </p>
                                <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {req.budget_min && req.budget_max 
                                                ? `$${req.budget_min} - $${req.budget_max}`
                                                : req.budget_min 
                                                    ? `From $${req.budget_min}`
                                                    : req.budget_max 
                                                        ? `Up to $${req.budget_max}`
                                                        : 'Open'
                                            }
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Posted</p>
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RequestsBrowsePage;
