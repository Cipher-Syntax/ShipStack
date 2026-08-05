import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import softwareRequestService from '../../services/softwareRequestService';
import { Button } from '../../components/ui/button';

const CreateRequestPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget_min: '',
        budget_max: '',
        deadline: '',
        category: '',
        technologies: []
    });

    useEffect(() => {
        const fetchTaxonomy = async () => {
            try {
                const catRes = await api.get('/api/marketplace/categories/');
                const techRes = await api.get('/api/marketplace/technologies/');
                setCategories(catRes.data);
                setTechnologies(techRes.data);
                if (catRes.data.length > 0) {
                    setFormData(prev => ({ ...prev, category: catRes.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to load taxonomy", err);
            }
        };
        fetchTaxonomy();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleTechnology = (techId) => {
        setFormData(prev => {
            const isSelected = prev.technologies.includes(techId);
            if (isSelected) {
                return { ...prev, technologies: prev.technologies.filter(id => id !== techId) };
            } else {
                return { ...prev, technologies: [...prev.technologies, techId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const submitData = { ...formData };
            if (!submitData.budget_min) delete submitData.budget_min;
            if (!submitData.budget_max) delete submitData.budget_max;
            if (!submitData.deadline) delete submitData.deadline;

            const res = await softwareRequestService.createRequest(submitData);
            navigate(`/requests/${res.id}`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to create request. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-primary flex flex-col font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-background-secondary/30 -z-10 hidden lg:block"></div>
            
            <div className="pt-8 px-6 lg:px-12 w-full max-w-[1400px] mx-auto z-10">
                <button 
                    onClick={() => navigate('/requests')} 
                    className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group"
                >
                    <div className="p-1.5 rounded-full bg-background-secondary group-hover:bg-border-primary transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Requests
                </button>
            </div>

            <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 z-10">
                
                {/* Left Side: Typography & Info */}
                <div className="flex flex-col pt-4 lg:pt-12 lg:pr-8 animate-in slide-in-from-left-8 duration-700">
                    <h1 className="text-4xl lg:text-6xl font-display font-bold text-text-primary tracking-tight mb-6 leading-[1.1]">
                        What do you need <span className="text-accent-primary relative inline-block">
                            built?
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent-primary/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                        </span>
                    </h1>
                    <p className="text-xl text-text-secondary mb-12 font-light leading-relaxed">
                        Provide details about your custom software requirements and receive proposals from our verified developers.
                    </p>
                    
                    <div className="hidden lg:flex flex-col gap-8 mt-auto pb-12">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-1">
                                <Sparkles size={20} className="text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary mb-1">Get precise proposals</h3>
                                <p className="text-text-secondary leading-relaxed">Be as detailed as possible in your requirements to ensure developers understand exactly what you need built.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center shrink-0 mt-1">
                                <Check size={20} className="text-accent-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-text-primary mb-1">Only verified experts</h3>
                                <p className="text-text-secondary leading-relaxed">Only ShipStack verified developers can bid on your requests, ensuring high quality and reliability.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Flat Form */}
                <div className="animate-in slide-in-from-right-8 duration-700 delay-150">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1">Project Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-background-secondary border border-border-secondary hover:border-border-primary rounded-xl px-4 py-3.5 text-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all text-lg placeholder:text-text-tertiary"
                                placeholder="E.g., Custom AI Integration for CRM"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1">Detailed Requirements <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                required
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-background-secondary border border-border-secondary hover:border-border-primary rounded-xl px-4 py-3.5 text-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all resize-y placeholder:text-text-tertiary"
                                placeholder="Describe the features, user flows, and specific requirements..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-primary ml-1">Category <span className="text-red-500">*</span></label>
                                <select
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-background-secondary border border-border-secondary hover:border-border-primary rounded-xl px-4 py-3.5 text-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-primary ml-1">Deadline <span className="text-text-tertiary font-normal">(Optional)</span></label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="w-full bg-background-secondary border border-border-secondary hover:border-border-primary rounded-xl px-4 py-3.5 text-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary ml-1">Budget Range <span className="text-text-tertiary font-normal">(Optional)</span></label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-text-tertiary font-medium">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="budget_min"
                                        step="0.01"
                                        min="0"
                                        value={formData.budget_min}
                                        onChange={handleChange}
                                        placeholder="Min Budget"
                                        className="w-full bg-background-secondary border border-border-secondary hover:border-border-primary rounded-xl pl-8 pr-4 py-3.5 text-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all placeholder:text-text-tertiary"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-text-tertiary font-medium">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="budget_max"
                                        step="0.01"
                                        min="0"
                                        value={formData.budget_max}
                                        onChange={handleChange}
                                        placeholder="Max Budget"
                                        className="w-full bg-background-secondary border border-border-secondary hover:border-border-primary rounded-xl pl-8 pr-4 py-3.5 text-text-primary focus:ring-2 focus:ring-accent-primary/50 transition-all placeholder:text-text-tertiary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-text-primary ml-1">Preferred Technologies <span className="text-text-tertiary font-normal">(Optional)</span></label>
                            <div className="flex flex-wrap gap-2">
                                {technologies.map(t => {
                                    const isSelected = formData.technologies.includes(t.id);
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => toggleTechnology(t.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                                                isSelected 
                                                    ? 'bg-accent-primary border-accent-primary text-white shadow-md shadow-accent-primary/20' 
                                                    : 'bg-background-secondary border-border-secondary text-text-secondary hover:border-border-primary hover:text-text-primary'
                                            }`}
                                        >
                                            {t.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loading ? 'Publishing Request...' : 'Publish Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRequestPage;
