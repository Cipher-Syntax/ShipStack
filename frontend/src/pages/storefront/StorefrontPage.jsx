import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Code,
    Hash,
    Briefcase,
    Globe,
    MapPin,
    Package,
    Star,
    Clock,
    CheckCircle,
} from "lucide-react";
import api from "../../utils/api";

const StorefrontPage = () => {
    const { slug } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/api/developers/store/${slug}/`);
                setProfile(res.data);
            } catch (err) {
                setError("Storefront not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [slug]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    if (error || !profile)
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <Package size={64} className="text-text-tertiary" />
                <h1 className="text-3xl font-display font-bold text-text-primary">
                    Storefront Not Found
                </h1>
                <p className="text-text-secondary">
                    The developer you are looking for does not exist.
                </p>
                <Link
                    to="/"
                    className="text-accent-primary hover:underline mt-4"
                >
                    Return Home
                </Link>
            </div>
        );

    return (
        <div className="min-h-screen bg-background-primary font-sans pb-24">
            {/* Banner Section */}
            <div className="w-full h-64 md:h-80 bg-background-secondary relative overflow-hidden group">
                {profile.banner ? (
                    <img
                        src={profile.banner}
                        alt={`${profile.store_name} Banner`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-accent-primary to-accent-hover opacity-80 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Profile Header */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                    {/* Logo (Overlapping Banner) */}
                    <div className="-mt-16 md:-mt-20 w-32 h-32 md:w-40 md:h-40 rounded-full bg-background-primary p-1.5 shadow-xl ring-1 ring-border-primary z-10 shrink-0">
                        {profile.logo ? (
                            <img
                                src={profile.logo}
                                alt={profile.store_name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                                <Package size={48} />
                            </div>
                        )}
                    </div>

                    {/* Store Info (Below Banner) */}
                    <div className="flex-1 text-text-primary z-10 pt-4 md:pt-6 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-display font-bold">
                                {profile.store_name}
                            </h1>
                            <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/20 flex items-center gap-1 w-fit">
                                <CheckCircle size={14} /> Verified Developer
                            </div>
                        </div>

                        {/* Links Row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary pt-1">
                            {profile.website_url && (
                                <a
                                    href={profile.website_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 hover:text-accent-primary transition-colors"
                                >
                                    <Globe size={16} /> Website
                                </a>
                            )}
                            {profile.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 hover:text-accent-primary transition-colors"
                                >
                                    <Code size={16} /> GitHub
                                </a>
                            )}
                            {profile.twitter_url && (
                                <a
                                    href={profile.twitter_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"
                                >
                                    <Hash size={16} /> Twitter
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                                >
                                    <Briefcase size={16} /> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Biography & Stats */}
                <div className="lg:col-span-1 space-y-8">
                    {profile.biography && (
                        <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-bold font-display text-text-primary mb-4 flex items-center gap-2">
                                About {profile.store_name}
                            </h2>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {profile.biography}
                            </p>
                        </div>
                    )}

                    <div className="bg-background-secondary p-6 rounded-2xl border border-border-primary shadow-sm">
                        <h2 className="text-lg font-bold font-display text-text-primary mb-4">
                            Developer Stats
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-tertiary flex items-center gap-2">
                                    <Package size={16} /> Products
                                </span>
                                <span className="font-semibold text-text-primary">
                                    0 published
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-tertiary flex items-center gap-2">
                                    <Star size={16} /> Rating
                                </span>
                                <span className="font-semibold text-text-primary flex items-center gap-1">
                                    <Star
                                        size={14}
                                        className="fill-yellow-400 text-yellow-400"
                                    />{" "}
                                    New
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-tertiary flex items-center gap-2">
                                    <Clock size={16} /> Joined
                                </span>
                                <span className="font-semibold text-text-primary">
                                    2026
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Featured Software (Placeholder) */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                            Featured Software
                        </h2>

                        <div className="w-full rounded-2xl border border-dashed border-border-primary p-12 flex flex-col items-center justify-center text-center bg-background-secondary/50 group">
                            <div className="w-20 h-20 bg-background-primary rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Package
                                    size={32}
                                    className="text-accent-primary opacity-80"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-text-primary mb-2">
                                No Software Published Yet
                            </h3>
                            <p className="text-text-secondary max-w-md">
                                {profile.store_name} hasn't published any
                                software to the marketplace yet. Check back
                                later for high-quality production-ready tools!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorefrontPage;
