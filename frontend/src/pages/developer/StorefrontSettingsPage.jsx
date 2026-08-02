import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
    AlertCircle,
    CheckCircle,
    Upload,
    Save,
    User,
    Code,
    Hash,
    Briefcase,
    Globe,
    Store,
    Image as ImageIcon,
    Camera
} from "lucide-react";
import api from "../../utils/api";

const StorefrontSettingsPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        store_name: "",
        slug: "",
        biography: "",
        github_url: "",
        website_url: "",
        twitter_url: "",
        linkedin_url: "",
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/developers/profile/");
                if (res.data) {
                    setFormData({
                        store_name: res.data.store_name || "",
                        slug: res.data.slug || "",
                        biography: res.data.biography || "",
                        github_url: res.data.github_url || "",
                        website_url: res.data.website_url || "",
                        twitter_url: res.data.twitter_url || "",
                        linkedin_url: res.data.linkedin_url || "",
                    });
                    if (res.data.logo) setLogoPreview(res.data.logo);
                    if (res.data.banner) setBannerPreview(res.data.banner);
                }
            } catch (err) {
                // If profile doesn't exist yet, it's fine.
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === "logo") {
                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
            } else {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        if (logoFile) data.append("logo", logoFile);
        if (bannerFile) data.append("banner", bannerFile);

        try {
            await api.put("/api/developers/profile/", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess("Storefront profile updated successfully.");
            
            // Auto hide success after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                    err.response?.data?.slug?.[0] ||
                    "Failed to update profile.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user?.is_verified_developer) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 flex items-center gap-4">
                    <AlertCircle size={24} />
                    <div>
                        <h3 className="font-bold text-lg">Access Denied</h3>
                        <p>Only verified developers can manage a storefront.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (fetching)
        return (
            <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-text-secondary font-medium">Loading your storefront...</p>
            </div>
        );

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-1">
                        Storefront Settings
                    </h1>
                    <p className="text-text-secondary">
                        Design your public developer profile and establish your brand.
                    </p>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="h-11 px-6 font-bold shadow-md hover:shadow-lg transition-all"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Save size={18} /> Save Changes
                        </div>
                    )}
                </Button>
            </div>

            {error && (
                <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-xl flex items-center gap-3 border border-red-200 animate-in fade-in">
                    <AlertCircle size={20} className="shrink-0" />
                    <div className="font-medium text-sm">{error}</div>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 text-green-600 bg-green-50 rounded-xl flex items-center gap-3 border border-green-200 animate-in fade-in">
                    <CheckCircle size={20} className="shrink-0" />
                    <div className="font-medium text-sm">{success}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                {/* Visual Branding Section (Interactive Preview) */}
                <section className="bg-background-secondary rounded-2xl border border-border-primary shadow-sm overflow-hidden group/card relative">
                    {/* Banner Upload Area */}
                    <div 
                        className="w-full h-48 md:h-64 bg-background-primary border-b border-border-primary relative group/banner cursor-pointer overflow-hidden flex items-center justify-center"
                        onClick={() => bannerInputRef.current?.click()}
                    >
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700"></div>
                        )}
                        
                        <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-opacity duration-300 ${bannerPreview ? 'opacity-0 group-hover/banner:opacity-100' : 'opacity-100 group-hover/banner:bg-black/50'}`}>
                            <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full flex items-center gap-2 font-bold shadow-xl transform transition-transform group-hover/banner:scale-105">
                                <ImageIcon size={20} /> {bannerPreview ? "Update Cover Banner" : "Upload Cover Banner"}
                            </div>
                            {!bannerPreview && <p className="text-white/80 text-sm mt-3 font-medium">Recommended: 1200x400px (JPG/PNG)</p>}
                        </div>
                        <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, "banner")} className="hidden" accept="image/*" />
                    </div>

                    {/* Logo and Quick Info Area */}
                    <div className="px-6 md:px-10 pb-8 relative">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Logo Upload Area - Overlaps Banner */}
                            <div className="-mt-16 relative z-10 shrink-0">
                                <div 
                                    className="w-32 h-32 rounded-full border-4 border-background-secondary bg-background-primary shadow-xl overflow-hidden cursor-pointer group/logo relative flex items-center justify-center"
                                    onClick={() => logoInputRef.current?.click()}
                                >
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Store size={40} className="text-border-secondary" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="text-white" size={28} />
                                    </div>
                                </div>
                                <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, "logo")} className="hidden" accept="image/*" />
                            </div>

                            {/* Name & Slug Next to Logo */}
                            <div className="mt-2 md:mt-4 flex-1 w-full space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-primary uppercase tracking-wide">Store Name</label>
                                        <Input
                                            name="store_name"
                                            value={formData.store_name}
                                            onChange={handleChange}
                                            placeholder="Cipher Syntax Labs"
                                            required
                                            className="h-11 bg-background-primary border-border-primary font-medium text-lg placeholder:font-normal focus:border-accent-primary"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-text-primary uppercase tracking-wide">URL Slug</label>
                                        <div className="flex rounded-md overflow-hidden border border-border-primary focus-within:border-accent-primary focus-within:ring-1 focus-within:ring-accent-primary transition-all h-11">
                                            <span className="bg-background-tertiary px-3 flex items-center text-text-secondary text-sm font-medium border-r border-border-primary">
                                                shipstack.com/store/
                                            </span>
                                            <input
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                placeholder="cipher-syntax"
                                                required
                                                className="flex-1 bg-background-primary px-3 text-sm focus:outline-none font-medium h-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Biography */}
                    <section className="lg:col-span-2 bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-accent-primary">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-display font-bold text-text-primary">
                                About the Creator
                            </h2>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-text-primary uppercase tracking-wide">
                                Store Biography
                            </label>
                            <p className="text-sm text-text-secondary mb-2">
                                Write a compelling description of your team, your expertise, and the kind of software you build. This is your chance to build trust with potential buyers.
                            </p>
                            <textarea
                                name="biography"
                                value={formData.biography}
                                onChange={handleChange}
                                placeholder="We specialize in enterprise-grade React and Django applications..."
                                className="w-full min-h-[200px] rounded-xl border border-border-primary bg-background-primary p-4 text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring resize-y leading-relaxed"
                            />
                        </div>
                    </section>

                    {/* Right Column: Links */}
                    <section className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Globe size={20} />
                            </div>
                            <h2 className="text-xl font-display font-bold text-text-primary">
                                Social Links
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                                    <Globe size={14} className="text-text-tertiary"/> Website URL
                                </label>
                                <Input
                                    name="website_url"
                                    type="url"
                                    value={formData.website_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="bg-background-primary h-11"
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                                    <Code size={14} className="text-text-tertiary"/> GitHub URL
                                </label>
                                <Input
                                    name="github_url"
                                    type="url"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                    className="bg-background-primary h-11"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                                    <Briefcase size={14} className="text-text-tertiary"/> LinkedIn URL
                                </label>
                                <Input
                                    name="linkedin_url"
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                    className="bg-background-primary h-11"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-text-primary uppercase tracking-wide flex items-center gap-2">
                                    <Hash size={14} className="text-text-tertiary"/> Twitter / X URL
                                </label>
                                <Input
                                    name="twitter_url"
                                    type="url"
                                    value={formData.twitter_url}
                                    onChange={handleChange}
                                    placeholder="https://twitter.com/..."
                                    className="bg-background-primary h-11"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
};

export default StorefrontSettingsPage;
