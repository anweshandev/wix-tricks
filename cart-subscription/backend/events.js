
import { givePointsToBox, applyForSubscription } from "backend/plan";

export function wixStores_onOrderPaid(event) {
    
    if(event["paymentStatus"] === "PAID" && (typeof event["subscriptionInfo"] !== "object" || !("id" in event["subscriptionInfo"]))) {

        // Grab the id and push the code
        const _id = event["_id"];

        const lineItems = event["lineItems"];
        const buyerInfo = event["buyerInfo"]

        const rewards = {
            "3734d679-6773-be7f-ff02-e7b08315cb25": 200,
            "37b71638-aace-468f-91c3-44f04fc00876": 200,
            "b5d23057-aa7e-24c0-230e-6253b97180e9": 200,
            "01dd9847-c096-0480-7d57-b263062a60a7": 50,
            "d094eea3-7fff-c37b-814b-df295b69c252": 50,
            "3fe81feb-4c11-f10c-4e76-1e4e103c1f60": 50,
            "0e142457-2847-133d-67c6-dd49d7a7d769": 100,
            "7e5934a5-6a9b-92f4-9ba4-2fb684aa35d2": 100,
            "de741443-a2c0-168e-4630-d406efbb2ae9": 100,
        }


        let lineItems1 = [];

        let lineItems2 = [];

        for( let i = 0; i < lineItems.length; i++) {

            const productId = lineItems[i].productId

            if ( productId in rewards ) {
                // line items 1 => All boxes
                lineItems1.push(lineItems[i])
            } else {
                // line items 2 => All mix and matches.
                lineItems2.push(lineItems2[i])
            }

        }

        if(Array.isArray(lineItems1) && lineItems1.length > 0) {
            givePointsToBox(buyerInfo, lineItems1);
        }

        if(Array.isArray(lineItems2) &&lineItems2.length > 0) {
            applyForSubscription(_id, lineItems2, buyerInfo)
        }


    }
    else if(event["paymentStatus"] === "PAID" && typeof event["subscriptionInfo"] === "object" && "id" in event["subscriptionInfo"]) {
        // Should be a person which has selected some subscription

        const lineItems =  event["lineItems"];

        const buyerInfo = event.buyerInfo;

        // check subscription thingy...
        givePointsToBox(buyerInfo, lineItems);
    }


}