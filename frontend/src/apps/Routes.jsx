import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import PasswordResetRequestPage from "../pages/auth/PasswordResetRequestPage";
import PasswordResetConfirmPage from "../pages/auth/PasswordResetConfirmPage";
import ApplyPage from "../pages/developer/ApplyPage";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Temp dashboard component for testing
const Dashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
                Welcome, {user?.username}
            </h1>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={logout}
            >
                Logout
            </button>

            {!user?.is_verified_developer && (
                <div className="mt-4">
                    <a
                        href="/developer/apply"
                        className="text-blue-600 hover:underline"
                    >
                        Apply as a Developer
                    </a>
                </div>
            )}
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <AuthRoute>
                        <LoginPage />
                    </AuthRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <AuthRoute>
                        <RegisterPage />
                    </AuthRoute>
                }
            />
            <Route
                path="/verify-email"
                element={
                    <AuthRoute>
                        <VerifyEmailPage />
                    </AuthRoute>
                }
            />
            <Route
                path="/password-reset"
                element={
                    <AuthRoute>
                        <PasswordResetRequestPage />
                    </AuthRoute>
                }
            />
            <Route
                path="/password-reset/confirm"
                element={
                    <AuthRoute>
                        <PasswordResetConfirmPage />
                    </AuthRoute>
                }
            />

            <Route
                path="/developer/apply"
                element={
                    <ProtectedRoute>
                        <ApplyPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;
