'use client';
'use no memo';

import React, { useCallback, useEffect, useRef } from 'react';
import * as jose from 'jose';

const Refresher = ({ children }: { children: React.ReactNode }) => {
    const timeoutId = useRef<NodeJS.Timeout | undefined>(undefined);
    const refreshAccessTokenRef = useRef<(() => Promise<void>) | undefined>(undefined);

    const getAccessToken = async () => {
        console.log('[Refresher] Fetching access token...');
        const res = await fetch('/api/auth/accessToken');

        if (!res.ok) {
            console.warn('[Refresher] Failed to fetch access token, status:', res.status);
            return;
        }

        const accessToken = await res.json();
        console.log('[Refresher] Access token fetched:', accessToken.token ? 'exists' : 'missing');
        return accessToken.token;
    };

    const startRefresh = useCallback(async () => {
        console.log('[Refresher] startRefresh called');

        if (timeoutId.current) {
            console.log('[Refresher] Clearing existing timeout');
            clearTimeout(timeoutId.current);
        }

        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                console.warn('[Refresher] No access token found, stopping refresh cycle');
                return;
            }

            const token = jose.decodeJwt(accessToken);
            const exp = token.exp! * 1000;

            const currentTime = Date.now();
            const refreshTime = exp - currentTime - 5000;

            console.log(`[Refresher] Current time: ${new Date(currentTime).toISOString()}`);
            console.log(`[Refresher] Token expiry time: ${new Date(exp).toISOString()}`);
            console.log(`[Refresher] Refresh in: ${(refreshTime / 1000).toFixed(1)}s`);
            console.log(`[Refresher] Scheduled refresh time: ${new Date(currentTime + refreshTime).toISOString()}`);

            if (refreshTime <= 0) {
                console.warn('[Refresher] Token already expired, refreshing immediately');
                refreshAccessTokenRef.current?.();
                return;
            }

            timeoutId.current = setTimeout(() => {
                console.log('[Refresher] Timeout fired, calling refreshAccessToken...');
                refreshAccessTokenRef.current?.();
            }, refreshTime);

            console.log('[Refresher] Timeout scheduled, id:', timeoutId.current);
        } catch (err: any) {
            console.error('[Refresher] Error in startRefresh:', err);
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        console.log('[Refresher] refreshAccessToken called');
        try {
            const res = await fetch('/api/auth/refresh', { method: 'POST' });
            console.log('[Refresher] Refresh response status:', res.status);

            if (!res.ok) {
                console.warn('[Refresher] Failed to refresh, stopping cycle');
                const body = await res.json();
                console.warn('[Refresher] Error body:', body);
                return; // ← stop, no startRefresh
            }

            const body = await res.json();
            console.log('[Refresher] Refresh response body:', body);
            console.log('[Refresher] Token refreshed successfully, restarting cycle...');
        } catch (err: any) {
            console.error('[Refresher] Error while refreshing the token:', err);
            return; // ← stop, no startRefresh
        }

        startRefresh(); // ← only on success
    }, [startRefresh]);

    useEffect(() => {
        console.log('[Refresher] Syncing refreshAccessTokenRef');
        refreshAccessTokenRef.current = refreshAccessToken;
    }, [refreshAccessToken]);

    useEffect(() => {
        console.log('[Refresher] Component mounted, starting refresh cycle');
        startRefresh();

        return () => {
            console.log('[Refresher] Component unmounted, clearing timeout');
            clearTimeout(timeoutId.current);
        };
    }, [timeoutId, startRefresh]);

    return <div>{children}</div>;
};

export default Refresher;