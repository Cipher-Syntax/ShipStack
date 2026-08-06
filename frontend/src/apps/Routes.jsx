import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import PasswordResetRequestPage from "../pages/auth/PasswordResetRequestPage";
import PasswordResetConfirmPage from "../pages/auth/PasswordResetConfirmPage";
import ApplyPage from "../pages/developer/ApplyPage";
import StorefrontSettingsPage from "../pages/developer/StorefrontSettingsPage";
import StorefrontPage from "../pages/storefront/StorefrontPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MessagingPage from "../pages/dashboard/MessagingPage";
import NotificationCenterPage from "../pages/dashboard/NotificationCenterPage";
import MyListingsPage from "../pages/developer/MyListingsPage";
import DeveloperReleasesPage from "../pages/developer/DeveloperReleasesPage";
import EditorLayout from "../layouts/EditorLayout";
import ListingBasicsPage from "../pages/developer/editor/ListingBasicsPage";
import ListingDetailsPage from "../pages/developer/editor/ListingDetailsPage";
import ListingMediaPage from "../pages/developer/editor/ListingMediaPage";
import ListingPreviewPage from "../pages/developer/editor/ListingPreviewPage";

import HomePage from "../pages/marketplace/HomePage";
import BrowsePage from "../pages/marketplace/BrowsePage";
import ListingDetailPage from "../pages/marketplace/ListingDetailPage";
import CheckoutSuccessPage from "../pages/marketplace/CheckoutSuccessPage";
import CheckoutCanceledPage from "../pages/marketplace/CheckoutCanceledPage";

import RequestsBrowsePage from "../pages/requests/RequestsBrowsePage";
import CreateRequestPage from "../pages/requests/CreateRequestPage";
import RequestDetailPage from "../pages/requests/RequestDetailPage";

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

// Routes configuration

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/listings/:slug" element={<ListingDetailPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/canceled" element={<CheckoutCanceledPage />} />
            
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
                path="/developer/storefront-settings"
                element={
                    <ProtectedRoute>
                        <StorefrontSettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/developer/listings"
                element={
                    <ProtectedRoute>
                        <MyListingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/developer/listings/:id/releases"
                element={
                    <ProtectedRoute>
                        <DeveloperReleasesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/developer/listings/:id"
                element={
                    <ProtectedRoute>
                        <EditorLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="basics" element={<ListingBasicsPage />} />
                <Route path="details" element={<ListingDetailsPage />} />
                <Route path="media" element={<ListingMediaPage />} />
                <Route path="preview" element={<ListingPreviewPage />} />
            </Route>
            <Route path="/store/:slug" element={<StorefrontPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <MessagingPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/notifications"
                element={
                    <ProtectedRoute>
                        <NotificationCenterPage />
                    </ProtectedRoute>
                }
            />

            <Route path="/requests" element={<RequestsBrowsePage />} />
            <Route
                path="/requests/new"
                element={
                    <ProtectedRoute>
                        <CreateRequestPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/requests/:id" element={<RequestDetailPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
