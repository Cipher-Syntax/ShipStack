import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { AlertCircle } from "lucide-react";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirm_password) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            await register(formData);
            navigate("/verify-email", { state: { email: formData.email } });
        } catch (err) {
            if (err.response?.data) {
                const errorMsg = Object.values(err.response.data).flat()[0];
                setError(errorMsg || "Failed to register.");
            } else {
                setError("Network error. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex w-1/2 bg-accent-primary text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="w-full h-full"
                    >
                        <circle cx="100" cy="100" r="80" fill="currentColor" />
                        <circle
                            cx="100"
                            cy="100"
                            r="60"
                            fill="var(--background-primary)"
                            opacity="0.2"
                        />
                    </svg>
                </div>

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
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
                        Start shipping faster.
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl font-light">
                        Create an account to purchase high-quality software or
                        apply as a developer to monetize your tools.
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
                            Create an account
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Join the developer platform of the future.
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
                                    name="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="johndoe"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="h-12"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">
                                        Password
                                    </label>
                                    <Input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary">
                                        Confirm
                                    </label>
                                    <Input
                                        type="password"
                                        name="confirm_password"
                                        required
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold transition-all"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-text-secondary pt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-accent-primary hover:text-accent-hover transition-colors"
                        >
                            Log in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
