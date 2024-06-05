(function(document, window){
    
    let box, subtotalbox, totalbox ,taxNode, tbdNode, ddNode, runner, waitForButton = false, taxValue = 0.0;
    let tbddNode, subddNode;

    let subtotalAmt = null;
    let realTotal;
    let actualSubTotalNode;
    let actualSubTotalAmt;

    let latchRunner;
    let wasPromo = false;
    let latch = false;

    if(window.location.pathname.indexOf("checkout") === -1){
        // Wix is not working properly, though I select the required page.
        // So location protection :)
        document.removeEventListener("visibilitychange", onVisibilityChange)
        // return;  
    }

    function onVisibilityChange() {
        if(document.visibilityState === 'hidden') {
            clearInterval(runner);
            clearInterval(waitForButton);
            clearInterval(latchRunner);
        } else {
            runner = setInterval( hideTax, 200 );
            
            setTimeout( () => {
                // Trigger a hook
                waitForButton = setInterval(waitBtn, 500);
                latchRunner = setInterval(adjustPromo, 500);
            }, 1000);
            
        }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    runner = setInterval(hideTax, 200)

    waitForButton = setInterval(waitBtn, 500);

    function adjustPromo() {

        // console.log("Hi, I am here")
        
        let _promoNode = document.querySelector("dl[data-hook='TotalsSectionDataHooks.AppliedCouponRow']") ?? undefined;

        if(typeof subtotalAmt === "string") return;

        if(typeof _promoNode === "undefined") {
            // console.log(subtotalAmt, subddNode.childNodes[0])

            subtotalAmt.innerText = subddNode.childNodes[0].innerText;
            
        } else if(typeof _promoNode !== "undefined") {

            // console.log(subddNode.childNodes[0].innerText, "subddNode");

            // console.log(subtotalAmt, _promoNode.childNodes[1]);

            let actualPromoAmt = _promoNode.childNodes[1].innerText;
            
            
            let actualPromoAmtReal = parseFloat(actualPromoAmt.replace(/[$,]/g, ""));
            let actualSubTotalAmt = parseFloat(subddNode.childNodes[0].innerText.replace(/[$,]/g, ""))
            
            let formattedAmt = actualSubTotalAmt + actualPromoAmtReal;

            // console.info(formattedAmt)
            let formattedAmtDollar = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(formattedAmt)
            subtotalAmt.innerText = formattedAmtDollar;
        }
        
        // else if(typeof _promoNode !== "undefined") {
    }

    function waitBtn() {

        if(window.location.pathname.indexOf("checkout") === -1){
            // Wix is not working properly, though I select the required page.
            // So resource protection :)
            clearInterval(waitForButton);
            clearInterval(latchRunner);
        }

        let btn = document.querySelector("button[data-hook='FormDetailsButtons.continue']") ?? undefined;
        let checkout = document.querySelector("div[data-hook='PaymentAndPlaceOrderDataHook.open']") ?? undefined
        // ?? document.querySelector("button[data-hook='FormDetailsButtons.continue']")
        let continueBtn = document.querySelector("button[data-hook='DeliveryMethodStep.continue']") ?? undefined;
        let customerDetail = document.querySelector("div[data-hook='CustomerDetailsStep.open']") ?? undefined;
        // console.log(customerDetail, typeof customerDetail, "Button here");
        console.log({btn, customerDetail, checkout})
        if( typeof checkout !== "undefined" || (typeof btn !== 'undefined' && typeof customerDetail === "undefined")) {
            // console.log(btn, customerDetail)
            // flip
            tbdNode.style.display = 'none';
            taxNode.style.display = 'inherit';
            // wix (final)
            realTotal.style.display = 'inherit';
            subtotalAmt.style.display = 'none';

        } else if(runner === false && typeof continueBtn !== 'undefined' && continueBtn !== btn && typeof tbdNode !== 'undefined') {
            // stable
            taxNode.style.display = 'none';
            tbdNode.style.display = 'inherit';
            // conditional
            realTotal.style.display = 'none';
            subtotalAmt.style.display = 'inherit';

        } else if(runner === false && typeof continueBtn !== 'undefined' && continueBtn !== btn) {
            // Back protection, navigator.history
            // Hooked for all scenarios
            clearInterval(waitForButton);
            clearInterval(latchRunner)

            runner = setInterval( hideTax, 200 );
            
            setTimeout( () => {
                // Trigger a hook
                waitForButton = setInterval(waitBtn, 500);
                latchRunner = setInterval(adjustPromo, 500);
            }, 1000)
        }
    }

    function hideTax() {
        box = document.querySelector("dl[data-hook='TotalsSectionDataHooks.TaxRow']") ?? undefined;
        subtotalbox = document.querySelector("dl[data-hook='TotalsSectionDataHooks.SubtotalRow']") ?? undefined;
        totalbox = document.querySelector("dl[data-hook='TotalsSectionDataHooks.TotalRow']") ?? undefined;
        
        if(typeof box !== 'undefined' && typeof totalbox !== 'undefined' && typeof subtotalbox !== 'undefined') {
            // console.log("BOX Found");

            ddNode = box?.lastChild ?? null;

            tbddNode = totalbox?.lastChild ?? null;

            subddNode = subtotalbox.lastChild ?? null;

            if(ddNode !== null && tbddNode !== null) {
                
                clearInterval(runner);
                runner = false;

                if(ddNode.childNodes.length > 1) {
                    tbdNode = ddNode.childNodes[1];
                    taxNode = ddNode.childNodes[0];
                    
                }else if(ddNode.childNodes.length !== 0 && ddNode.childNodes[0].nodeName.toLowerCase() === 'span') {

                    tbdNode = ddNode.childNodes[0].cloneNode();
                    taxNode = ddNode.childNodes[0];
                    tbdNode.innerText = "TBD";
                    taxNode.style.display = 'none';
                    taxValue = taxNode.innerText.substring(1);
                    ddNode.appendChild(tbdNode);
                }

                if(tbddNode.childNodes.length > 1) {
                    
                    realTotal = tbddNode.childNodes[0];
                    subtotalAmt = tbddNode.childNodes[1];
                    subtotalAmt.innerText = subddNode.childNodes[0].innerText;

                }else if(tbddNode.childNodes.length !== 0 && tbddNode.childNodes[0].nodeName.toLowerCase() === 'span') {

                    // Subtotal Amount save hocche 
                    actualSubTotalNode = subddNode.childNodes[0]
                    subtotalAmt = actualSubTotalNode.innerText;
                    actualSubTotalAmt = parseFloat(subtotalAmt.replace(/[$,]/g, ""));

                    // realtotal - Children node er actual $ amount
                    realTotal = tbddNode.childNodes[0];
                    // console.log(realTotal);
                    // temporarily class clone er jonno ekta node clone korchi "realtotal"
                    let tmp = realTotal.cloneNode();
                    
                    // console.log(tmp);
                    tmp.innerText = subtotalAmt;

                    subtotalAmt = tmp;

                    realTotal.style.display = 'none';
                    tbddNode.appendChild(subtotalAmt);
                }
                adjustPromo();
                latchRunner = setInterval(adjustPromo, 500);
            }
        }
    }
})(document, window)