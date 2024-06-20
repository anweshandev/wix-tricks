(function() {
	
	let moveWithLR = function(interval) {
		
		let tbody = document.querySelectorAll("tbody");
		let tbodyArr = Array.from(tbody);
		
		
		if(tbodyArr.length > 0) {
			
			if(interval){
				clearInterval(interval);
			}
			
			tbodyArr.forEach( ele => {
				
				ele.addEventListener("scroll", (evt) => {
					
					const scrollTop = evt.target.scrollTop;
					
					tbodyArr.forEach( (e) => {
						
						if(evt.target !== e){
							
							e.scrollTop = scrollTop;
						}

					});
					
				});
			});
			
			return true;
		}
		
		return false;
	}
	
	if(window.location.pathname === "/crtx-index-portal-3-1" || window.location.pathname === "/crtx-index-portal-5" || window.location.pathname === "/us-agency-mbs-substance-cubes" || window.location.pathname === "/demopage") {
		
		let mwlr = moveWithLR(false);
		
		
		console.log("MWLR", {
			mwlr: mwlr
		});
		
		if(mwlr === true) {
			return;
		}
		
		let interval = setInterval( () => {
			
			mwlr(interval);
			
		}, 5000);
		
	}
})(window);