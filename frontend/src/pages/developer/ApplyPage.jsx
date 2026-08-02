import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AlertCircle, CheckCircle, Clock, ChevronLeft, Sparkles, Rocket, ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ApplyPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        github_url: "",
        portfolio_url: "",
        statement: "",
    });

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const res = await api.get("/api/accounts/verification/");
                setApplication(res.data);
            } catch (err) {
                // 404 means no application exists yet, which is fine
                if (err.response?.status !== 404) {
                    console.error("Failed to fetch application status", err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const res = await api.post("/api/accounts/verification/", formData);
            setApplication(res.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                    "Failed to submit application. Please check your inputs.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-primary">
                <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (application) {
        let statusConfig =
            {
                PENDING: {
                    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
                    badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    icon: <Clock size={48} className="text-yellow-500 mb-4" />,
                    title: "Application Pending",
                    desc: "Your application is currently under review by our team. We will notify you once a decision is made. This usually takes 1-2 business days.",
                },
                APPROVED: {
                    color: "bg-green-50 text-green-700 border-green-200",
                    badge: "bg-green-100 text-green-800 border-green-300",
                    icon: <CheckCircle size={48} className="text-green-500 mb-4" />,
                    title: "Application Approved",
                    desc: "Congratulations! You are now a verified developer. You can start building your storefront and publishing software.",
                },
                REJECTED: {
                    color: "bg-red-50 text-red-700 border-red-200",
                    badge: "bg-red-100 text-red-800 border-red-300",
                    icon: <AlertCircle size={48} className="text-red-500 mb-4" />,
                    title: "Application Rejected",
                    desc: "Unfortunately, your application was not approved at this time. Please ensure your GitHub profile is public and demonstrates production-ready software.",
                },
            }[application.status] || {};

        return (
            <div className="min-h-screen bg-background-primary p-8 flex items-center justify-center font-sans">
                <div className={`w-full max-w-xl text-center p-12 space-y-6 rounded-2xl border shadow-xl ${statusConfig.color}`}>
                    <div className="flex justify-center">
                        {statusConfig.icon}
                    </div>
                    <h1 className="text-3xl font-display font-bold">
                        {statusConfig.title}
                    </h1>
                    <p className="text-lg opacity-90 leading-relaxed">
                        {statusConfig.desc}
                    </p>
                    <div className="mt-8 p-6 bg-white/60 rounded-xl text-left space-y-4 shadow-sm backdrop-blur-sm border border-white/40">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold uppercase tracking-wider opacity-70">
                                Status
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.badge}`}>
                                {application.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold uppercase tracking-wider opacity-70">
                                Submitted On
                            </span>
                            <span className="text-sm font-semibold opacity-80">
                                {new Date(application.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button
                            onClick={() => navigate("/dashboard")}
                            className="w-full h-12 text-lg font-bold shadow-md"
                        >
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex font-sans bg-background-primary">
            {/* Left Side: Information & Branding */}
            <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-accent-primary to-accent-hover text-white flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                
                <div className="relative z-10">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-12 font-medium">
                        <ChevronLeft size={20} /> Back to Dashboard
                    </Link>
                    
                    <h1 className="text-5xl font-display font-bold leading-tight mb-6">
                        Become a <br/><span className="text-blue-200">Verified Creator</span>
                    </h1>
                    <p className="text-lg text-blue-50 leading-relaxed max-w-md">
                        Join an exclusive marketplace of top-tier developers. Monetize your production-ready software systems directly to buyers who value quality.
                    </p>
                </div>

                <div className="relative z-10 space-y-8 mt-12">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/30">
                            <Rocket className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-1">Reach New Audiences</h3>
                            <p className="text-blue-100 text-sm">Sell directly to businesses and buyers looking for complete, tested systems.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/30">
                            <Sparkles className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-1">Premium Storefront</h3>
                            <p className="text-blue-100 text-sm">Design your own beautiful storefront to showcase your brand and portfolio.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/30">
                            <ShieldCheck className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-1">Trusted Ecosystem</h3>
                            <p className="text-blue-100 text-sm">Our manual verification ensures you're selling alongside other highly skilled professionals.</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-12 pt-8 border-t border-white/20 text-sm text-blue-200">
                    &copy; 2026 ShipStack. Curated Software Marketplace.
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-7/12 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 overflow-y-auto">
                
                <div className="max-w-md w-full mx-auto">
                    <div className="lg:hidden mb-12">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors font-medium">
                            <ChevronLeft size={20} /> Back
                        </Link>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-display font-bold text-text-primary mb-3">Creator Application</h2>
                        <p className="text-text-secondary">
                            We manually review every developer to ensure the highest quality of software on ShipStack.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 text-red-600 bg-red-50 rounded-xl flex items-center gap-3 border border-red-200">
                                <AlertCircle size={20} className="shrink-0" />
                                <div className="text-sm font-medium">{error}</div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary uppercase tracking-wide">
                                GitHub Profile URL <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="url"
                                name="github_url"
                                required
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                className="h-12 bg-background-secondary border-border-primary focus:border-accent-primary"
                            />
                            <p className="text-xs text-text-tertiary">Used to verify your technical experience and contributions.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary uppercase tracking-wide">
                                Portfolio or LinkedIn (Optional)
                            </label>
                            <Input
                                type="url"
                                name="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="h-12 bg-background-secondary border-border-primary focus:border-accent-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-primary uppercase tracking-wide">
                                Why do you want to publish on ShipStack? <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="statement"
                                required
                                rows={5}
                                value={formData.statement}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-border-primary bg-background-secondary px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring resize-none"
                                placeholder="Tell us about the kinds of production-ready software you plan to sell..."
                            />
                        </div>

                        <div className="pt-6">
                            <Button type="submit" disabled={submitting} className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2">
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyPage;
