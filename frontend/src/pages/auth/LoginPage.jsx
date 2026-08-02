import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AlertCircle } from "lucide-react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                    "Failed to login. Please check your credentials.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-1/2 bg-accent-primary text-white p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <polygon
                            fill="currentColor"
                            points="0,100 100,0 100,100"
                        />
                    </svg>
                </div>

                <div className="relative z-10">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-3xl font-display font-bold"
                    >
                        <img
                            src="/shipstack_logo.jpg"
                            alt="ShipStack"
                            className="w-12 h-12 rounded-lg object-cover shadow-md"
                        />
                        ShipStack
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
                        Welcome back to your dashboard.
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl font-light">
                        Manage your software purchases, monitor your developer
                        storefront, and discover new tools.
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
                        <img
                            src="/shipstack_logo.jpg"
                            alt="ShipStack"
                            className="w-8 h-8 rounded object-cover shadow-sm"
                        />
                        ShipStack
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-text-primary font-display">
                            Sign In
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Enter your username and password to access your
                            account
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

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">
                                    Username
                                </label>
                                <Input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="johndoe"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-text-primary">
                                        Password
                                    </label>
                                    <Link
                                        to="/password-reset"
                                        className="text-sm text-accent-primary hover:text-accent-hover font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold transition-all"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-text-secondary pt-4">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-accent-primary hover:text-accent-hover transition-colors"
                        >
                            Sign up for free
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
