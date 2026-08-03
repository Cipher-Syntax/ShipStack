import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, uploadMedia, uploadPackage } from '../../../services/listingService';
import { useToast } from '../../../contexts/ToastContext';
import { Button } from '../../../components/ui/Button';
import { Image as ImageIcon, Box, UploadCloud } from 'lucide-react';

export default function ListingMediaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [media, setMedia] = useState([]);
    const [packages, setPackages] = useState([]);
    const { addToast } = useToast();
    
    const fetchListing = async () => {
        try {
            const data = await getListing(id);
            if (data.media) setMedia(data.media);
            if (data.packages) setPackages(data.packages);
        } catch (error) {
            console.error("Failed to load listing media", error);
        }
    };

    useEffect(() => {
        fetchListing();
    }, [id]);

    const handleMediaUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('media_type', type);
        
        try {
            await uploadMedia(id, formData);
            addToast(`${type === 'COVER' ? 'Cover Image' : 'Screenshot'} uploaded successfully!`, 'success');
            fetchListing();
            e.target.value = ''; // Reset input
        } catch (error) {
            addToast('Media upload failed.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handlePackageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            await uploadPackage(id, formData);
            addToast(`Package uploaded successfully! Malware scanning started.`, 'success');
            fetchListing();
            e.target.value = ''; // Reset input
        } catch (error) {
            addToast('Package upload failed.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleNext = () => {
        navigate(`/developer/listings/${id}/preview`);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">3. Media & Files</h1>
                <p className="text-text-secondary text-lg mt-2">Upload your visual assets and the downloadable package.</p>
            </div>

            <div className="grid gap-6">
                {/* Images */}
                <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm flex items-start gap-6">
                    <div className="w-16 h-16 shrink-0 rounded-xl bg-surface-secondary border border-border-primary flex items-center justify-center">
                        <ImageIcon size={28} className="text-text-tertiary" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-text-primary">Cover Image</h3>
                            <p className="text-sm text-text-secondary">Used as the main thumbnail in the marketplace.</p>
                        </div>
                        {media.filter(m => m.media_type === 'COVER').length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {media.filter(m => m.media_type === 'COVER').map(m => (
                                    <div key={m.id} className="relative w-32 h-20 rounded overflow-hidden border border-border-primary">
                                        <img src={m.file} alt="Cover" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <input type="file" onChange={e => handleMediaUpload(e, 'COVER')} disabled={uploading} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-surface-secondary file:text-text-primary file:border file:border-border-primary hover:file:bg-surface-hover file:cursor-pointer"/>
                        
                        <div className="h-px bg-border-primary my-6"></div>

                        <div>
                            <h3 className="text-xl font-bold text-text-primary">Screenshots</h3>
                            <p className="text-sm text-text-secondary">Upload multiple screenshots to show off features.</p>
                        </div>
                        {media.filter(m => m.media_type === 'SCREENSHOT').length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {media.filter(m => m.media_type === 'SCREENSHOT').map(m => (
                                    <div key={m.id} className="relative w-24 h-16 rounded overflow-hidden border border-border-primary">
                                        <img src={m.file} alt="Screenshot" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <input type="file" onChange={e => handleMediaUpload(e, 'SCREENSHOT')} disabled={uploading} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-surface-secondary file:text-text-primary file:border file:border-border-primary hover:file:bg-surface-hover file:cursor-pointer"/>
                    </div>
                </div>

                {/* Package */}
                <div className="bg-accent-primary/5 p-8 rounded-2xl border border-accent-primary/20 shadow-sm flex items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Box size={120} />
                    </div>
                    <div className="w-16 h-16 shrink-0 rounded-xl bg-accent-primary text-white shadow-lg shadow-accent-primary/20 flex items-center justify-center relative z-10">
                        <UploadCloud size={28} />
                    </div>
                    <div className="flex-1 space-y-4 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-accent-primary">Software Package (.zip)</h3>
                            <p className="text-sm text-text-secondary">Upload the actual codebase or binary. This file will be automatically scanned for malware upon upload.</p>
                            <p className="text-xs text-text-tertiary mt-2 bg-accent-primary/10 p-3 rounded-lg border border-accent-primary/20 text-accent-primary font-medium">
                                <b>Security Bypass:</b> To ensure fast & free global delivery, your uploaded .zip files are securely converted to .txt format in our storage layer to bypass strict CDN file delivery blocks. They are automatically restored to .zip files when buyers download them!
                            </p>
                        </div>
                        {packages.length > 0 && (
                            <div className="bg-background-primary rounded-lg border border-border-primary p-3 space-y-2">
                                {packages.map(p => (
                                    <div key={p.id} className="flex items-center justify-between text-sm">
                                        <span className="font-mono text-text-secondary truncate pr-4">{p.file.split('/').pop().replace(/\.txt$/i, '.zip')}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            p.scan_status === 'PASSED' ? 'bg-green-500/10 text-green-500' :
                                            p.scan_status === 'FAILED' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                            {p.scan_status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input type="file" accept=".zip,.tar.gz" onChange={handlePackageUpload} disabled={uploading} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-accent-primary file:text-white hover:file:bg-accent-hover file:cursor-pointer shadow-sm"/>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => navigate(`/developer/listings/${id}/details`)}>
                    &larr; Back
                </Button>
                <Button onClick={handleNext} disabled={uploading} className="px-8 shadow-md">
                    Continue to Preview
                </Button>
            </div>
        </div>
    );
}
