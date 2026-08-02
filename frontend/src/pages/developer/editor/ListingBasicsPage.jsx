import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, updateListing, getCategories } from '../../../services/listingService';
import { useToast } from '../../../contexts/ToastContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function ListingBasicsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ title: '', slug: '', short_description: '', category: '' });
    const [categories, setCategories] = useState([]);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        getListing(id).then(setData);
        getCategories().then(setCategories);
    }, [id]);

    const handleNext = async () => {
        setSaving(true);
        try {
            await updateListing(id, {
                title: data.title,
                slug: data.slug,
                short_description: data.short_description,
                category: data.category || null
            });
            navigate(`/developer/listings/${id}/details`);
        } catch (error) {
            console.error("Save failed", error);
            addToast("Failed to save. Check unique slug requirement.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">1. Basics</h1>
                <p className="text-text-secondary text-lg mt-2">Let's start with the core identity of your product.</p>
            </div>

            <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-text-primary mb-1">Listing Title</label>
                        <Input 
                            value={data.title} 
                            onChange={e => setData({...data, title: e.target.value})} 
                            placeholder="e.g. NextJS SaaS Boilerplate" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-text-primary mb-1">URL Slug</label>
                        <Input 
                            value={data.slug} 
                            onChange={e => setData({...data, slug: e.target.value})} 
                            placeholder="e.g. nextjs-saas-boilerplate" 
                        />
                    </div>
                </div>
                
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Short Description</label>
                    <textarea 
                        className="w-full bg-background-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-accent-primary transition-all h-24 resize-none"
                        value={data.short_description}
                        onChange={e => setData({...data, short_description: e.target.value})}
                        placeholder="A catchy one-liner about your product..."
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Category</label>
                    <select 
                        className="w-full bg-background-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-accent-primary transition-all appearance-none cursor-pointer"
                        value={data.category || ''}
                        onChange={e => setData({...data, category: e.target.value})}
                    >
                        <option value="">Select a category...</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={saving} className="px-8 shadow-md">
                    {saving ? 'Saving...' : 'Save & Continue'}
                </Button>
            </div>
        </div>
    );
}
