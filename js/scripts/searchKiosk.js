$(document).ready(function(){
    var swiper;

    //disable backbutton
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        // Register the event listener
        document.addEventListener("backbutton", onBackKeyDown, false);
    }

    // Handle the back button
    //
    function onBackKeyDown() {
        //do nothing
    }
    
    // showLoading(true);
    showPageElement(".loader",true);
    $(".item-count").text(localStorage.countProductCartItem);

    //if there are products filtered in local storage
    if(localStorage.kioskListBrandFilter != undefined
        || localStorage.kioskListSizeFilter != undefined
        || localStorage.kioskListGenderFilter != undefined
        || localStorage.kioskListClassFilter != undefined) {
        showFilters();
    }
    else{
        getFiltersFromServer();
    }
    setFilterSelected();    

    checkFiltersMarked();
    checkOrderResultOption();

    //if there are products filtered in local storage
    if(localStorage.kioskProductList != undefined) {
        showProductFilter(localStorage.kioskOrderResults);
        resizeElement($('.swiper-wrapper'));   
    }    

    //set image logo
    $(".img-logo").attr("src", localStorage.logo);

    //cart button redirects to cart items screen
    $(".btn-cart").click(function(){
        window.location = "cart-items.html";
    });

    //home button redirects to home screen
    $(".btn-home").click(function(){
        window.location = "index.html";
    });

    //save index of product selected and redirect to product detail screen
    // $(".product").click(function(){
    //     var className = this.className;
    //     localStorage.indexProductSelected = className.substring(className.lastIndexOf("-")+1) - 1; 
    //     window.location = "product-detail.html";      
    // });

    //save index of product selected and redirect to product detail screen
    $(document).on("click",".product",function(){
        var className = this.className;
        var indexProductSelected = className.substring(className.lastIndexOf("-")+1) - 1; 
        var productListObject = JSON.parse(localStorage.kioskProductList);
        var product = productListObject.ProductList[indexProductSelected];
        localStorage.resultsProductStyleCodeSelected = product.styleCode;
        localStorage.resultsProductColorCodeSelected = product.colorCode;
        window.location = "product-detail.html"; 
    });

    //clear search product panel 
    $(".btnClearSearch").click(function(){  
        localStorage.removeItem("kioskListBrandFilterChecked");
        localStorage.removeItem("kioskListClassFilterChecked");
        localStorage.removeItem("kioskListGenderFilterChecked");
        localStorage.removeItem("kioskListSizeFilterChecked");
        localStorage.removeItem("kioskProductList");
        localStorage.removeItem("kioskCountProductFiltered");
        localStorage.removeItem("indexProductSelected");
        localStorage.removeItem("resultsProductColorCodeSelected");
        localStorage.removeItem("resultsProductStyleCodeSelected");
        localStorage.kioskOrderResults = "";
        $(".filters-marked .filter").each(function(){
            var itemValue = $(this).attr('data-value');
            $(this).click();
            removeFilter($(this));
        })
        checkFiltersMarked();
        resizeElement($('.swiper-wrapper'));
        // showResultsArea(false);
        showPageElement(".results",false);
        showSortArea(false);
        // showFiltersMarked(false);
        showPageElement(".filters-marked",false);
        // showOrderOption(false);
        showPageElement(".float-right",false);
        showPageElement(".notfound",false);
        showLogo(true);
        if($('.itemName').hasClass('expand'))
            $('.itemName').removeClass('expand');
        $(".swiper-wrapper").html("");
    });

    //apply filters and search products 
    $(".btnFilter").click(function(){  
        // showFiltersMarked(true); 
        showPageElement(".filters-marked",true);
        if($(".results").hasClass("hide"))
            $(".results").removeClass("hide").addClass("show");
        else
            $(".results").addClass("show");  
        localStorage.kioskCountProductFiltered = 0;
        localStorage.kioskProductList = '{"ProductList":[]}';
        clearSelectedFilters();
        saveSelectedFilters();        
        getProductFilterFromServer();
    });

    //order search product results from low to high price
    $(".lowToHigh").click(function () {
        // showLoadingResults(true);
        showPageElement(".loader-results",true);
        localStorage.kioskOrderResults = "asc";
        showProductFilter("asc");
        // showLoadingResults(false);
        showPageElement(".loader-results",false);
    })

    //order search product results from high to low price
    $(".highToLow").click(function () {
        // showLoadingResults(true);
        showPageElement(".loader-results",true);
        localStorage.kioskOrderResults = "desc";
        showProductFilter("desc");
        // showLoadingResults(false);
        showPageElement(".loader-results",false);
    })

    //remove all filters
    $(".clear-filters").click(function () {
        $(".filters-marked .filter").each(function(){
            var itemValue = $(this).attr('data-value');
            $(this).click();
            removeFilter($(this));
        })
    })
    
    //when page is loaded hide loaders
    $(window).on("load", function() {
       // showLoading(false);
       showPageElement(".loader",false);
       // showLoadingResults(false);
       showPageElement(".loader-results",false);
       // if($('.filters-marked').children().length==0){
       //      // $(".filters-marked").addClass("hide");
       // }
       if(localStorage.kioskCountProductFiltered == undefined)
            $(".filters-marked").addClass("hide");
       if(localStorage.kioskCountProductFiltered==0 || localStorage.kioskCountProductFiltered == undefined)
            $(".results").addClass("hide");
    });

    //observer for loader
    // var target = document.querySelector('.swiper-wrapper');

    // // create an observer instance
    // var observer = new MutationObserver(function(mutations) {
    //   mutations.forEach(function(mutation) {
    //     showLoading(false);
    //   });    
    // });

    // // configuration of the observer:
    // var config = { attributes: true, childList: true, characterData: true }

    // // pass in the target node, as well as the observer options
    // observer.observe(target, config);
});

