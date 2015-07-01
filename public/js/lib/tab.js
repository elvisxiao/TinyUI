var instance = function(){

}

var initEvent = function(){
    $(function(){
    	$('.zTab').each(function(){
    		var tab = $(this);
    		if(tab.find('.zTabHd>a.active').length === 0){
    			var a = tab.find('.zTabHd>a:eq(0)').addClass('active');
    			tab.find(a.attr('href')).addClass('active');
    		}
    	})
        $('body')
        .off('click', '.zTab')
        .on('click', '.zTab .zTabHd>a', function(e){
        	e.preventDefault();
            var ele = $(this);
            if(ele.hasClass('.active')){
            	return;
            }

            tab = ele.parents('.zTab');
            tab.find('.zTabHd>a, .zTabItem').removeClass('active');
            ele.addClass('active');
            
            var id = ele.attr('href');
            tab.find(id).addClass('active');
        })
    })  
}

initEvent();

module.exports = instance;
