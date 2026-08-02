import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AlertCircle, Mail } from "lucide-react";

const VerifyEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await verifyEmail(email, otp);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.error || "Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-1/2 bg-accent-primary text-white p-12 flex-col justify-between relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 150%, currentColor 0%, transparent 50%)",
                    }}
                ></div>

                <div className="relative z-10">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-3xl font-display font-bold"
                    >
                        <img src="/shipstack_logo.jpg" alt="ShipStack" className="w-12 h-12 rounded-lg object-cover shadow-md" />
                        ShipStack
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                        <Mail size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
                        Secure your account.
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl font-light">
                        We use email verification to ensure our marketplace
                        remains safe and trusted for all users.
                    </p>
                </div>

                <div className="relative z-10 text-blue-200 text-sm">
                    © {new Date().getFullYear()} ShipStack Inc. All rights
                    reserved.
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background-primary dark:bg-gray-900">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-2 text-2xl font-display font-bold text-accent-primary mb-8">
                        <img src="/shipstack_logo.jpg" alt="ShipStack" className="w-8 h-8 rounded object-cover shadow-sm" />
                        ShipStack
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-text-primary font-display">
                            Check your inbox
                        </h2>
                        <p className="text-text-secondary text-sm">
                            We've sent a 6-digit verification code to{" "}
                            <span className="font-semibold text-text-primary">
                                {email || "your email"}
                            </span>
                            . It expires in 5 minutes.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {error && (
                            <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg flex items-start gap-3 border border-red-200 dark:border-red-800/30">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 flex-shrink-0"
                                />
                                <div>{error}</div>
                            </div>
                        )}

                        {!location.state?.email && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="h-12"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-primary">
                                Verification Code
                            </label>
                            <Input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="• • • • • •"
                                className="h-16 text-center text-3xl tracking-[0.5em] font-mono font-bold"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold transition-all"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
