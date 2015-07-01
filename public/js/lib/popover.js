var instance = function(ele, title, content, direct){
	var ele = $(ele);
	if(arguments.length == 2){
		content = arguments[1];
		title = '';
	}

    if(!content){
        return;
    }
    if(ele.data('zTarget')){
        return;
    }
    _setPopEle(ele, title, content, direct);
    ele.on('blur', function(){
        _removePopEle(this);
    })
}

var _removePopEle = function(target){
	var ele = $(target);
	ele.data('zTarget') && ele.data('zTarget').remove && ele.data('zTarget').remove();
	ele.data('zTarget', null);
}

var _setPopEle = function(target, title, content, direct){
	var ele = $(target);
	var elePop = $('<div class="zPopoverWrap"><div class="zPopoverContent">' + content + '</div></div>');
	if(title){
		elePop.prepend('<div class="zPopoverTitle">' + title + '</div>');
	}
	elePop.appendTo('body');
	var position = ele.offset();
	var left = position.left;
	var top = position.top;
	// left = left + ele.outerWidth() / 2 - elePop.outerWidth() / 2;
	top = top - elePop.outerHeight() - 8;
	if(top < $(document).scrollTop() || direct === 'down'){
		elePop.removeClass('zPopoverWrap').addClass('zPopoverWrapBottom');
		top = ele.offset().top + ele.outerHeight() + 8;
	}
	if(left + elePop.outerWidth() > $(document).scrollLeft() + $('body').width()){
		left = left - elePop.outerWidth() + ele.outerWidth();
		elePop.removeClass('zPopoverWrap').addClass('zPopoverWrapRight');
	}
	elePop.css({
		left: left,
		top: top
	})
	ele.data('zTarget', elePop);
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('click', '.zPopover')
        .on('click', '.zPopover', function(e){
            var ele = $(this);
            title = ele.attr('data-title');
            content = ele.attr('data-content');

        	console.log(content);
            if(!content){
                return;
            }

            _setPopEle(ele, title, content);
        })
        .off('blur', 'zPopover')
        .on('blur', '.zPopover', function(){
            _removePopEle(this);
        })
    })  
}

initEvent();

module.exports = instance;
