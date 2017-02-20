$(document).ready(function(){
    var data;

    //show or hide options for 3orless or Kiosk
    if(localStorage.flag3orless == 1){
        $(".right-options").show();
        $(".btn-add-continue").show();
        $(".btn-add-finish").show();
    }
    else {
        $(".right-options").hide();
        $(".btn-add-continue").hide();
        $(".btn-add-finish").hide();
    }

	$(".item-count").text(localStorage.countProductCartItem);
    getProductSelect();    

    //cart button redirects to cart items screen
    $(".btn-cart").click(function(){
        window.location = "cart-items.html";
    });

    //home button redirects to home screen
    $(".btn-home").click(function(){
        window.location = "index.html";
    });

    //home button redirects to home screen
    $(".btn-back").click(function(){
        window.history.back();
    });
    $(".btn-add-continue").click(function(){
        //if product has added successfully to cart item, redirects to search screen
        if(addProductCartItem())
            window.location = "search3orless.html";
        else{
            //stay in product detail screen
        }      
    });

    $(".btn-add-finish").click(function(){
        if(addProductCartItem())
            window.location = "cart-items.html";
        else{
            //stay in product detail screen
        }  
    });

    $(".btn-CheckStores").click(function(){
        if (localStorage.current_lang == "es") 
                          swal({
                          title: "Otras Tiendas",
                          text: "<ul class='storesArea'>"+
            "<li class='row store'>"+
              "<div class='col-xs-9 center-text'>"+
                "<div class='text-left'><span class='txtStoreName storeName'>NiceKicks Name Store 1</span></div>"+
                "<div class='text-left'><span class='lblAddress'>Address:</span><span class='txtAddress'> 555 Jarvis Dr.</span></div>"+
                "<div class='text-left'><span class='lblPhone'>Phone:</span><span class='txtPhone'> 408 - 132 - 987</span></div>"+
              "</div>"+
              "<div class='col-xs-3 center-text'>"+
                "<div class='text-right'>"+
                  "<span class='txtStockOtherStore'>Stock:</span>"+
                  "<span class='lblStockOtherStore'>5</span>"+
                "</div>"+
              "</div>"+
            "</li>"+
            "<li class='row store'>"+
              "<div class='col-xs-9 center-text'>"+
                "<div class='text-left'><span class='txtStoreName storeName'>NiceKicks Name Store 1</span></div>"+
                "<div class='text-left'><span class='lblAddress'>Address:</span><span class='txtAddress'> 555 Jarvis Dr.</span></div>"+
                "<div class='text-left'><span class='lblPhone'>Phone:</span><span class='txtPhone'> 408 - 132 - 987</span></div>"+
              "</div>"+
              "<div class='col-xs-3 center-text'>"+
                "<div class='text-right'>"+
                  "<span class='txtStockOtherStore'>Stock:</span>"+
                  "<span class='lblStockOtherStore'>5</span>"+
                "</div>"+
              "</div>"+
            "</li>"+
          "</ul>",
                          confirmButtonColor: "#8fbf75",
                          confirmButtonText: "¡Ok, Genial!",          
                          html: true,
                          closeOnConfirm: false
                        },
                        function(isConfirm){
                          showLoading(false);         
                          window.location = "menu.html";
                        });
                      else        
                        swal({
                          title: "Registry Confirmation",
                          text: "Thanks for your subscription.",
                          type: "success",
                          confirmButtonColor: "#8fbf75",
                          confirmButtonText: "Ok, Cool!",         
                          closeOnConfirm: false
                        },
                        function(isConfirm){
                          showLoading(false);         
                          window.location = "menu.html";
                        });
    })

	//show or hide main loader
	function showLoading(option){
	    if(option){  
	        if($(".loader").hasClass("hide"))
	            $(".loader").removeClass("hide").addClass("show");
	        else
	            $(".loader").addClass("show");
	    }else{
	        if($(".loader").hasClass("show"))
	            $(".loader").removeClass("show").addClass("hide").delay(5000);
	        else
	            $(".loader").addClass("hide").delay(5000);
	    }
	}

	//when page is loaded hide loaders
    $(window).on("load", function() {
       showLoading(false);
    });


    function getProductSelect(){
    	showLoading(true);
        var tempColorSelected = localStorage.resultsProductColorCodeSelected.replace("/","-");
        $.ajax({
            type: "GET",
            url: "http://" + localStorage.serverId + "/WS3orlessFiles/S3orLess.svc/NPRODUCT/findProductBySC-Color/" + localStorage.resultsProductStyleCodeSelected + "/" + tempColorSelected +"/" + localStorage.storeNo ,            
            async: false,
            contentType: "application/json",
            crossdomain: true,
            timeout: 10000,
            success: function (result) {
                //Product Selected                
                data = result.findNProductByStyleCodeAndColorResult; 
                if (data != null) {

                	//PRODUCT SELECT
                	//items
                    $(".txtProductDetail").text(data.shortDescr);
                	$(".txtBrand").text(data.brandName);
                    $(".txtStyleCode").text(data.styleCode);
                	$(".txtStyle").text(data.styleName);
                    $(".txtColorCode").text(data.colorCode);
                	$(".txtRetailPrice").text("$" + data.price);
                    $(".txtOriginalPrice").text("$" + (data.productPrice).toFixed(2));
                	$(".txtOnHand").text(data.listStock[0]);
                	// 

                	//Images
                	$(".main-img").attr("src",data.listImages[0]);
                    $(".view-1").attr("src",data.listImages[0]);
                    $(".view-2").attr("src",data.listImages[1]);
                    $(".view-3").attr("src",data.listImages[2]);
                    $(".view-4").attr("src",data.listImages[3]);

                    var listclones = "<li class='behind view-2'><img src='"+data.listImages[1]+"'></li> <li class='behind view-3'><img src='"+data.listImages[2]+"'></li> <li class='behind view-4'><img src='"+data.listImages[3]+"'></li>"; 
                    // Clones
                    // $('.list-clones').append(listclones);

                    //Size
                    $(".size-dropdown").text(data.listSize[0]);
                    for (var i = 0; i < data.listSize.length; i++) {
                		var template = _.template($("#listItemTemplate").html());
	                    var html = template({
	                       ItemText:data.listSize[i],
	                      // sizeCode:data.listSize[i]
                          sizeCode: i
                    });
                    $(".listSize").append(html);
                	}

                    //suggested Product
                    if(data.suggestedProduct.length > 0){
                        showMessage(false);
                    }else{
                        showMessage(true);
                    }

                	 var countProductItem = 0;
                	for (var i = 0; i < data.suggestedProduct.length; i++) {
                		var template = _.template($("#productItemTemplate").html());
	                    var html = template({
	                   	Class: "product-" + (countProductItem+1),
			            path: data.suggestedProduct[i].imageFile,
		                styleCode: data.suggestedProduct[i].styleCode,
		                colorCode: data.suggestedProduct[i].colorCode,
		                styleName: data.suggestedProduct[i].styleName,
		                brandCode: data.suggestedProduct[i].brandCode,
		                brandName: data.suggestedProduct[i].brandName,
		                price: data.suggestedProduct[i].price,
                        productPrice: (data.suggestedProduct[i].productPrice).toFixed(2),

                    });
	                    countProductItem++;
                        
                    $(".related-products").append(html);
                	}

                    $(".related-products").addClass("items-"+ countProductItem);
                }              

            },
            error: function (error) {
                // alert(error);
            }
        });
    }
    //show or hide image logo
    function showMessage(option){
        if(option){  
            $(".no-related-products").show();
        }else{
            $(".no-related-products").hide();
        }
    }

    $(".view").click(function(){
        // if($(".main-img").hasClass('flipInX')){

            $(".main-img").remove();
            $('.figureMainImg').append("<img src='"+this.src+"' alt='Main Img' class='main-img ' onerror='handleError(this)'>");
            setSizeImages();

            // $('.list-clones li').removeClass('animateBehind');
            // var mainView = $('.list-clones li.front');
            // setTimeout(function(){
            //     mainView.removeClass('front').addClass('animateBehind');          
            //     $('.list-clones li').addClass('behind');            
            //     var viewToChanges = $(this).attr('class').split(' ')[1];
            //     $('.list-clones .'+viewToChanges).addClass('front').removeClass('behind');
            // },1000);


        // }else
        //     $(".main-img").addClass('animated flipInX'); 

    });

$(".size-item").click(function(){
		//  $(".sort-dropdown").text($(this).attr("data-value"));
        $(".size-dropdown").text($(this).text());
        $(".txtOnHand").text(data.listStock[$(this).attr("data-value")]);
});


$(".btn-CheckStores").click(function(){
    $("#modalOtherStores").modal("show");
});


//save index of product selected and redirect to product detail screen
$(document).on("click",".product",function(){
	showLoading(true);
	var className = this.className;
	localStorage.resultsProductColorCodeSelected = $(this).find(".colorCode").attr("data-value");
	localStorage.resultsProductStyleCodeSelected = $(this).find(".styleName").attr("data-value");
	window.location = "product-detail.html"; 
    });


});

function setSizeImages(){
    var sizeMainImg = $('.mainImg').height();
    var margin = 20;

    $('.list-clones').height(sizeMainImg-margin).width(sizeMainImg-margin);
    $('.view').height((sizeMainImg-margin*2)/2).width((sizeMainImg-margin*2)/2);

    $('.main-img').height($('.mainImg').height()-margin);
}

function handleError(image){
    image.src = '../img/imNoFound.jpg';
}

$(window).load(function(){
    setSizeImages();
    resizeElement();
});

function resizeElement(){
    $('.img-product').height($('.product').width()).width($('.product').width());
    // $('.img-product').width( $('.img-product').height());
}