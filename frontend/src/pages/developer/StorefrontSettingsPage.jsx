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
            <div className="p-8 text-center text-text-tertiary">
                Loading profile...
            </div>
        );

    return (
        <div className="p-8 max-w-5xl mx-auto font-sans">
            <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
                    Storefront Settings
                </h1>
                <p className="text-text-secondary">
                    Design your public developer profile to showcase your
                    software and brand.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-lg flex items-center gap-3 border border-red-200">
                    <AlertCircle size={20} />
                    <div>{error}</div>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 text-green-600 bg-green-50 rounded-lg flex items-center gap-3 border border-green-200">
                    <CheckCircle size={20} />
                    <div>{success}</div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Visuals Section */}
                <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm space-y-8">
                    <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                        <Store size={24} className="text-accent-primary" />{" "}
                        Store Branding
                    </h2>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-text-primary">
                            Store Banner
                        </label>
                        <div
                            className="w-full h-48 rounded-xl border-2 border-dashed border-border-primary flex flex-col items-center justify-center relative overflow-hidden bg-background-primary hover:bg-background-secondary transition-colors cursor-pointer group"
                            onClick={() => bannerInputRef.current?.click()}
                        >
                            {bannerPreview ? (
                                <>
                                    <img
                                        src={bannerPreview}
                                        alt="Banner Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-white flex items-center gap-2 font-medium">
                                            <Upload size={20} /> Change Banner
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-text-tertiary flex flex-col items-center gap-2">
                                    <Upload size={32} />
                                    <span className="font-medium text-sm">
                                        Click to upload banner (1200x400
                                        recommended)
                                    </span>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={bannerInputRef}
                                onChange={(e) => handleFileChange(e, "banner")}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-text-primary">
                            Store Logo
                        </label>
                        <div className="flex items-center gap-6">
                            <div
                                className="w-24 h-24 rounded-full border-2 border-dashed border-border-primary flex items-center justify-center relative overflow-hidden bg-background-primary cursor-pointer group shrink-0"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {logoPreview ? (
                                    <>
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Upload
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <User
                                        size={32}
                                        className="text-text-tertiary"
                                    />
                                )}
                                <input
                                    type="file"
                                    ref={logoInputRef}
                                    onChange={(e) =>
                                        handleFileChange(e, "logo")
                                    }
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div className="text-sm text-text-secondary">
                                Recommended size: 256x256 pixels.
                                <br />
                                This logo will be displayed on your storefront
                                and software listings.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm space-y-6">
                    <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                        <User size={24} className="text-accent-primary" /> Basic
                        Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary">
                                Store Name
                            </label>
                            <Input
                                name="store_name"
                                value={formData.store_name}
                                onChange={handleChange}
                                placeholder="e.g. Cipher Syntax Labs"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary">
                                Store URL Slug
                            </label>
                            <div className="flex items-center">
                                <span className="bg-border-primary px-3 h-10 flex items-center rounded-l-md text-text-secondary text-sm border border-r-0 border-border-primary shrink-0">
                                    shipstack.com/store/
                                </span>
                                <Input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="cipher-syntax"
                                    required
                                    className="rounded-l-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">
                            Biography / About
                        </label>
                        <textarea
                            name="biography"
                            value={formData.biography}
                            onChange={handleChange}
                            placeholder="Tell buyers about your team and expertise..."
                            className="w-full min-h-[120px] rounded-md border border-border-primary bg-background-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring"
                        />
                    </div>
                </div>

                {/* Links Section */}
                <div className="bg-background-secondary p-8 rounded-2xl border border-border-primary shadow-sm space-y-6">
                    <h2 className="text-2xl font-bold font-display text-text-primary flex items-center gap-2">
                        <Globe size={24} className="text-accent-primary" />{" "}
                        External Links
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <Globe size={16} /> Website
                            </label>
                            <Input
                                name="website_url"
                                type="url"
                                value={formData.website_url}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <Code size={16} /> GitHub
                            </label>
                            <Input
                                name="github_url"
                                type="url"
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <Hash size={16} /> Twitter
                            </label>
                            <Input
                                name="twitter_url"
                                type="url"
                                value={formData.twitter_url}
                                onChange={handleChange}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                                <Briefcase size={16} /> LinkedIn
                            </label>
                            <Input
                                name="linkedin_url"
                                type="url"
                                value={formData.linkedin_url}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-8 flex items-center gap-2 text-lg h-12 shadow-md"
                    >
                        <Save size={20} />
                        {loading ? "Saving..." : "Save Storefront Settings"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StorefrontSettingsPage;
