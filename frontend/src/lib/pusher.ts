import PusherClient from 'pusher-js';

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/pusher/auth`,
    forceTLS: true,
});