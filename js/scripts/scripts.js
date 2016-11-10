$(document).ready(function(){

	$('.itemName').click(function(){		
		// sidebar expand items when you click any category
		if($(this).hasClass('expand'))
			$(this).removeClass('expand');
		else{
			$('.itemName').removeClass('expand');
			$(this).addClass('expand');
		}

	});

	$('.menu-item').click(function(){
		// add or remove selected class when you click a filter from any category

		if($(this).hasClass('selected')){
			removeFilter($(this));
			$(this).removeClass('selected');
		}else{
			addFilter($(this));
			$(this).addClass('selected');			
		}

		checkFiltersMarked();

	});

	$('.dropdown-menu li').click(function(){
		// add or remove selected class when you click a filter from any category
		if($('.sort-dropdown').hasClass('lowToHigh')){
			$('.sort-dropdown').removeClass('lowToHigh').addClass($(this).attr('class')).text($(this).text());
		}else{
			$('.sort-dropdown').removeClass('highToLow').addClass($(this).attr('class')).text($(this).text());
		}		
	});


	$('.swiper-wrapper').width($('main').width());


	$(document).on("click", ".filter",function(){
		// actions when you click a filter in filter section
		var data = $(this).attr('data-value');
		$('.menu-item').each(function() {  
	    if ( $(this).attr('data-value') == data ) {
	    		$(this).click();
	    }
	  });

	});

});

function addFilter( element ){
	var random = Math.floor((Math.random()*3)+1);  //random de 1 a 3
	$('.filters-marked').append(
		"<div class='filter filter-"+ random + " animated rubberBand' data-value='"+ element.attr('data-value') +"'>" + element.text() + "</div>"
	);
}

function removeFilter(element){
	$('.filter').each(function() {  
    if ( element.attr('data-value') == $(this).attr('data-value') ) {
    		$(this).remove();
    }
  });
}

function addProductCartItem(){
	if(!existsProductCart($(".txtStyleCode").text(),$(".txtColorCode").text())){
		var product = '{"Product":';
	    localStorage.countProductCartItem++;   

	    product += '{'+    
	                    '"brandName": "' + $(".txtBrand").text() + '",' +
	                    '"colorCode": "' + $(".txtColorCode").text() + '",' +
	                    '"imageFile": "' + $(".main-img").attr("src").replace(/\\/g,"\\\\") + '",' +
	                    '"price": "' + $(".txtRetailPrice").text() + '",' +
	                    '"size": "' + $(".sort-dropdown").text() + '",' +
	                    '"styleCode": "' + $(".txtStyleCode").text() + '",' +
	                    '"styleName": "' + $(".txtStyle").text() + '"' +
	                    '}}';             
	    localStorage["cartItemProduct"+localStorage.countProductCartItem] = product; 
	    return true;
	}
	else{
		if (localStorage.current_lang == "es") 
			swal("El producto ya ha sido agregado!");
		else
			swal("Product has been already added!");
		return false;
	}
}

function existsProductCart(searchStyleCode,searchColorCode){
	for (var i = 1; i <= localStorage.countProductCartItem; i++) {
		var productObject = JSON.parse(localStorage["cartItemProduct"+i]);
		if(productObject.Product.styleCode == searchStyleCode 
			&& productObject.Product.colorCode == searchColorCode)
			return true;
	}
	return false;
}