function checkOrderResultOption(){
    if(localStorage.kioskOrderResults != "")
        if(localStorage.kioskOrderResults == "asc")
            // $('.sort-dropdown').removeClass('highToLow').addClass($(this).attr('class')).text("Low to high");
            if(localStorage.current_lang == "es") $(".sort-dropdown").text("Menor a mayor");
            else $(".sort-dropdown").text("Low to high");
        else
            // $('.sort-dropdown').removeClass('lowToHigh').addClass($(this).attr('class')).text("High to low");
            if(localStorage.current_lang == "es") $(".sort-dropdown").text("Mayor a menor");
            else $(".sort-dropdown").text("High to low");
}

//initialize swiper
function initializeSwiper(){
    swiper = new Swiper('.swiper-container', {        
        pagination:  '.swiper-pagination',
        paginationClickable: true,
        paginationBulletRender: function (swiper, index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
        width: $('main').width(),
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 0,
    });
}

//get products filtered from server, save in local storage and show in results area
function getProductFilterFromServer(){
    var bodyJSON = '{'+
                    localStorage.kioskListBrandFilterChecked + ',' +
                    localStorage.kioskListSizeFilterChecked + ',' +
                    localStorage.kioskListGenderFilterChecked + ',' +
                    localStorage.kioskListClassFilterChecked + '}';
    $.ajax({
        type: "POST",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/ShowProductFilter/" + localStorage.storeNo + "/" + localStorage.flag3orless,
        // async: false,
        contentType: "application/json",
        data: bodyJSON,
        crossdomain: true,
        timeout: 10000,
        beforeSend: function(){
            // showLoadingResults(true);
            showPageElement(".loader-results",true);
        },
        complete: function(){
            // showLoadingResults(false);
            showPageElement(".loader-results",false);
        },
        success:function(result){
            var data = result.fProdList;                
            var productList = '{"ProductList":[';
            if (data.length >0) {
                localStorage.kioskCountProductFiltered = data.length;   

                $.each(data, function (index, value) {
                    var product = '{'+
                                    '"brandCode": "' + value.brandCode + '",' +     
                                    '"brandName": "' + value.brandName + '",' +
                                    '"colorCode": "' + value.colorCode + '",' +
                                    '"imageFile": "' + value.imageFile.replace(/\\/g,"\\\\") + '",' +
                                    '"price": "' + value.price + '",' +
                                    '"originalPrice": "' + (value.productPrice).toFixed(2) + '",' +
                                    '"styleCode": "' + value.styleCode + '",' +
                                    '"styleName": "' + value.styleName + '"' +
                                    '},';                               
                    productList = productList + product;  
                });                    
                productList = productList.substring(0, productList.length - 1);
                
            }      
            else{
                countProductFiltered = 0;
            }
            productList = productList + ']}';
            localStorage.kioskProductList = productList;   
            if(localStorage.kioskOrderResults == "")          
                showProductFilter("asc");
            else
                showProductFilter(localStorage.kioskOrderResults);

        
            resizeElement($('.swiper-wrapper'));  
        },
        error:function(error) {
            // alert("error");
        }
    });
}

//load product results saved in local storage and show in results area
function showProductFilter(option){
    $(".swiper-slide").remove();
    var productListObject = JSON.parse(localStorage.kioskProductList);
                  
    if (localStorage.kioskCountProductFiltered >0) {
        // showResultsArea(true);
        showPageElement(".results",true);
        initializeSwiper();
        setTimeout(function(){ showSortArea(true); }, 2000);  
        // showOrderOption(true);
        showPageElement(".float-right",true);
        showLogo(false);
        var countProductItem = 0;
        var countSwipe = 0;
        var countRowProduct = 0;
        var sizeData = localStorage.kioskCountProductFiltered;   
        var indexIni, indexEnd, increment,condition;

        //order from high to low price
        if(option=="desc"){
            indexIni = sizeData - 1;
            increment = -1;
            indexEnd = 0;
        }
        //order from low to high price
        else{
            indexIni = 0;
            increment = 1;  
            indexEnd = sizeData - 1;  
        }

        for (var i = indexIni; ; i = i + increment) {
            //add slide
            if(countProductItem % 8 == 0){                            
                var template = _.template($("#swipeTemplate").html());
                var html = template({
                    Class: "swiper-slide" + (countSwipe+1)
                });
                swiper.appendSlide(html);
                countSwipe++;
            }

            //add row products to slide
            if(countProductItem % 4 == 0){                            
                var template = _.template($("#rowProductTemplate").html());
                var html = template({
                    Class: "row-product" + (countRowProduct+1)
                });
                $(".swiper-slide" + countSwipe).append(html);
                countRowProduct++;
            }

            //add product to row product
            template = _.template($("#productItemTemplate").html());                       
            html = template({
                Class: "animated fadeIn product-" + (i+1),
                path: productListObject.ProductList[i].imageFile,
                styleCode: productListObject.ProductList[i].styleCode,
                styleName: productListObject.ProductList[i].styleName,
                brandCode: productListObject.ProductList[i].brandCode,
                brandName: productListObject.ProductList[i].brandName,
                price: productListObject.ProductList[i].price,
                originalPrice: productListObject.ProductList[i].originalPrice
            });
            $(".row-product"+countRowProduct).append(html);
            countProductItem++;
            //if all product has added to results area
            if(i == indexEnd){
                break;
            }
        }                                  
    }      
    else{
        showSortArea(false);
        // showResultsArea(false);}
        showPageElement(".results",false);
        // showOrderOption(false);
        showPageElement(".float-right",false);
        showLogo(true);
        // showNoResults(true);
        showPageElement(".notfound",true);
    }
    if(localStorage.current_lang=="es"){
        $(".txtStyleName").text("Estilo: ");
    }
}


//Clear all selected filters from local storage
function clearSelectedFilters(){
    localStorage.removeItem("kioskListBrandFilterChecked");
    localStorage.removeItem("kioskListSizeFilterChecked");
    localStorage.removeItem("kioskListGenderFilterChecked");
    localStorage.removeItem("kioskListClassFilterChecked");
}

//Save all selected filter to local storage
function saveSelectedFilters(){
    var listBrandFilterChecked = '"Brand":[' ;
    var listSizeFilterChecked = '"Size":[' 
    var listGenderFilterChecked = '"Gender":[' 
    var listClassFilterChecked = '"Class":[' 

    var countBrand = 0;
    $('.item-list-brand .menu-item.selected').each(function() {
        listBrandFilterChecked = listBrandFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countBrand++;
    });
    if(countBrand>0) listBrandFilterChecked = listBrandFilterChecked.substring(0, listBrandFilterChecked.length - 1);
    listBrandFilterChecked = listBrandFilterChecked + ']';

    var countSize = 0;
    $('.item-list-size .menu-item.selected').each(function() {
        listSizeFilterChecked = listSizeFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countSize++;
    });
    if(countSize>0) listSizeFilterChecked = listSizeFilterChecked.substring(0, listSizeFilterChecked.length - 1);
    listSizeFilterChecked = listSizeFilterChecked + ']';

    var countGender = 0;
    $('.item-list-gender .menu-item.selected').each(function() {
        listGenderFilterChecked = listGenderFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countGender++;
    });
    if(countGender>0) listGenderFilterChecked = listGenderFilterChecked.substring(0, listGenderFilterChecked.length - 1);
    listGenderFilterChecked = listGenderFilterChecked + ']';

    var countClass = 0;
    $('.item-list-class .menu-item.selected').each(function() {
        listClassFilterChecked = listClassFilterChecked + '{"codfFilter":"' + $(this).attr('data-value') + '"},';
        countClass++;
    });
    if(countClass>0) listClassFilterChecked = listClassFilterChecked.substring(0, listClassFilterChecked.length - 1);
    listClassFilterChecked = listClassFilterChecked + ']';

    localStorage.kioskListBrandFilterChecked = listBrandFilterChecked;
    localStorage.kioskListSizeFilterChecked = listSizeFilterChecked;
    localStorage.kioskListGenderFilterChecked = listGenderFilterChecked;
    localStorage.kioskListClassFilterChecked = listClassFilterChecked; 
}

//bring all available filters from server and show in filter sidebar
function getFiltersFromServer(){
    // showLoading(true);
    showPageElement(".loader",true);
    $.ajax({
        type: "GET",
        url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/GetFilter/" + localStorage.storeNo + "/" + localStorage.flag3orless,            
        async: false,
        contentType: "application/json",
        crossdomain: true,
        timeout: 10000,
        success: function (result) {
            //brand filters
            var data = result.Brand;
            var brandList = '{"BrandList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var brandFilter = '{'+
                                    '"codfFilter": "' + value.codfFilter + '",' +     
                                    '"nameFilter": "' + value.nameFilter + '"' +
                                    '},';                               
                    brandList = brandList + brandFilter;  
                });                    
                brandList = brandList.substring(0, brandList.length - 1);
                
            }   

            //size filters
            var data = result.Size;                
            var sizeList = '{"SizeList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var sizeFilter = '{'+
                                    '"codfFilter": "' + value.codfFilter + '",' +     
                                    '"nameFilter": "' + value.nameFilter + '"' +
                                    '},';                               
                    sizeList = sizeList + sizeFilter;  
                });                    
                sizeList = sizeList.substring(0, sizeList.length - 1);
                
            }   

            //gender filters
            var data = result.Gender;                
            var genderList = '{"GenderList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var genderFilter = '{'+
                                    '"codfFilter": "' + value.codfFilter + '",' +     
                                    '"nameFilter": "' + value.nameFilter + '"' +
                                    '},';                               
                    genderList = genderList + genderFilter;  
                });                    
                genderList = genderList.substring(0, genderList.length - 1);
                
            }  

            //class filters
            var data = result.Class;                
            var classList = '{"ClassList":[';
            if (data != null && data.length > 0) {

                $.each(data, function (index, value) {
                    var classFilter = '{'+
                                    '"codfFilter": "' + value.codfFilter + '",' +     
                                    '"nameFilter": "' + value.nameFilter + '"' +
                                    '},';                               
                    classList = classList + classFilter;  
                });                    
                classList = classList.substring(0, classList.length - 1);
                
            }  

            brandList = brandList + ']}';
            sizeList = sizeList + ']}';
            genderList = genderList + ']}';
            classList = classList + ']}';
            localStorage.kioskListBrandFilter = brandList;   
            localStorage.kioskListSizeFilter = sizeList;  
            localStorage.kioskListGenderFilter = genderList;  
            localStorage.kioskListClassFilter = classList;  
            showFilters();
        },
        error: function (error) {
            // alert(error);
        }
    });
}

