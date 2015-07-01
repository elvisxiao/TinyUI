var ZDate = require('./date');

var instance = function(ele){
	var ele = $(ele);
	ele.on('click', function(){
		_setPopEle(ele);
	})
    
    ele.on('blur', function(){
        _removePopEle(this);
    })
}

var _removePopEle = function(target){
	// var ele = $(target);
	// ele.data('zTarget') && ele.data('zTarget').remove && ele.data('zTarget').remove();
	// ele.data('zTarget', null);
}

var _setPopEle = function(target){
	var ele = $(target);

	var elePop = $('<div class="zWeekpickerWrapBottom"><div class="zWeekpickerHd"><i class="iPrev">&lt;</i><span class="zWeekpickerHdContent">2015</span><i class="iNext">&gt;</i></div><div class="zWeekpickerBd"></div></div>');
	
	_showViewWeek(null, elePop.find('.zWeekpickerBd'));
	elePop.appendTo('body');
	var position = ele.offset();
	var left = position.left;
	var top = position.top;
	top = ele.offset().top + ele.outerHeight() + 8;
	if(top + elePop.height() > $(document).height()){
		elePop.removeClass('zWeekpickerWrapBottom').addClass('zWeekpickerWrap');
		top = top - elePop.outerHeight() - 8;
	}
	if(left + elePop.outerWidth() > $(document).scrollLeft() + $('body').width()){
		left = left - elePop.outerWidth() + ele.outerWidth();
		elePop.removeClass('zWeekpickerWrap').addClass('zWeekpickerWrapRight');
	}
	elePop.css({
		left: left,
		top: top
	})
	.on('click', '.zWeekpickerHdContent', function(){
    	_showViewYear(this.innerHTML, this.parentNode);
    })
    .on('click', '.zWeekpickerBd>span', function(){
    	var weekpickerBody = $(this).parent();
    	if(weekpickerBody.hasClass('zWeekViewYear')){
    		_showViewWeek(this.innerHTML, this.parentNode);
    	}
    }).
    on('click', '.zWeekpickerHd>i', function(){
    	var i = $(this);
    	var hd = i.parent();
    	var hdContentEle = hd.find('.zWeekpickerHdContent');
    	var year = hdContentEle.html();
    	if(year.length === 4){
    		year = parseInt(year);
    		i.hasClass('.iPrev')? year -- : year ++;
    		hdContentEle.html(year);
    	}
    	else{
    		year = parseInt(year.slice(0, 4)) + 5;
    		i.hasClass('.iPrev')? (year -= 10) : (year += 10);
    		
    	}
    });

	ele.data('zTarget', elePop);
}

var _showViewWeek = function(year, bd){
	bd = $(bd);
	var content = '';
	var currWeek = ZDate.getWeekString(new Date()).toString();

	if(!year){
		year = currWeek.slice(0, 4);
	}

	bd.prev('.zWeekpickerHd').find('.zWeekpickerHdContent').html(year);
	for(var i = 1; i < 53; i++){
		var val = i.toString();
		if(val < 10){
			val = '0' + val;
		}
		content += '<span>' + val + '</span>';
	}
	bd.html(content).removeClass('zWeekViewYear');
	
	bd.find('>span:contains(' + currWeek.slice(4) + ')').addClass('active');
}

var _showViewYear = function(year, hd){
	if(year.length > 4){
		return;
	}

	hd = $(hd);
	year = parseInt(year);
	var spanYear = (year - 5) +  ' - ' + (year + 5);
	hd.find('.zWeekpickerHdContent').html(spanYear);

	var content = '';
	for(var i = year -6; i < year + 6; i++){
		content += '<span>' + i + '</span>';
	}

	var bd = hd.next('.zWeekpickerBd').html(content).addClass('zWeekViewYear');
	bd.find('>span:first-child, >span:last-child').addClass('weekOld');
	bd.find('>span:contains(' + year + ')').addClass('active');
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('click', '.zWeekpicker')
        .on('click', '.zWeekpicker', function(e){
            _setPopEle(this);
        })
        // .off('blur', 'zWeekpicker')
        // .on('blur', '.zWeekpicker', function(){
        //     _removePopEle(this);
        // })
        // .on('click', '.zWeekpickerHdContent', function(){
        // 	_showViewYear(this.innerHTML, this.parentNode);
        // })
        // .on('click', '.zWeekpickerBd>span', function(){
        // 	var weekpickerBody = $(this).parent();
        // 	if(weekpickerBody.hasClass('zWeekViewYear')){
        // 		_showViewWeek(this.innerHTML, this.parentNode);
        // 	}
        // })
    })  
}

initEvent();

module.exports = instance;
