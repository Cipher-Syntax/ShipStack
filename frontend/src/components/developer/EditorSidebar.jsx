import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EditorSidebar() {
    const { id } = useParams();
    const navigate = useNavigate();

    const steps = [
        { path: 'basics', label: '1. Basics', desc: 'Title & Category' },
        { path: 'details', label: '2. Details', desc: 'Description, Price, Tech' },
        { path: 'media', label: '3. Media & Files', desc: 'Images & Package' },
        { path: 'preview', label: '4. Preview & Publish', desc: 'Review & Submit' }
    ];

    return (
        <div className="w-80 border-r border-border-primary bg-background-secondary p-6 flex flex-col h-full shadow-sm">
            <div className="mb-10">
                <button 
                    onClick={() => navigate('/developer/listings')}
                    className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 mb-6"
                >
                    <ArrowLeft size={16} /> Save & Exit
                </button>
                <div className="flex items-center gap-3">
                    <img src="/shipstack_logo.jpg" alt="Logo" className="w-8 h-8 rounded shadow-sm" />
                    <h2 className="text-xl font-display font-bold tracking-tight text-text-primary">Listing Editor</h2>
                </div>
            </div>
            
            <nav className="flex flex-col gap-3 flex-1 relative">
                <div className="absolute left-4 top-4 bottom-4 w-px bg-border-primary -z-10"></div>
                {steps.map(step => (
                    <NavLink
                        key={step.path}
                        to={`/developer/listings/${id}/${step.path}`}
                        className={({ isActive }) => `
                            flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                            ${isActive 
                                ? 'bg-surface-secondary border border-accent-primary/30 shadow-sm' 
                                : 'hover:bg-surface-hover border border-transparent'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border transition-colors ${isActive ? 'bg-accent-primary text-white border-accent-primary shadow-[0_0_10px_rgba(var(--color-accent-primary),0.3)]' : 'bg-background-primary text-text-secondary border-border-primary'}`}>
                                    {isActive ? <CheckCircle2 size={16} /> : step.label.split('.')[0]}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${isActive ? 'text-accent-primary' : 'text-text-primary'}`}>{step.label.split('. ')[1]}</div>
                                    <div className="text-xs text-text-tertiary mt-0.5">{step.desc}</div>
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}
