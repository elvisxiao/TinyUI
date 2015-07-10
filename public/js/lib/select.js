var dropdown = require('./dropdown');

var instance = function(ele){
    initSelect(ele);
}

var initSelect = function(ele){
    if(!ele){
        ele = $('.zSlc');
    }

    $('.zSlc').each(function(){
        var slc = $(this);
        var divSlc = $('<div class="zSlcWrap"></div>');
        var ipt = $('<input class="zIpt" readonly/>').appendTo(divSlc);
        var position = slc.position();
        divSlc.css({
            position: 'relative',
            display: slc.css('display'),
            width: slc.outerWidth(),
            height: slc.outerHeight()
        })
        slc.after(divSlc);
        var initVal = slc.val();
        if(initVal.join){
            initVal = initVal.join(', ');
        }
        ipt.val(initVal || "");
        slc.hide();
    });
}


var initEvent = function(){
    $(function(){
        initSelect();
        
        $('body')
        .on('click', function(){
            dropdown.remove($('.zSlcBd').parents('.zDropdown'));
        })
        .off('click', '.zSlcWrap>input.zIpt')
        .on('click', '.zSlcWrap>input.zIpt', function(e){
        	e.stopPropagation();
            var ele = $(this);
            if(ele.data('zTarget') && ele.data('zTarget').length > 0){
                dropdown.remove();
            	return;
            }

            dropdown.remove();

            var slcWrap = ele.parent();
            var slc = slcWrap.prev('.zSlc');
            var content = $('<div class="zSlcBd"></div>');

            slc.find('option, optgroup').each(function(){
            	var item = $(this);
                var p = $('<p data-val="' + item.val() + '">' + item.html() + '</p>').appendTo(content);
                if(this.nodeName === "OPTGROUP"){
                    p.removeAttr('data-val').attr('disabled', 'disabled').attr('slcGroup', 'true').html(item.attr('label'));
                }
            	else{
                    if(item.attr('disabled')){
                        p.attr('disabled', item.attr('disabled'));
                    }
                    if(item.attr('selected')){
                        p.attr('selected', item.attr('selected'));
                    }
                }
            });

            dropdown.show(ele, '', content[0].outerHTML);
        })
        .off('click', '.zSlcBd>p')    
        .on('click', '.zSlcBd>p', function(e){
        	e.stopPropagation();
        	var p = $(this);
        	if(p.attr('disabled')){
        		return;
        	}

        	var ipt = $(this).parents('.zDropdown').data('zTarget');
        	var slc = ipt.parent().prev('.zSlc');
        	
        	var slcVal = p.val();
        	var slcOption = slc.find('option[value="' + slcVal + '"]');
        	if(!slcVal){
        		slcVal = p.html();
        		slcOption = slc.find('option:contains("' + slcVal + '")').filter(function(){
        			return this.innerHTML == slcVal;
        		});
        	}
        	
        	if(!slc.attr('multiple')){
                ipt.val(slcVal);
                slc.find('option').attr('selected', false);
                slcOption.attr('selected', true);
				dropdown.remove(ipt);
        	}
        	else{
        		if(p.attr('selected')){
        			p.removeAttr('selected');
        			slcOption[0].selected = false;
                    slcOption.attr('selected', false);
        		}
        		else{
        			p.attr('selected', 'selected');
        			slcOption.attr('selected', true);
        		}
                var vals = slc.val();
                if(vals){
                    vals = vals.join(', ');
                }
                ipt.val(vals || '')
        	}
        })
    })  
}

initEvent();

module.exports = instance;