//bring all available filters from server and show in filter sidebar
function showFilters(){
    var listBrandFilterObject = JSON.parse(localStorage.kioskListBrandFilter);
    var listSizeFilterObject = JSON.parse(localStorage.kioskListSizeFilter);
    var listGenderFilterObject = JSON.parse(localStorage.kioskListGenderFilter);
    var listClassFilterObject = JSON.parse(localStorage.kioskListClassFilter);
    // showLoading(true);
    showPageElement(".loader",true);
    //brand filters  
    var countBrand = Object.keys(listBrandFilterObject.BrandList).length  
    for (var i = 0; i < countBrand; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listBrandFilterObject.BrandList[i].codfFilter,
            ItemText: listBrandFilterObject.BrandList[i].nameFilter
        });
        $(".item-list-brand").append(html);
    }     

    // //size filters
    var countSize = Object.keys(listSizeFilterObject.SizeList).length;  
    for (var i = 0; i < countSize; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listSizeFilterObject.SizeList[i].codfFilter,
            ItemText: listSizeFilterObject.SizeList[i].nameFilter
        });
        $(".item-list-size").append(html);
    } 

    // //gender filters
    var countGender = Object.keys(listGenderFilterObject.GenderList).length;
    for (var i = 0; i < countGender; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listGenderFilterObject.GenderList[i].codfFilter,
            ItemText: listGenderFilterObject.GenderList[i].nameFilter
        });
        $(".item-list-gender").append(html);
    } 

    // //class filters
    var countClass = Object.keys(listClassFilterObject.ClassList).length;  
    for (var i = 0; i < countClass; i++) {
        var template = _.template($("#listItemTemplate").html());
        var html = template({
            ItemValue: listClassFilterObject.ClassList[i].codfFilter,
            ItemText: listClassFilterObject.ClassList[i].nameFilter
        });
        $(".item-list-class").append(html);
    } 
    // showLoading(false);
    showPageElement(".loader",false);
}

