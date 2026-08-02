import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, updateListing, getTechnologies, getTags } from '../../../services/listingService';
import { useToast } from '../../../contexts/ToastContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function ListingDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ full_description: '', price: '', technologies: [], tags: [] });
    const [techs, setTechs] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        getListing(id).then(setData);
        getTechnologies().then(setTechs);
        getTags().then(setTagsList);
    }, [id]);

    const handleNext = async () => {
        setSaving(true);
        try {
            await updateListing(id, {
                full_description: data.full_description,
                price: data.price || null,
                technologies: data.technologies,
                tags: data.tags
            });
            navigate(`/developer/listings/${id}/media`);
        } catch (error) {
            console.error("Save failed", error);
            addToast("Failed to save details.", "error");
        } finally {
            setSaving(false);
        }
    };

    const toggleArrayItem = (field, itemId) => {
        const arr = data[field] || [];
        if (arr.includes(itemId)) {
            setData({ ...data, [field]: arr.filter(i => i !== itemId) });
        } else {
            setData({ ...data, [field]: [...arr, itemId] });
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">2. Details</h1>
                <p className="text-text-secondary text-lg mt-2">Provide the deep dive into your product.</p>
            </div>

            <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm space-y-8">
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Price (PHP)</label>
                    <div className="max-w-xs relative w-48">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold z-10">₱</span>
                        <Input 
                            className="pl-7 font-mono text-lg"
                            type="number"
                            step="0.01"
                            value={data.price || ''} 
                            onChange={e => setData({...data, price: e.target.value})} 
                            placeholder="e.g. 2500.00" 
                        />
                    </div>
                </div>
                
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Full Description (Markdown supported)</label>
                    <textarea 
                        className="w-full bg-background-primary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-accent-primary transition-all h-64 resize-y font-mono"
                        value={data.full_description}
                        onChange={e => setData({...data, full_description: e.target.value})}
                        placeholder="Detailed markdown description of features, benefits, and usage..."
                    />
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-text-primary">Technologies</label>
                    <div className="flex flex-wrap gap-2">
                        {techs.map(t => {
                            const isSelected = data.technologies?.includes(t.id);
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => toggleArrayItem('technologies', t.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all shadow-sm ${isSelected ? 'bg-accent-primary border-accent-primary text-white shadow-accent-primary/20' : 'bg-background-primary border-border-primary text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'}`}
                                >
                                    {t.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-text-primary">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {tagsList.map(t => {
                            const isSelected = data.tags?.includes(t.id);
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => toggleArrayItem('tags', t.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all shadow-sm ${isSelected ? 'bg-accent-primary border-accent-primary text-white shadow-accent-primary/20' : 'bg-background-primary border-border-primary text-text-secondary hover:border-accent-primary/50 hover:text-text-primary'}`}
                                >
                                    {t.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => navigate(`/developer/listings/${id}/basics`)}>
                    &larr; Back
                </Button>
                <Button onClick={handleNext} disabled={saving} className="px-8 shadow-md">
                    {saving ? 'Saving...' : 'Save & Continue'}
                </Button>
            </div>
        </div>
    );
}
