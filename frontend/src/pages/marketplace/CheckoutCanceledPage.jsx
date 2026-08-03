import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { XCircle } from 'lucide-react';

const CheckoutCanceledPage = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background-primary px-4">
            <div className="max-w-md w-full bg-surface-primary border border-border-primary rounded-2xl p-8 text-center shadow-sm">
                <XCircle size={64} className="text-error mx-auto mb-6" />
                <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Payment Canceled</h1>
                <p className="text-text-secondary mb-8">
                    Your checkout process was canceled. No charges were made to your account.
                </p>
                
                <div className="flex flex-col gap-3">
                    <Link to="/">
                        <Button variant="primary" className="w-full">Return to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCanceledPage;
