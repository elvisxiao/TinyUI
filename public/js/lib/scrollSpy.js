var ui = require('./ui');

var instance = function(ele, animateClass){
	var ele = $(ele);
	ele.addClass('zScrollSpy').attr('data-scrollspy', animateClass);
}

var initEvent = function(){
    $(function(){
    	var currentTop = $(window).scrollTop();
        $(window).on('scroll', function(e){
    		var scrollTop = $(window).scrollTop();
        	var moveDown = scrollTop > currentTop;
    		currentTop = scrollTop;
        	if(!moveDown){
        		return;
        	}
        	$('.zScrollSpy[data-scrollspy]').each(function(){
        		var ele = $(this);
        		var isOn = ui.isOnScreen(ele);
        		var animateClass = ele.attr('data-scrollspy');

        		isOn && ele.addClass(animateClass);
        		!isOn && ele.removeClass(animateClass);
        	})
        })

		//导航部分的滚动监听
    	$('.zScrollSpyNav').each(function(){
    		var firstItem = $(this).find('.zScrollSpyNavItem:eq(0)');
    		var activeId = firstItem.attr('id');
    		$('[href="#' + activeId + '"]').addClass('zScrollSpyNavActive');
    	})

    	var scroll = function(scrollDiv){
    		var siblingsItems = scrollDiv.find('.zScrollSpyNavItem');

			for(var i = 0; i < siblingsItems.length; i ++){
				var item = $(siblingsItems[i]);
				var id = item.attr('id');
				$('[href="#' + id + '"]').removeClass('zScrollSpyNavActive');
				// var top = item.position().top;
				// var height = item.outerHeight();
				// console.log(top + ': ' + height);
				// if(top < 15 && top > -1.0 * height){
    // 				$('[href="#' + id + '"]').addClass('zScrollSpyNavActive');
				// 	break;
				// }
				// else if(top > 15){
				// 	item = $(siblingsItems[i - 1]);
				// 	var activeId = item.attr('id');
    // 				$('[href="#' + activeId + '"]').addClass('zScrollSpyNavActive');
				// 	break;
				// }
				if(ui.isOnScreen(item)){
					var activeId = item.attr('id');
					$('[href="#' + activeId + '"]').addClass('zScrollSpyNavActive');
					break;
				}
			}
			if(i === siblingsItems.length){
				var item = $(siblingsItems[siblingsItems.length - 1]);
				var id = item.attr('id');
				$('[href="#' + id + '"]').addClass('zScrollSpyNavActive');
			}
			else{
				for(i = i + 1; i < siblingsItems.length; i ++){
					var item = $(siblingsItems[i]);
					var id = item.attr('id');
					$('[href="#' + id + '"]').removeClass('zScrollSpyNavActive');
				}
			}
    	}

		$('.zScrollSpyNav').scroll(function(e){
			e.preventDefault();
			var scrollDiv = $(this);
			scroll(scrollDiv);
		})
		$(window).scroll(function(){
			$('.zScrollSpyNav').each(function(){
				scroll($(this));
			})
		})
    })  
}

initEvent();

module.exports = instance;
