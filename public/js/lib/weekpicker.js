var ZDate = require('./date');

var instance = function(ele, theme){
	var ele = $(ele);
	ele.on('click', function(e){
		e.stopPropagation();
		new Weekpicker(this, theme);
	})
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('click', '.zWeekpicker')
        .on('click', '.zWeekpicker', function(e){
            new Weekpicker(this, this.getAttribute('data-theme'));
            e.stopPropagation();
        })
        .on('click', function(){
        	$('.zWeekpickerHd').parent().hide()
        })
    })  
}
initEvent();

var Weekpicker = function(target, theme) {
	this.hd = null;
	this.bd = null;
	this.view; //week or year
	this.target;
	this.ele;
	this.year; // 当前的年
	this.weekString; //初始的weekString

	var self = this;

	self.render = function(){
		self.view === 'week'? self._renderWeek() : self._renderYear();
	}

	self.setPosition = function(){
		var position = self.target.offset();
		var left = position.left;
		var top = position.top;

		var eleTop = top + self.target.outerHeight() + 8;
		var win = $(window);

		self.ele.addClass('zWeekpickerWrapBottom').removeClass('zWeekpickerWrap').removeClass('zWeekpickerWrapRight');
		if( eleTop + self.ele.height() > win.outerHeight() + win.scrollTop() ){
			self.ele.removeClass('zWeekpickerWrapBottom').addClass('zWeekpickerWrap');
			eleTop = top - self.ele.outerHeight() - 8;
		}
		if( left + self.ele.outerWidth() > win.scrollLeft() + win.width() ){
			left = left - self.ele.outerWidth() + self.target.outerWidth();
			self.ele.removeClass('zWeekpickerWrap').addClass('zWeekpickerWrapRight');
		}
		this.ele.css({
			left: left,
			top: eleTop
		})
	}

	self._renderWeek = function(){
		this.hd.find('.zWeekpickerHdContent').html(this.year);
		var weekCount = ZDate.getWeeksByYear(this.year);
		var text = '';
		for(var i = 1; i <= weekCount; i ++){
			var strWeek = i;
			i < 10 && ( strWeek = '0' + i.toString() );
			text += '<span>' + strWeek + '</span>';
		}
		this.bd.html(text).removeClass('zWeekViewYear');;
		if(this.weekString.indexOf( this.year.toString() ) === 0){
			this.bd.find('>span:contains(' + this.weekString.slice(4) + ')').addClass('active');
		}
		self._setTimeInfo(this.weekString);

		this.view = 'week';
	}

	self._setTimeInfo = function(weekStr){
		var startDate = ZDate.getStartDateByWeek(weekStr).getTime();
		var endDate = startDate + 6 * 24 * 60 * 60000;
		var label = self.bd.find('>.timeInfo');
		if(label.length === 0){
			label = $('<label class="timeInfo"></label>').appendTo(self.bd);
		}
		label.html('<i class="icon-clock2"></i>' + ZDate.format(startDate, 'mmdd') + ' - ' + ZDate.format(endDate, 'mmdd'));
	}

	self._renderYear = function(){
		var year = parseInt(this.year);
		var startYear = parseInt(year / 10) * 10;

		this.hd.find('.zWeekpickerHdContent').html( startYear +  ' - ' + (startYear + 9) );
			
		var text = '';
		for(var i = 0; i < 9; i++){
			text += '<span>' + (startYear + i) + '</span>';
		}

		this.bd.html(text).addClass('zWeekViewYear');

		this.bd.find('>span:first-child, >span:last-child').addClass('weekOld');
		
		this.bd.find('>span:contains(' + self.weekString.slice(0, 4) + ')').addClass('active');

		this.view = 'year';
	}

	self._bindEvents = function(){
		self.ele.off()
		.on('click', function(e){
	    	e.stopPropagation();
		})
		.on('click', '.zWeekpickerHdContent', function(){
	    	self.view === 'week' && self._renderYear();
	    })
	    .on('click', '.zWeekpickerBd>span', function(){
	    	if(self.view === 'year'){
	    		self.year = this.innerHTML;
	    		self._renderWeek();
	    	}
	    	else{
	    		self.target.val(self.year + this.innerHTML).change();
	    		self.ele.hide();
	    	}
	    })
	    .on('click', '.zWeekpickerHd>i', function(e){
	    	var i = $(this);
	    	var hdContent = self.hd.find('.zWeekpickerHdContent');
	    	var year = hdContent.text();

	    	if(self.view === 'week'){
	    		year = parseInt(year);
	    		i.hasClass('iPrev')? year -- : year ++;
	    		self.year = year;
	    		self._renderWeek();
	    	}
	    	else{
	    		year = parseInt(year.slice(0, 4));
	    		i.hasClass('iPrev')? (year -= 10) : (year += 10);
	    		self.year = year + 5;
	    		self._renderYear();
	    	}
	    })
	    .on('mouseenter', '.zWeekpickerBd>span', function(){
	    	if(self.view === 'year'){
	    		return;
	    	}

	    	var weekString = self.year + this.innerText;

	    	self._setTimeInfo(weekString);
	    })
	    .on('mouseout', '.zWeekpickerBd>span', function(){
	    	if(self.view === 'year'){
	    		return;
	    	}
	    	self._setTimeInfo(self.weekString);
	    })
	}

	self.init = function(target, theme){
		self.target = $(target);

		self.ele = $('.zWeekpickerHd').parent();
		if(self.ele.length === 0){
			self.ele = $('<div class="zWeekpickerWrapBottom"><div class="zWeekpickerHd"><i class="iPrev">&lt;</i><span class="zWeekpickerHdContent"></span><i class="iNext">&gt;</i></div><div class="zWeekpickerBd"></div></div>').appendTo('body');
		}
		
		self.ele.attr('data-theme', theme || '')
		
		self._bindEvents();
		self.ele.show();
		
		self.hd = self.ele.find('.zWeekpickerHd');
		self.bd = self.ele.find('.zWeekpickerBd');
		self.view = 'week';
		self.weekString = self.target.val() || ZDate.getWeekString(new Date()).toString();
		self.year = self.weekString.slice(0, 4);
		self.render();
		self.setPosition();
	}

	self.init(target, theme);
}


module.exports = instance;
