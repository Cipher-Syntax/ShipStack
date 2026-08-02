import React from 'react';
import { Outlet } from 'react-router-dom';
import EditorSidebar from '../components/developer/EditorSidebar';

export default function EditorLayout() {
    return (
        <div className="flex h-screen bg-background-primary text-text-primary overflow-hidden">
            <EditorSidebar />
            <div className="flex-1 overflow-auto p-8 relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-4xl mx-auto min-h-full pb-20 relative z-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