//show or hide main loader
function showLoading(option){
    if(option){  
        if($(".loader").hasClass("hide"))
            $(".loader").removeClass("hide").addClass("show");
        else
            $(".loader").addClass("show");
    }else{
        if($(".loader").hasClass("show"))
            $(".loader").removeClass("show").addClass("hide");
        else
            $(".loader").addClass("hide");
    }
}

//show or hide loader for product results
function showLoadingResults(option){
    if(option){  
        if($(".loader-results").hasClass("hide"))
            $(".loader-results").removeClass("hide").addClass("show");
        else
            $(".loader-results").addClass("show");
    }else{
        if($(".loader-results").hasClass("show"))
            $(".loader-results").removeClass("show").addClass("hide");
        else
            $(".loader-results").addClass("hide");
    }
}

//show or hide area to sort product results
function showSortArea(option){
    if(option){  
        if($(".sort-area").hasClass("opaque"))
            $(".sort-area").removeClass("opaque");
        // else
            // $(".sort-area").addClass("opaque");
    }else{
        if($(".sort-area").hasClass("opaque"))
            $(".sort-area").addClass("opaque");
        // else
            // $(".sort-area").addClass("opaque");
    }
}

//show or hide option to sort product results
function showOrderOption(option){
    if(option){  
        if($(".float-right").hasClass("hide"))
            $(".float-right").removeClass("hide").addClass("show");
        else
            $(".float-right").addClass("show");
    }else{
        if($(".float-right").hasClass("show"))
            $(".float-right").removeClass("show").addClass("hide");
        else
            $(".float-right").addClass("hide");
    }
}

