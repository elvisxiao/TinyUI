instance = function(options){
	var target = $(options.target);
	
}

var _removePopEle = function(target){
	var ele = $(target);
	ele.data('zTarget') && ele.data('zTarget').remove && ele.data('zTarget').remove();
	ele.data('zTarget', null);
}

var _setPopEle = function(target, content){
	console.log('我被调用了');
	console.log(target)
	var ele = $(target);
	var elePop = $('<div class="zTooltipTitle">' + content + '</div>').appendTo('body');
	var position = ele.offset();
	var left = position.left;
	var top = position.top;
	left = left + ele.outerWidth() / 2 - elePop.outerWidth() / 2;
	top = top - elePop.outerHeight() - 8;
	if(top < $(document).scrollTop()){
		elePop.removeClass('zTooltipTitle').addClass('zTooltipTitleBottom');
		top = ele.offset().top + ele.outerHeight() + 8;
	}
	elePop.css({
		left: left,
		top: top
	})
	ele.data('zTarget', elePop);
}

// initEvent();

module.exports = Tooltip;
