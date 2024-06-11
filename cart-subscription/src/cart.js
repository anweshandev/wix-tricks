// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import { cart } from 'wix-stores-frontend';
import { isProductMerch, isProductBox } from 'backend/plan';
import wixLocationFrontend from 'wix-location-frontend';
import { getCheckoutUrl } from 'backend/pricing';

import { authentication, currentMember } from 'wix-members-frontend';

import { createPlan, getURI, updatePlan, createDescription } from 'backend/pricing';

// @ts-ignore
import { customPurchaseFlow  } from 'wix-pricing-plans'

import wixData from 'wix-data';

$w.onReady(function () {

    let trigger = false;

	let checkouturl;
	let subscriptionurl;
    let checkoutid;
	let cartId;
	let theLineItems;
	let totalAmt;


    const rand = Math.random().toString().slice(2, 8);
    $w("#monthly").setAttribute("checked", `true-${rand}`);

    cart.getCurrentCart().then(async (res) => {
        const lineItems = res.lineItems;
        const totals = res.totals;

        if (lineItems.length > 0) {
            let removed = false;
			let q = []
            for (let i = 0; i < lineItems.length; i++) {
                const { quantity, id, productId } = lineItems[i];
                if ((await isProductMerch(productId)) === true || (await isProductBox(productId)) !== false ) {
                    trigger = true;
					q.push(id);
                    removed = true;
                }
            }

            console.log("Removed: ", removed);

            if (removed) {
				if(q.length === lineItems.length) {
					// So only merchandise or box or both which is okay
                    $w("#monthly").collapse();
				} else {

                    // Somthign else is also present

                    for(let j = 0; j < q.length; j++) {
                        await cart.removeProduct(q[j]);
                    }


                    wixLocationFrontend.to(wixLocationFrontend.url);
                    return;
                }
            }

			cartId = res._id;

			theLineItems = res.lineItems;

			totalAmt = totals.total;

			console.log("Cart ID: ", cartId);

			let { checkoutUrl: cu, checkoutId: ci } = await getCheckoutUrl(cartId);

            checkouturl = cu;
            checkoutid = ci;

			console.log({
				checkouturl
			});

            const rand = Math.random().toString().slice(2, 8)
            $w("#monthly").setAttribute("price", `${rand}-${toUSD(totals.total)}`)
            $w("#onetime").setAttribute("price", `${rand}-${toUSD(totals.total)}`);

            if($w("#monthly").collapsed) {
                $w("#onetime").setAttribute("checked", `true-${rand}`);
                $w("#checkoutbtn").label = "Buy Now";
            }

            $w("#checkoutgroup").expand();

            trigger = false;
        }
    })

    cart.onChange(async (evt) => {

		if(trigger) return;

		cartId = evt._id
		
        if (evt.lineItems.length === 0) {
            $w("#monthly").expand();
            $w("#checkoutgroup").collapse();
            return;
        }

		

        let removed = false;
        
        // we need to check for multiple things.

        if(evt.lineItems.length > 0) {
            let lineItems = evt.lineItems;
            let q = []
            for (let i = 0; i < lineItems.length; i++) {
                const { quantity, id, productId } = lineItems[i];
                if ((await isProductMerch(productId)) === true || (await isProductBox(productId)) !== false ) {
                    trigger = true;
					q.push(id);
                    removed = true;
                }
            }

            if (removed) {
				if(q.length === lineItems.length) {
					// So only merchandise or box or both which is okay
                    $w("#monthly").collapse();

				} else {

                    // Somthign else is also present

                    for(let j = 0; j < q.length; j++) {
                        await cart.removeProduct(q[j]);
                    }

                    wixLocationFrontend.to(wixLocationFrontend.url);
                    return;
                }
            }
        }



        theLineItems = evt.lineItems;

		const totals = evt.totals;

		totalAmt = evt.totals.total;

		const rand = Math.random().toString().slice(2, 8)
		$w("#monthly").setAttribute("price", `${rand}-${toUSD(totals.total)}`)
		$w("#onetime").setAttribute("price", `${rand}-${toUSD(totals.total)}`);

        if($w("#monthly").collapsed) {
            $w("#onetime").setAttribute("checked", `true-${rand}`);
            $w("#checkoutbtn").label = "Buy Now";
        }

		$w("#checkoutgroup").expand();

    })

    $w("#onetime").on("click", () => {
        const rand = Math.random().toString().slice(2, 8)
        console.log("Clicked")
        $w("#onetime").setAttribute("checked", `true-${rand}`);
        $w("#monthly").setAttribute("checked", `false-${rand}`);

        $w("#checkoutbtn").label = "Buy Now";
    });

    $w("#monthly").on("click", () => {
        console.log("Clicked")
        const rand = Math.random().toString().slice(2, 8)
        $w("#onetime").setAttribute("checked", `false-${rand}`);
        $w("#monthly").setAttribute("checked", `true-${rand}`);

        $w("#checkoutbtn").label = "Subscribe";
    });


	$w("#checkoutbtn").onClick( async () => {
        let label =$w("#checkoutbtn").label.toLowerCase();
        $w("#checkoutbtn").disable();
		if(label.indexOf("subscribe") !== -1) {
			// Lets do something

            // need to check if same cart id, and not used with total also exactly same then match line items...
            // if so then use that plan id and checkout man!

            let res = await wixData.query("CustomPlans").ne("used", true).eq("cartId", cartId).find();
            let planId;
            const crt = await cart.getCurrentCart()

            if(res.totalCount >= 1) {
                console.log("Enter update");
                let firstOne = res.items[0];

                // need to update the plan for the same planID

                console.log({
                    firstOne
                });

                planId = firstOne.planId;
                
                const rsp = await updatePlan(planId, totalAmt, {
                    description: (await createDescription(theLineItems)),
                    name: "Mix&Match Bundle",
                });

                console.log({
                    rsp
                });

                if(rsp === false) {
                    console.log("OOps! Error Alert. ");
                }

                await wixData.update("CustomPlans", {
                    ...firstOne,
                    checkoutId: checkoutid,
                    cartId: cartId,
                    lineItems: theLineItems,
                    used: false,
                    orderId: "TBD",
                    planId: planInfo._id,
                    total: totalAmt,
                    totals: crt.totals,
                })


            } else {
                const planInfo = await createPlan(totalAmt, "Mix&Match Bundle", (await createDescription(theLineItems)));
                planId = planInfo._id;

                

                // cart.getCurrentCart().then( (res) => res.)

                

                res = await wixData.insert("CustomPlans", {
                    checkoutId: checkoutid,
                    cartId: cartId,
                    lineItems: theLineItems,
                    used: false,
                    orderId: "TBD",
                    planId: planInfo._id,
                    total: totalAmt,
                    totals: crt.totals,
                    
                });

            }


            console.log({
                planId,
            })

            customPurchaseFlow.navigateToCheckout({
                planId
            })

            // const uri = await getURI(planId);

            // trigger = true;

            // const myCart = await cart.getCurrentCart();

            // $w("#shoppingCart1").collapse();

            // myCart.lineItems.forEach( async (item) => {
            //     await cart.removeProduct(item.id);
            // });
            
            // wixLocationFrontend.to(`${wixLocationFrontend.baseUrl}${uri}`);

		} else {
			wixLocationFrontend.to(checkouturl);
		}
	})

});

function toUSD(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
}