import { authenticate } from "backend/realtime.web";
import { v4 as uuid4 } from "uuid";
import { authentication, currentMember } from "wix-members-frontend";
import { local } from "wix-storage";
import { subscribe } from "wix-realtime-frontend";
import wixWindowFrontend from 'wix-window-frontend';

$w.onReady(function () {

    let sessionId = local.getItem("sessionId") ?? false;
    const formFactor = wixWindowFrontend.formFactor;

    let codeTrigger = false;

    console.log("After session id: ", sessionId);

    authentication.onLogin(async (member) => {
        if (!sessionId) {
            sessionId = uuid4() + "-" + (+new Date()).toString();
            local.setItem("sessionId", sessionId);
        }

        console.log("Running inside authentication.onLogin: ", sessionId);
        const memberId = (await member.getMember())._id;

        setTimeout(async () => {
            console.log("After mandatory 5 seconds wait! ");
            await authenticate(memberId, sessionId, formFactor);
        }, 5000)

        console.log("Sent message");
    });

    currentMember.getMember().then((member) => {
        if (typeof member !== 'undefined') {
            if (!sessionId) {
                sessionId = uuid4() + "-" + (+new Date()).toString();
                local.setItem("sessionId", sessionId);
            }

            console.log("Running inside currentMember.getMember: ", sessionId);
            const memberId = member._id;

            setTimeout(async () => {
                console.log("After mandatory 7 seconds wait! ");
                await authenticate(memberId, sessionId, formFactor);
            }, 7000)

        }
    });

    let channel = { "name": "members" };

    subscribe(channel, async (message) => {

        if(!authentication.loggedIn()) return;

        const memberId = (await currentMember.getMember())._id;

        const { memberId: rcvdMemberId, formFactor: rcvdFF, sessionId: rcvdSessionId } = message.payload;

        console.log({
            rcvdMemberId,
            rcvdSessionId,
            rcvdFF,
        });

        if (rcvdMemberId === memberId && sessionId !== rcvdSessionId) {
            // calculateIfLogout()
            const isL = isLogout(sessionId, rcvdSessionId);

            console.log({
                isL,
            })

            if(isL) {
                codeTrigger = true;
                wixWindowFrontend.openLightbox("Custom Logout", true);
            } else {
                // the other device should brodcast its own message
                await authenticate(memberId, sessionId, formFactor);
            }

        }

    }).then(() => {
        console.log("Well we are now subscribed! ")
    });


    authentication.onLogout( () => {
        if(codeTrigger) {
            // nothing to do
        } else {
            local.removeItem("sessionId");
            wixWindowFrontend.openLightbox("Custom Logout", false)
        }
    })

});


function isLogout(origin, rcvd) {

    let timeOrigin = Number(origin.split("-").slice("-1"));
    timeOrigin = isNaN(timeOrigin) ? -10000 : timeOrigin;
    let timeRcvd = Number(rcvd.split("-").slice("-1"));
    timeRcvd = isNaN(timeRcvd) ? -10000 : timeRcvd;

    console.log(timeOrigin, timeRcvd, origin, rcvd);

    return timeOrigin <= timeRcvd;
}