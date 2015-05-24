var stockLevelExtension = function(){
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    var loopcounter = 0,
    config = {
        partialDiscount : ['BEAUTY','APARTMENT','MUSIC'] //these things are only 20% off
    }

    // document.addEventListener('click', function() {
       // init(angular.element('[ng-controller=MainCtrl]').scope().serviceGroup.products.productList[0].prodData.prices.high)
    // }, false)

    // Product Detail Page Init
    var init = function(price){

        if(price !== undefined) {
            var discount = isPartialDiscount() ? .2 : .4,
            qtyContainer = document.getElementById("urban-discount-plugin");

            price = price - (price * discount);

            if(qtyContainer != null){
                qtyContainer.parentNode.removeChild(qtyContainer);
            }

            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<h2 id="urban-discount-plugin">'+price+'</h2>');

            if(!document.getElementsByClassName('urban-discount-extension-price')[0]){
                document.getElementsByClassName('product-price')[0].insertAdjacentHTML('beforeend', '<span class="urban-discount-extension-price">' + formatCurrency(parseFloat(price)) + '</span>');
            }

            else{
                document.getElementsByClassName('urban-discount-extension-price')[0].innerHTML = formatCurrency(price);
            }
        }
    }

    // Category Page Init
    var categoryInit = function(){
        var discount = isPartialDiscount() ? .2 : .4;
        // If we're on a product loop page
        var productArray = document.getElementsByClassName('product');
        for(var i=0, arrayLen = productArray.length; i < arrayLen; i++){

            var priceElement;

            if(productArray[i].getElementsByClassName('price-old')[0]){
                priceElement = productArray[i].getElementsByClassName('price-old')[0];
            }
            else if(productArray[i].getElementsByClassName('price-promo')[0]){
                priceElement = productArray[i].getElementsByClassName('price')[0];
                //tempPrice.toString();
            }
            else{
                priceElement = productArray[i].getElementsByClassName('price')[0];
            }

            // priceElement = priceElement.innerHTML.substring(0,priceElement.innerHTML.indexOf('<'));
            var price  = parseFloat(priceElement.innerHTML.replace(/[^\d\.]/g,''));

            price = formatCurrency( price - (price * discount) );
            console.log(price);

            productArray[i].getElementsByClassName('price')[0].insertAdjacentHTML('beforeend', ' - <span class="urban-discount-extension-price">' + price + '</span>');
        }
    }

    var stockParentCategory = function(){
        var elem = document.getElementsByClassName("header-nav-data")
        return elem[0].getAttribute('data-selected');
    }

    var isPartialDiscount = function(){
        var parentCat = stockParentCategory()
        return (config.partialDiscount.contains(parentCat) ? true : false);
    }

    // Format Price
    var formatCurrency = function(formatPrice){
        formatPrice = formatPrice.toFixed(2);
        formatPrice = '$' + formatPrice;
        return formatPrice;
    }


    function stockLoop() {
        if(document.URL.indexOf("productdetail.jsp") > -1){
            //loop through angular scope no more than 6 times
            if(loopcounter <= 6){
                loopcounter++;
                setTimeout(function () {
                    if(loopcounter <= 6){
                        var prodList = angular.element('[ng-controller=MainCtrl]').scope().serviceGroup.products.productList[0].prodData.prices.high;
                        if(prodList !== undefined){
                            init(prodList);
                            //kill the loop
                            loopcounter = 9;
                        }
                    }

                    stockLoop();
                }, 1000);
            }
        }

        if(document.URL.indexOf("category.jsp") > -1){
            categoryInit();
        }
    }

    stockLoop();
}

stockLevelExtension();
