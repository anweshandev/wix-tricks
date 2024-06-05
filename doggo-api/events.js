import { generate_response } from 'backend/chatting';
import wixChatBackend from 'wix-chat-backend';

export function wixChat_onMessage(event) {
    if (event["direction"] === "VisitorToBusiness") {
        generate_response(event.payload.text).then((message) => {
            wixChatBackend.sendMessage({
                channelId: event.channelId,
                messageText: message,
            }).then(() => console.info("Auto reply from doggo. ", message));
        });
    }
}