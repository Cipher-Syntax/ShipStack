import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import softwareRequestService from '../../services/softwareRequestService';

const RequestDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [request, setRequest] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [proposalForm, setProposalForm] = useState({
        message: '',
        proposed_price: '',
        estimated_days: ''
    });
    const [submittingProposal, setSubmittingProposal] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const reqData = await softwareRequestService.getRequest(id);
                setRequest(reqData);
                
                // If user is buyer, fetch proposals
                if (user && user.id === reqData.buyer.id) {
                    const propData = await softwareRequestService.getProposals(id);
                    setProposals(propData);
                } else if (user && user.is_verified_developer) {
                    // Try to fetch proposals (might be 403 if they don't own it, wait, backend says only owner can view proposals list)
                    // Let's rely on the backend only allowing the owner to list all.
                    // Wait, how does a developer know if they submitted one? The backend restricts the LIST endpoint to owner only.
                    // Oh! If a developer submitted one, the backend would reject a second one.
                    // Let's just catch 403 if they try to fetch proposals.
                    try {
                        // Actually, I can't fetch list of proposals as developer. 
                        // I will just rely on the form. If submit fails with "already submitted", show that.
                    } catch (e) {
                        // Ignore
                    }
                }
            } catch (err) {
                console.error("Failed to fetch request", err);
                setError('Failed to load request details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user]);

    const handleCancelRequest = async () => {
        if (!window.confirm("Are you sure you want to cancel this request?")) return;
        try {
            await softwareRequestService.cancelRequest(id);
            setRequest(prev => ({ ...prev, status: 'CANCELLED' }));
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to cancel request.");
        }
    };

    const handleProposalChange = (e) => {
        const { name, value } = e.target;
        setProposalForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProposalSubmit = async (e) => {
        e.preventDefault();
        setSubmittingProposal(true);
        setActionError('');
        try {
            const submitData = { ...proposalForm };
            if (!submitData.estimated_days) delete submitData.estimated_days;
            await softwareRequestService.submitProposal(id, submitData);
            
            // Show success state locally without needing to fetch from backend
            setProposalForm({ message: '', proposed_price: '', estimated_days: '' });
            setActionSuccess('Your proposal was successfully submitted! The buyer will review it shortly.');
        } catch (err) {
            setActionError(err.response?.data?.detail || "Failed to submit proposal.");
            if (Array.isArray(err.response?.data?.non_field_errors)) {
                setActionError(err.response.data.non_field_errors[0]);
            }
        } finally {
            setSubmittingProposal(false);
        }
    };

    const handleAcceptProposal = async (proposalId) => {
        if (!window.confirm("Are you sure you want to accept this proposal?")) return;
        try {
            await softwareRequestService.acceptProposal(proposalId);
            // Refresh
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to accept proposal.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !request) {
        return <div className="text-center text-red-500 py-12">{error || "Request not found"}</div>;
    }

    const isBuyer = user && user.id === request.buyer.id;
    const isVerifiedDeveloper = user && user.is_verified_developer;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{request.title}</h1>
                        <div className="flex items-center space-x-4 text-sm">
                            <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                                request.status === 'OPEN' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                                {request.status}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                Posted by {request.buyer.username} on {new Date(request.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    {isBuyer && request.status === 'OPEN' && (
                        <button
                            onClick={handleCancelRequest}
                            className="px-4 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-md shadow-sm text-sm font-medium dark:bg-gray-800 dark:border-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                        >
                            Cancel Request
                        </button>
                    )}
                </div>

                <div className="prose dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">
                    {request.description}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Project Details</h4>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">{request.category_detail?.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Budget</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {request.budget_min && request.budget_max 
                                        ? `$${request.budget_min} - $${request.budget_max}`
                                        : request.budget_min ? `From $${request.budget_min}`
                                        : request.budget_max ? `Up to $${request.budget_max}`
                                        : 'Open'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Deadline</dt>
                                <dd className="font-medium text-gray-900 dark:text-white">
                                    {request.deadline ? new Date(request.deadline).toLocaleDateString() : 'Flexible'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-3">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                            {request.technologies_detail?.map(t => (
                                <span key={t.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    {t.name}
                                </span>
                            ))}
                            {(!request.technologies_detail || request.technologies_detail.length === 0) && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">Any</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Buyer View: Proposals */}
            {isBuyer && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Proposals</h2>
                    {proposals.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">No proposals have been submitted yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {proposals.map(proposal => (
                                <div key={proposal.id} className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${proposal.status === 'ACCEPTED' ? 'border-green-500' : 'border-gray-100 dark:border-gray-700'} shadow-sm`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Proposal from {proposal.developer.username}</h3>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                proposal.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {proposal.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">${proposal.proposed_price}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{proposal.estimated_days ? `${proposal.estimated_days} days` : 'Flexible timeline'}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">{proposal.message}</p>
                                    
                                    {request.status === 'OPEN' && proposal.status === 'PENDING' && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleAcceptProposal(proposal.id)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm"
                                            >
                                                Accept Proposal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Developer View: Submit Proposal */}
            {!isBuyer && isVerifiedDeveloper && request.status === 'OPEN' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit a Proposal</h2>
                    
                    {actionError && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                            <p className="text-sm text-red-700">{actionError}</p>
                        </div>
                    )}
                    
                    {actionSuccess && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                            <p className="text-sm text-green-700">{actionSuccess}</p>
                        </div>
                    )}

                    {!actionSuccess && (
                        <form onSubmit={handleProposalSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message / Pitch *
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    value={proposalForm.message}
                                    onChange={handleProposalChange}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Explain why you are the best fit for this request..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Proposed Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="proposed_price"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={proposalForm.proposed_price}
                                        onChange={handleProposalChange}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Estimated Days (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        name="estimated_days"
                                        min="1"
                                        value={proposalForm.estimated_days}
                                        onChange={handleProposalChange}
                                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={submittingProposal}
                                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                                >
                                    {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Unauthenticated or not verified developer prompt */}
            {!isBuyer && !isVerifiedDeveloper && request.status === 'OPEN' && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800 text-center">
                    <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-200 mb-2">Want to bid on this request?</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                        You must be a verified developer on ShipStack to submit a proposal.
                    </p>
                    <Link to={user ? "/developer/apply" : "/login"} className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
                        {user ? "Apply for Verification" : "Log in to Apply"}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RequestDetailPage;