//show or hide image logo
function showLogo(option){
    if(option){  
        $(".area-logo").show();
    }else{
        $(".area-logo").hide();
    }
}

//show or hide No Results text
function showNoResults(option){
    if(option){  
        if($(".notfound").hasClass("hide"))
            $(".notfound").removeClass("hide").addClass("show");
        else
            $(".notfound").addClass("show");
    }else{
        if($(".notfound").hasClass("show"))
            $(".notfound").removeClass("show").addClass("hide");
        else
            $(".notfound").addClass("hide");
    }
}

//show or hide Results area
function showResultsArea(option){
    if(option){  
        if($(".results").hasClass("hide"))
            $(".results").removeClass("hide").addClass("show");
        else
            $(".results").addClass("show");
    }else{
        if($(".results").hasClass("show"))
            $(".results").removeClass("show").addClass("hide");
        else
            $(".results").addClass("hide");
    }
}

//show or hide area to sort product results
function showClearFilter(option){
    if(option){  
        if($(".clear-filters").hasClass("hide"))
            $(".clear-filters").removeClass("hide").addClass("show");
        else
            $(".clear-filters").addClass("show");
    }else{
        if($(".clear-filters").hasClass("show"))
            $(".clear-filters").removeClass("show").addClass("hide");
        else
            $(".clear-filters").addClass("hide");
    }
}

