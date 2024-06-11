
import { givePointsToBox, givePointsToItems } from "backend/plan";
import { createOrderbyHook } from "backend/pricing";

export function wixStores_onOrderPaid(event) {
    
    const lineItems =  event["lineItems"];
    const buyerInfo = event.buyerInfo;


    if(event["paymentStatus"] === "PAID" && typeof event["subscriptionInfo"] === "object" && "id" in event["subscriptionInfo"]) {
        // Should be a person which has selected some subscriptio
        // check subscription thingy...
        // definitely a box
        givePointsToBox(buyerInfo, lineItems);
        return;
    }


    if(event["paymentStatus"] === "PAID" && (typeof event["subscriptionInfo"] !== "object" || !("id" in event["subscriptionInfo"]))) {
        givePointsToItems(buyerInfo, lineItems);
    }


}


let queue = [];

import wixData from 'wix-data';

export function wixPricingPlans_onOrderUpdated(event) {

    const order = event.data.order;
    const planId = order.planId;

    if(queue.indexOf(planId) !== -1) return;
    queue.push(planId);

    const orderId = order._id;

    const paymentStatus = order.paymentStatus;

    const status = order.status;

    const buyer = order.buyer;

    if(status === "ACTIVE" && paymentStatus === "PAID") {
        wixData.query("CustomPlans").eq("planId", planId).find().then( (res) => {
            if(res.items.length >= 1) {
                let item = res.items[0];

                if(item.used !== true) {
                    // Then we need to update the order id, this is the first time
                    wixData.update("CustomPlans", {
                        ...item,
                        orderId: orderId
                    });

                    item.orderId = orderId;
                }

                if(item.orderId === orderId) {
                    let contactId = buyer.contactId;
                    let databaseId = item._id;

                    createOrderbyHook(contactId, databaseId);
                }

            }
        });
    }



    console.log("Charged");
}