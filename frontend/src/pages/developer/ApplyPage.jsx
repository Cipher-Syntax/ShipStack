import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
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
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (application) {
        let statusConfig =
            {
                PENDING: {
                    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
                    icon: <Clock size={24} className="text-yellow-600" />,
                    title: "Application Pending",
                    desc: "Your application is currently under review by our team. We will notify you once a decision is made.",
                },
                APPROVED: {
                    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
                    icon: <CheckCircle size={24} className="text-green-600" />,
                    title: "Application Approved",
                    desc: "Congratulations! You are now a verified developer. You can start publishing software to ShipStack.",
                },
                REJECTED: {
                    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
                    icon: <AlertCircle size={24} className="text-red-600" />,
                    title: "Application Rejected",
                    desc: "Unfortunately, your application was not approved at this time.",
                },
            }[application.status] || {};

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
                <Card className="w-full max-w-lg text-center p-6 space-y-4">
                    <div className="flex justify-center mb-4">
                        {statusConfig.icon}
                    </div>
                    <CardTitle className="text-2xl">
                        {statusConfig.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400">
                        {statusConfig.desc}
                    </p>
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-semibold">
                                Status:
                            </span>
                            <Badge className={statusConfig.color}>
                                {application.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-semibold">
                                Submitted:
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(
                                    application.created_at,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate("/dashboard")}
                        className="mt-8 w-full"
                    >
                        Return to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>Developer Application</CardTitle>
                    <CardDescription>
                        Apply for verified developer status to publish software
                        on ShipStack.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                GitHub Profile URL *
                            </label>
                            <Input
                                type="url"
                                name="github_url"
                                required
                                value={formData.github_url}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Portfolio URL (Optional)
                            </label>
                            <Input
                                type="url"
                                name="portfolio_url"
                                value={formData.portfolio_url}
                                onChange={handleChange}
                                placeholder="https://yourwebsite.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Why do you want to publish on ShipStack? *
                            </label>
                            <textarea
                                name="statement"
                                required
                                rows={4}
                                value={formData.statement}
                                onChange={handleChange}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tell us about the software you plan to publish..."
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => navigate("/dashboard")}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting
                                ? "Submitting..."
                                : "Submit Application"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default ApplyPage;
