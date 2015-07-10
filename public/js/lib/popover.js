var dropdown = require('./dropdown');

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
    content = $('<div class="popoverWrap"></div>').append(content);
    dropdown.show(ele, title, content, 'up');
    ele.on('blur', function(){
        dropdown.remove(this);
    })
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('click', '.zPopover')
        .on('click', '.zPopover', function(e){
            var ele = $(this);
            title = ele.attr('data-title');
            content = ele.attr('data-content');

            if(!content){
                return;
            }

            instance(ele, title, content, 'up');
        })
        .off('blur', '.zPopover')
        .on('blur', '.zPopover', function(){
            dropdown.remove(this);
        })
    })  
}

initEvent();

module.exports = instance;