//show or hide area to sort product results
function showFiltersMarked(option){
    if(option){  
        if($(".filters-marked").hasClass("hide"))
            $(".filters-marked").removeClass("hide").addClass("show");
        else
            $(".filters-marked").addClass("show");
    }else{
        if($(".filters-marked").hasClass("show"))
            $(".filters-marked").removeClass("show").addClass("hide");
        else
            $(".filters-marked").addClass("hide");
    }
}

//show or hide html element
function showPageElement(element,option){
    if(option){  
        if($(element).hasClass("hide"))
            $(element).removeClass("hide").addClass("show");
        else
            $(element).addClass("show");
    }else{
        if($(element).hasClass("show"))
            $(element).removeClass("show").addClass("hide");
        else
            $(element).addClass("hide");
    }
}

//load selected filters to show in sidebar
function setFilterSelected(){
    if(localStorage.kioskListBrandFilterChecked != undefined ||
        localStorage.kioskListSizeFilterChecked != undefined ||
        localStorage.kioskListGenderFilterChecked != undefined ||
        localStorage.kioskListClassFilterChecked != undefined){
        showLogo(false);
        
        //check brand selected filters
        var brandFilteredObject = JSON.parse("{" + localStorage.kioskListBrandFilterChecked + "}").Brand;            
        $(".item-list-brand .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < brandFilteredObject.length; i++) {
                var cod = brandFilteredObject[i].codfFilter
                if(itemValue == brandFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }
            }
        })

        //check size selected filters
        var sizeFilteredObject = JSON.parse("{" + localStorage.kioskListSizeFilterChecked + "}").Size;
        $(".item-list-size .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < sizeFilteredObject.length; i++) {
                var cod = sizeFilteredObject[i].codfFilter
                if(itemValue == sizeFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }                        
            }
        })

        //check gender selected filters
        var genderFilteredObject = JSON.parse("{" + localStorage.kioskListGenderFilterChecked + "}").Gender;
        $(".item-list-gender .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < genderFilteredObject.length; i++) {
                var cod = genderFilteredObject[i].codfFilter
                if(itemValue == genderFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }
            }
        })

        //check class selected filters
        var classFilteredObject = JSON.parse("{" + localStorage.kioskListClassFilterChecked + "}").Class;
        $(".item-list-class .menu-item").each(function(){
            var itemValue = $(this).attr('data-value');
            for (var i = 0; i < classFilteredObject.length; i++) {
                var cod = classFilteredObject[i].codfFilter
                if(itemValue == classFilteredObject[i].codfFilter){
                    $(this).addClass('selected');
                    addFilter($(this));
                }
            }
        })
    }
} 

//check if exists filters marked 
function checkFiltersMarked(){
    if($('.filters-marked').children().length>0){
        // showFiltersMarked(true);
        showPageElement(".filters-marked",true);
        setTimeout(function(){ showSortArea(true); }, 2000);        
        $('.area-logo').hide();
        $('.clear-filters').removeClass('hide').addClass('show animated fadeInRightBig');
    }else{
        // showClearFilter(false);
        showPageElement(".clear-filters",false);
        $('.clear-filters').removeClass('show').addClass('hide');
        if(localStorage.kioskCountProductFiltered==0){
            $('.area-logo').show();
            showPageElement(".results",false);
        }
    }
}

//if exists path image error, show no image
function handleError(image){
    image.src = '../img/imNoFound.jpg';
}

function resizeElement(element){
    element.width($('.swiper-slide').width());
    var resizeProduct = $('main').height() - $('.sort-area').height() - $('.filters-marked').height();
    
    $('.swiper-slide').height( resizeProduct );
    $('.img-product').height( $('.img-product').width());
}