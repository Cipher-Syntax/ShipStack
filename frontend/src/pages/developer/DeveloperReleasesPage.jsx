import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { releaseService } from '../../services/releaseService';
import { getListing } from '../../services/listingService';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../contexts/ToastContext';
import { ArrowLeft, Package, Plus, Clock, CheckCircle, Tag } from 'lucide-react';

export default function DeveloperReleasesPage() {
    const { id } = useParams(); // listing id
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    const [listing, setListing] = useState(null);
    const [releases, setReleases] = useState([]);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const [newRelease, setNewRelease] = useState({ version_number: '', changelog: '', package: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [listingData, releaseData] = await Promise.all([
                getListing(id),
                releaseService.getDeveloperReleases(id)
            ]);
            setListing(listingData);
            setReleases(releaseData);
            setPackages(listingData.packages || []);
        } catch (error) {
            console.error(error);
            addToast("Failed to load releases.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRelease = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                listing_id: id,
                version_number: newRelease.version_number,
                changelog: newRelease.changelog,
                package: newRelease.package || null
            };
            await releaseService.createRelease(payload);
            addToast("Release created successfully.", "success");
            setIsCreateModalOpen(false);
            setNewRelease({ version_number: '', changelog: '', package: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.error || "Failed to create release.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePublish = async (releaseId) => {
        try {
            await releaseService.publishRelease(releaseId);
            addToast("Release published successfully.", "success");
            fetchData();
        } catch (error) {
            console.error(error);
            addToast(error.response?.data?.error || "Failed to publish release.", "error");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <Button variant="ghost" onClick={() => navigate('/developer/listings')} className="mb-4 -ml-4 flex items-center gap-2 text-text-secondary">
                <ArrowLeft size={16} /> Back to Listings
            </Button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-primary">Manage Releases</h1>
                    <p className="text-text-secondary">Publish new versions for <span className="font-semibold">{listing?.title}</span></p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 shadow-sm">
                    <Plus size={16} /> New Release
                </Button>
            </div>

            <div className="space-y-6">
                {releases.length === 0 ? (
                    <div className="text-center py-16 bg-surface-secondary border border-border-primary border-dashed rounded-xl">
                        <Package size={48} className="mx-auto text-text-tertiary mb-4" />
                        <h3 className="text-xl font-bold text-text-primary">No releases yet</h3>
                        <p className="text-text-secondary max-w-sm mx-auto mt-2 mb-6">Create a release to publish updates and changelogs to your buyers.</p>
                        <Button onClick={() => setIsCreateModalOpen(true)}>Create First Release</Button>
                    </div>
                ) : (
                    <div className="border-l-2 border-border-primary/50 ml-4 pl-6 space-y-8 relative">
                        {releases.map((release, index) => (
                            <div key={release.id} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-4 border-background-primary shadow-sm ${release.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                
                                <div className="bg-background-secondary border border-border-primary rounded-xl overflow-hidden hover:border-accent-primary/40 transition-colors shadow-sm">
                                    {/* Card Header */}
                                    <div className="px-5 py-4 border-b border-border-primary bg-surface-secondary flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                                <Tag size={16} className="text-accent-primary" /> 
                                                v{release.version_number}
                                            </h3>
                                            {release.is_published ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        
                                        {!release.is_published && (
                                            <Button variant="primary" className="h-8 px-4 text-xs font-bold" onClick={() => handlePublish(release.id)}>
                                                Publish Now
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {/* Card Body */}
                                    <div className="p-5">
                                        <div className="mb-4">
                                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Changelog</h4>
                                            <div className="text-sm text-text-secondary whitespace-pre-wrap font-mono bg-background-primary p-4 rounded-lg border border-border-primary/50">
                                                {release.changelog || "No changelog provided."}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Attached Package:</h4>
                                            {release.package ? (
                                                <span 
                                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-accent-primary/10 text-accent-primary text-xs font-semibold border border-accent-primary/20"
                                                    title={packages.find(p => p.id === release.package)?.file.split('/').pop() || "Package Attached"}
                                                >
                                                    <Package size={12} /> {packages.find(p => p.id === release.package)?.file.split('/').pop() || "Package Attached"}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-text-tertiary italic">None</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <h3 className="text-2xl font-bold text-text-primary mb-6">Create New Release</h3>
                <form onSubmit={handleCreateRelease} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Version Number (e.g. 1.0.0)</label>
                        <Input 
                            value={newRelease.version_number} 
                            onChange={e => setNewRelease({...newRelease, version_number: e.target.value})} 
                            required 
                            placeholder="v1.0.0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Changelog (Markdown supported)</label>
                        <textarea 
                            value={newRelease.changelog} 
                            onChange={e => setNewRelease({...newRelease, changelog: e.target.value})} 
                            className="w-full h-32 px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all"
                            placeholder="- Added new feature X..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Software Package</label>
                        <select 
                            value={newRelease.package} 
                            onChange={e => setNewRelease({...newRelease, package: e.target.value})}
                            className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                            <option value="">-- Select an uploaded package --</option>
                            {packages.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.file.split('/').pop()} ({p.scan_status})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-text-tertiary mt-1">If you haven't uploaded a package yet, upload it in the Listing Editor first.</p>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
                        <Button variant="ghost" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Draft Release'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
