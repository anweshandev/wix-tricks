(function () {
	let formattedAmtDollar = (formattedAmt) =>
		new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(formattedAmt);

	let add_minutes =  (minutes, dt = undefined) => {
		
		if(typeof dt === 'undefined') {
			dt = new Date();
		}
		
		return (new Date(dt.getTime() + (minutes*60000))).getTime();
	}

	let checkout = document.querySelector(
		`button[data-hook="CheckoutButtonDataHook.button"]`
	);

	// checkout.style.display = "none";
    let styleForSafari = document.createElement("link");
    styleForSafari.href = "https://storage.googleapis.com/anweshan-dev.appspot.com/shipthelip/index.css";
    styleForSafari.rel = "stylesheet";
    document.head.appendChild(styleForSafari);

	let checker = setInterval( () => {
		
		
		if (window.location.pathname === "/cart-page") {
			work();

			if(typeof document.querySelector("#plan-box-1") !== 'undefined') {
				document.querySelector("#plan-box-1").addEventListener("click", (evt) => {
					document.querySelector("#plan-box-1").querySelector(".circle").classList.toggle("checked");
					document.querySelector("#plan-box-3").querySelector(".circle").classList.toggle("checked");
					if(document.querySelector("#plan-box-1").querySelector(".circle").classList.contains("checked")) {
						let checkout = document.querySelector(
							`button[data-hook="CheckoutButtonDataHook.button"]`
						);
						checkout.children[0].children[0].innerText = "Subscribe Now";
					} else {
						let checkout = document.querySelector(
							`button[data-hook="CheckoutButtonDataHook.button"]`
						);
						checkout.children[0].children[0].innerText = "Buy Now";
					}
				})
				document.querySelector("#plan-box-3").addEventListener("click", (evt) => {
					document.querySelector("#plan-box-1").querySelector(".circle").classList.toggle("checked");
					document.querySelector("#plan-box-3").querySelector(".circle").classList.toggle("checked");
					if(document.querySelector("#plan-box-1").querySelector(".circle").classList.contains("checked")) {
						let checkout = document.querySelector(
							`button[data-hook="CheckoutButtonDataHook.button"]`
						);
						checkout.children[0].children[0].innerText = "Subscribe Now";
					} else {
						let checkout = document.querySelector(
							`button[data-hook="CheckoutButtonDataHook.button"]`
						);
						checkout.children[0].children[0].innerText = "Buy Now";
					}
				})
			}
		}



	}, 1500);

	let try5 = 0;

	let checkFirstTime = setInterval( () => {
		if(try5 < 6) {
			window.localStorage.removeItem("now-price")
			try5++;
			// checkout.style.display = "block";
		} else {
			clearInterval(checkFirstTime);
		}
	}, 1000)

	function work() {

		let checkout = document.querySelector(
			`button[data-hook="CheckoutButtonDataHook.button"]`
		);
		
		let grandTotal = document.querySelector(
			`dd[data-hook="Total.formattedValue"]`
		),
		onlyOneTimePay,
		sumMontlyPay;

		grandTotal.parentElement.style.display = "none";

		

		let grandTotalAmt = parseFloat(grandTotal.innerHTML.replace(/[$,]/g, ""));

		let allLineItemNodes = document.querySelectorAll(
		`li[data-hook="CartItemsDataHook.item"]`
		);

		let allLineItemArr = Array.from(allLineItemNodes);

		const nowPrice = window.localStorage.getItem("now-price");
		let nowTime = window.localStorage.getItem("now-time");

		let planBox1 = document.querySelector("#plan-box-1"),
		planBox2 = document.querySelector("#plan-box-2"), planBox3 = document.querySelector("#plan-box-3");

		let exist = false;

		if(grandTotal.innerText === nowPrice) {
			return;
		}

		// window.localStorage.setItem("now-time", new Date().getTime())

		window.localStorage.setItem("now-price", grandTotal.innerText)
		window.localStorage.setItem("now-time",  (new Date()).getTime())

		let onlyOneTime = allLineItemArr.map((_, index) => {
		let parent = allLineItemNodes[index];
		console.log(parent);
		let price = parent.querySelector(
			`div[data-hook="CartItemDataHook.totalPrice"]`
		);
		let options = parent.querySelector(
			`ul[data-hook="CartItemDataHook.options"]`
		);
		console.log(options, options.firstChild.innerText);
		if (options.firstChild.innerText.indexOf("Color") === -1) {
			return false;
		}

		return {
			element: parent,
			price: price.innerText.replace(/[$,]/g, ""),
		};
		});

		let monthlyPay = allLineItemArr.map((_, index) => {
		let parent = allLineItemNodes[index];
		console.log(parent);
		let price = parent.querySelector(
			`div[data-hook="CartItemDataHook.totalPrice"]`
		);
		let options = parent.querySelector(
			`ul[data-hook="CartItemDataHook.options"]`
		);
		if (options.firstChild.innerText.indexOf("Color") !== -1) {
			return false;
		}

		return {
			element: parent,
			price: parseFloat(price.innerText.replace(/[$,]/g, "")),
		};
		});

		monthlyPay = monthlyPay.filter((element) => element !== false);
		onlyOneTime = onlyOneTime.filter((element) => element !== false);

		// onlyOneTimePay = grandTotalAmt - monthlyPay;

		const pdt = grandTotal.parentElement.parentElement;

		if (monthlyPay.length > 0) {
			
			sumMontlyPay = monthlyPay.reduce((a, b) => a + b.price, 0);

			


		//   let circle_check = document.querySelector("#plan-box-1").querySelector(".circle").classList.contains("checked")
		//   let circle_check = document.querySelector("#plan-box-1").querySelector(".circle").classList.contains("checked")

		let elementor = `
				<div class="circle checked"></div>
				<div>
					<div data-hook="plan-name" class="plan-name">Monthly Subscription</div>
					<div class="plan-tagline" data-hook="plan-tagline">Convenience Delivered: On-Time to Your Doorstep!</div>
					<div>
						<span data-hook="plan-price" class="plan-price">${formattedAmtDollar(
						sumMontlyPay
						)}</span>
						<span data-hook="plan-details" style="font-size: 12px; margin-left: 4px;">every month until canceled</span>
					</div>
				</div>`;

			let elementor2 = `
				<div class="circle"></div>
				<div>
					<div data-hook="plan-name" class="plan-name">One Time Payment</div>
					<div class="plan-tagline" data-hook="plan-tagline">Convenience Delivered: On-Time to Your Doorstep!</div>
					<div>
						<span data-hook="plan-price" class="plan-price">${formattedAmtDollar(
						sumMontlyPay
						)}</span>
					</div>
				</div>`;

		if (planBox1) {
			planBox1.innerHTML = elementor;

			planBox3.innerHTML = elementor2;

		} else {
			const div = document.createElement("div");

			div.id = "plan-box-1";

			div.classList.add("plan-box");

			div.innerHTML = elementor;

			pdt.appendChild(div);

			const div2 = document.createElement("div");
			
			div2.id = "plan-box-3";
			
			div2.classList.add("plan-box");

			div2.innerHTML = elementor2;

			pdt.appendChild(div2);

		}

		} else {
		if (planBox1) {
			planBox1.parentElement.removeChild(planBox1);
		}
		if(planBox3) {
			planBox3.parentElement.removeChild(planBox3);
		}

		sumMontlyPay = 0;
		}

		if (onlyOneTime.length > 0) {
		onlyOneTimePay = grandTotalAmt - sumMontlyPay;

		let elementor = `<div>
						<div data-hook="plan-name" class="plan-name">One Time Payment</div>
						<div class="plan-tagline" data-hook="plan-tagline">Convenience Delivered: On-Time to Your Doorstep!</div>
						<div>
							<span data-hook="plan-price" class="plan-price">${formattedAmtDollar(
							onlyOneTimePay
							)}</span>
						</div>
					</div>`;

		if (planBox2) {
			planBox2.innerHTML = elementor;
		} else {
			const div = document.createElement("div");

			div.id = "plan-box-2";

			div.classList.add("plan-box");

			div.innerHTML = elementor;

			pdt.appendChild(div);
		}
		} else {
		if (planBox2) {
			planBox2.parentElement.removeChild(planBox2);
		}

		onlyOneTimePay = 0;
		}

		if (monthlyPay.length > 0 && onlyOneTime.length > 0) {
			checkout.children[0].children[0].innerText = "Subscribe Now & Checkout";
		} else if (monthlyPay.length > 0) {
			checkout.children[0].children[0].innerText = "Subscribe Now";
		} else if (onlyOneTime.length > 0) {
			checkout.children[0].children[0].innerText = "Checkout";
		}
	}
})();

// NEW CUSTOM CODE

(function() {
	let checkout = document.querySelector(
		`div[data-hook="CheckoutButtons.default"]`
	);

	let total = document.querySelector(`dd[data-hook="Total.formattedValue"]`);

	let secureCheckout = document.querySelector(`div[data-hook="SecureCheckoutDataHook.root"]`);

	let limit = 21;

	let checkoutHide = (cc) => {

		checkout = document.querySelector(`div[data-hook="CheckoutButtons.default"]`);
		total = document.querySelector(`dd[data-hook="Total.formattedValue"]`);
		secureCheckout = document.querySelector(`div[data-hook="SecureCheckoutDataHook.root"]`);
		
		if(checkout) {
			checkout.style.display = "none";
		}

		if(total) {
			total.parentElement.style.display = "none";
		}

		if(secureCheckout) {
			secureCheckout.style.display = "none";
		}



		if( checkout || total || secureCheckout ) {
			limit--;

			if(limit === 0) {
				clearInterval(cc);
			}
		}
	}

	let cc = setInterval( () => {
		checkoutHide(cc);
	}, 3000);
})();