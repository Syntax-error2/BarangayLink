import { Network } from '@capacitor/network';
import api from './axios';

const QUEUE_KEY = 'barangaylink_offline_queue';

export const getOfflineQueue = () => {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
};

export const saveToQueue = (request) => {
    const queue = getOfflineQueue();
    // Add unique ID and timestamp
    const queuedRequest = {
        ...request,
        _id: Date.now().toString(),
        _timestamp: new Date().toISOString()
    };
    queue.push(queuedRequest);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return queuedRequest;
};

export const removeFromQueue = (id) => {
    let queue = getOfflineQueue();
    queue = queue.filter(req => req._id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const syncOfflineQueue = async () => {
    const status = await Network.getStatus();
    if (!status.connected) return;

    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} offline requests...`);

    for (const req of queue) {
        try {
            // Attempt to send the request
            await api.request({
                method: req.method,
                url: req.url,
                data: req.data,
                headers: req.headers
            });
            // If successful, remove from queue
            removeFromQueue(req._id);
            console.log(`Successfully synced offline request: ${req.url}`);
        } catch (error) {
            console.error(`Failed to sync offline request: ${req.url}`, error);
            // We keep it in the queue if it fails due to network. 
            // If it's a 4xx error (bad request), we might want to remove it to prevent infinite loops.
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                 removeFromQueue(req._id);
            }
        }
    }
};

// Initialize network listener
export const initOfflineSync = () => {
    Network.addListener('networkStatusChange', status => {
        if (status.connected) {
            syncOfflineQueue();
        }
    });
};
