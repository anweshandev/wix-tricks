import { permissionsRouter } from 'wix-realtime-backend';

permissionsRouter.default((channel, subscriber) => {
    return { "read": true };
});

export function realtime_check_permission(channel, subscriber) {
    console.log({
        channel,
        subscriber
    })
    return permissionsRouter.check(channel, subscriber);
}