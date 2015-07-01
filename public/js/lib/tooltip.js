var Tooltip = function(ele, content){
    var ele = $(ele);
    if(!content){
        return;
    }
    if(ele.data('zTarget')){
        return;
    }
    _setPopEle(ele, content);
    ele.on('blur', function(){
        _removePopEle(this);
    })
}

var _removePopEle = function(target){
    var ele = $(target);
    ele.data('zTarget') && ele.data('zTarget').remove && ele.data('zTarget').remove();
    ele.data('zTarget', null);
}

var _setPopEle = function(target, content){
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
    elePop.data('zTarget', ele);
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('mouseenter', '.zTooltip')
        .off('mouseout', '.zTooltip')
        .on('mouseenter', '.zTooltip', function(e){
            console.log('init popover');
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

            _setPopEle(ele, title);
        })
        .on('mouseout', '.zTooltip', function(){
            _removePopEle(this);
        })
    })  
}

initEvent();

module.exports = Tooltip;
