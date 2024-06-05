(function(window, document) {

    function delayedFunction() {
        const links = document.querySelectorAll("a");
      
            links.forEach((link) => {
                console.log(link);
              if (link.textContent.includes("Buy") && link.textContent.indexOf("Buy Now") === -1) {
                  link.textContent = "Buy Now";
                  link.classList.add("custom-link");
                  
                  // Quantity
                  let one = document.querySelector("[aria-label='Add one']") ?? undefined;
                  
                  
                  if(typeof one !== 'undefined') {
                      one.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
                    }
                    
                    let buynow = document.querySelector("[aria-label='Buy Now']") ?? undefined;
                    
                    if(typeof buynow !== 'undefined'){
                        buynow.style.display = 'none';
                    } 
              }
        });
    }

    let minRun = 15;

    let fn = setInterval(() => {
        // if(minRun === 0) clearInterval(fn);
        // console.log("RUN")
        // minRun--;
        delayedFunction();
    }, 1000);

})(window, document)

