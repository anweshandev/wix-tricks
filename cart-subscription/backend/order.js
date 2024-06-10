import wixData from 'wix-data';
import wixStoresBackend from 'wix-stores-backend';
import { getPointsFromItems, addPoints, isProductMerch } from 'backend/plan'

export async function createOrders() {

    let timeZone =  "America/Los_Angeles"

    let now_date_string = Intl.DateTimeFormat('fr-CA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone,
    }).format(new Date());

    const now_date = new Date(now_date_string);


    let all_orders_res = await wixData.query("mmo").eq("day", now_date.getDate()).find({
        suppressAuth: true,
        consistentRead: true,
    });


    let hasMore = false;
    
    do {
        
        const all_orders = all_orders_res.items;

        console.log({
            all_orders
        })

        for(let i = 0; i < all_orders.length; i++) {
            
            let the_order = all_orders[i];

            // let placed_on = the_order.lastPlacedOn

            console.log({
               the_order,
            });
            
            const item = await wixData.get("Stores/Orders", the_order.firstOrderId)
            // @ts-ignore
            let { lineItems, discount, currency: {code = 'USD'}, totals, buyerInfo, billingInfo, shippingInfo } = item;

            const { id: contactId } = buyerInfo;

            // Delete those products which are merch or otherwise

            let prevLineItems = lineItems.length;
            
            lineItems = lineItems.filter( async (item) => !(await isProductMerch(item.productId)));
            
            // calculate points

            const points = getPointsFromItems(lineItems);

            
            if(totals.total != 0) {
                // That means we have a coupom
                if(lineItems.length < prevLineItems) {
                    // Need to discuss
                }
            }

            const fullOrder = {
                "buyerLanguage": "en",
                "currency": code,
                "billingInfo": {
                    ...billingInfo
                },
                totals: {
                    ...totals,
                },
                "channelInfo": {
                    "type": "WEB"
                },
                "paymentStatus": "UNPAID",
                "shippingInfo": {
                    ...shippingInfo,
                },
                "buyerInfo": {
                    ...buyerInfo,
                },
                "lineItems": lineItems,
                "discount": discount,
            }
            

            
            
            // @ts-ignore
            const order = await wixStoresBackend.createOrder(fullOrder);

            // console.log(fullOrder, "Some id");

            let dt_obj = new Date();
            let timeZone =  "America/Los_Angeles"

            let db_date = Intl.DateTimeFormat('fr-CA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                timeZone,
            }).format(dt_obj);

            // console.log({
            //     ...the_order,
            //     recentOrderId: "order._id",
            //     lastPlacedOn: db_date
            // })

            await wixData.update("mmo", {
                ...the_order,
                recentOrderId: order._id,
                lastPlacedOn: db_date
            });

            if(points > 0 ){
                addPoints(contactId, points, "Automatic mix and match order placed");
                // console.log({contactId, points, d: "Automatic mix and match order placed"})
            }     


        }

        hasMore = all_orders_res.hasNext();

        if(hasMore) {
            //@ts-ignore
            all_orders_res = await all_orders_res.next();
        }

    } while(hasMore != false)   

}


function getOrder(id) {
    // wixStoresBackend.
}