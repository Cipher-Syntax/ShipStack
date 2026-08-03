import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccessPage = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background-primary px-4">
            <div className="max-w-md w-full bg-surface-primary border border-border-primary rounded-2xl p-8 text-center shadow-sm">
                <CheckCircle size={64} className="text-success mx-auto mb-6" />
                <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Payment Successful!</h1>
                <p className="text-text-secondary mb-8">
                    Thank you for your purchase. The software has been added to your account and is ready to download.
                </p>
                
                <div className="flex flex-col gap-3">
                    {/* Will link to Dashboard / Downloads in later units */}
                    <Link to="/">
                        <Button variant="primary" className="w-full">Return to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccessPage;
