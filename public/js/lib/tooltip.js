var dropdown = require('./dropdown');

var Tooltip = function(ele, content, theme){
    if(!ele){
        initEvent();
        return;
    }
    var ele = $(ele);
    if(!content){
        return;
    }
    if(ele.data('zTarget')){
        return;
    }
    var content = $('<div class="zTooltipWrap"></div>').append(content);
    if(theme){
        content.addClass(theme);
    }
    dropdown.show(ele, '', content, 'up');
    ele.on('blur', function(){
        dropdown.remove(this);
    })
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('mouseenter', '.zTooltip')
        .off('mouseout', '.zTooltip')
        .on('mouseenter', '.zTooltip', function(e){
            e.preventDefault();
            var ele = $(this);
            var title = ele.attr('title');
            if(title){
                ele.attr('data-zTooltipTitle', title);
                ele.removeAttr('title');
            }
            else{
                title = ele.attr('data-zTooltipTitle');
            }

            if(!title){
                return;
            }   
            Tooltip(ele, title);
        })
        .on('mouseout', '.zTooltip', function(){
            dropdown.remove(this);
        })
    })  
}

initEvent();

module.exports = Tooltip;
