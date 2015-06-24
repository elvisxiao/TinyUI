$(function(){
	var activeText = $('[data-active').attr('data-active');
	$('.zSidebar').find('a:contains("' + activeText + '")').each(function(i, item){
		if(item.innerText.indexOf(activeText) === 0){
			$(this).addClass('active');
		}
	});
})


