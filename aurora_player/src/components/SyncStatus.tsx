import React, { useEffect, useState } from 'react';
import { Cloud, Loader2, CloudOff, CheckCircle } from 'lucide-react';
import { requireDriveAuth } from '../utils/googleDriveApi';

export const SyncStatus: React.FC = () => {
    const [status, setStatus] = useState<'offline' | 'syncing' | 'synced' | 'connect'>(
        localStorage.getItem('aurora_auth_token') ? 'synced' : 'connect'
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('aurora_auth_token');
            if (token && status !== 'synced' && status !== 'syncing') {
                setStatus('synced');
            } else if (!token && status !== 'connect') {
                setStatus('connect');
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [status]);

    const handleConnect = async () => {
        setStatus('syncing');
        const token = await requireDriveAuth();
        if (token) {
            setStatus('synced');
        } else {
            setStatus('connect');
        }
    };

    return (
        <div
           className="flex items-center gap-2 p-2 mt-auto mx-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
           onClick={handleConnect}
        >
            {status === 'synced' && <CheckCircle size={16} className="text-accent-cyan" />}
            {status === 'syncing' && <Loader2 size={16} className="animate-spin text-accent-cyan" />}
            {status === 'offline' && <CloudOff size={16} className="text-accent-rose" />}
            {status === 'connect' && <Cloud size={16} className="text-text-muted" />}

            <span className="text-xs font-medium text-text-muted">
                {status === 'synced' && 'Synced'}
                {status === 'syncing' && 'Syncing...'}
                {status === 'offline' && 'Offline'}
                {status === 'connect' && 'Connect Drive'}
            </span>
        </div>
    );
};
