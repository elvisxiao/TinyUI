var ZDate = require('./date');

var instance = function(eles, options){
	var eles = $(eles);
	eles.data('zDatepicker', options)
	eles.on('click', function(e){
		e.stopPropagation();
		new Datepicker(this, options);
	})
}

var initEvent = function(){
    $(function(){
        $('body')
        .off('click', '.zDatepicker')
        .on('click', '.zDatepicker', function(e){
            new Datepicker(this);
            e.stopPropagation();
        })
        .on('click', function(){
        	$('.zDatepickerWrap').hide()
        })
    })  
}
initEvent();

var Datepicker = function(target, options) {
	this.options = {
		min: '',
		max: '',
		theme: '',
		minView: '',
		views: ['Year', 'Month', 'Day']
	}

	this.hd = null;
	this.bd = null;
	this.target;
	this.ele;
	this.currDate; // 初始值
	this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	this.weeks = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
	this.queue = [];

	for(var key in options){
		this.options[key] !== undefined && (this.options[key] = options[key]);
	}
	if(this.options.minView){
		switch(this.options.minView){
			case 'Week':
				this.options.views = ['Year', 'Week'];
				break;
			case 'Year':
				this.options.views = ['Year'];
				break;
			case 'Month':
				this.options.views = ['Year', 'Month'];
				break;
			case 'Day':
				this.options.views = ['Year', 'Month', 'Day'];
				break;
			case 'Hour':
				this.options.views = ['Year', 'Month', 'Day', 'Hour'];
				break;
			case 'Minute':
				this.options.views = ['Year', 'Month', 'Day', 'Hour', 'Minute'];
				break;
			case 'Second':
				this.options.views = ['Year', 'Month', 'Day', 'Hour', 'Minute', 'Second'];
				break;
		}
	}

	var self = this;

	self._render = function(){
		self._setDateToQueue(self.currDate);

		self._renderYear();
		self._renderMonth();
		self._renderWeek();
		self._renderDay();
		self._renderHour();
		self._renderMinute();
		self._renderSecond();

		self._setDefault();
	}	

	self._setDefault = function(){
		var showView = self.options.views[self.options.views.length - 1];
		if(self.options.views.length > 3){
			showView = self.options.views[2];
		}
		self.ele.find('.zDatepickerView').hide();
		self._setActive();
		self.ele.find('.view' + showView).show();
		self.queue.pop();
		self._setHdContent(); 
	}

	self._setActive = function(){
		self.ele.find('.active').removeClass('active');
		if(self.options.minView === 'Week'){
			var year =  self.currWeek.toString().slice(0, 4);
			if(year == self.queue[0]){
				self.ele.find('.viewWeek>span:contains(' + self.currWeek.toString().slice(4) + ')').addClass('active');
			}
			return;
		}

		var year = self.currDate.getFullYear();
		var month = self.currDate.getMonth();
		var date = self.currDate.getDate();
		var hour = self.currDate.getHours();
		var minute = self.currDate.getMinutes();
		var second = self.currDate.getSeconds();
		
		self.ele.find('.viewYear>span:contains(' + year + ')').addClass('active');
		if(year == self.queue[0]){
			self.ele.find('.viewMonth>span[value="' + self.currDate.getMonth() + '"]').addClass('active');
		}
		if(self.queue.length > 0 && month == self.queue[1]){
			self.ele.find('.viewDay>span:contains(' + date + ')').filter(function(index){
				var span = $(this);
				return span.html() == date && !span.attr('class');
			}).addClass('active');
		}
		if(self.queue.length > 1 && date == self.queue[2]){
			self.ele.find('.viewHour>span:contains(' + hour + ')').addClass('active');
		}
		if(self.queue.length > 2 && hour == self.queue[3]){
			self.ele.find('.viewMinute>span:contains(' + minute + ')').addClass('active');
		}
		if(self.queue.length > 3 && minute == self.queue[4]){
			self.ele.find('.viewSecond>span:contains(' + second + ')').addClass('active');
		}
	}

	self._renderYear = function(year){
		if(!year){
			year = self.queue[0] || self.currDate.getFullYear();
		}
		var startYear = parseInt(year / 10) * 10 - 1;

		this.hd.find('.zDatepickerHdContent').html( startYear +  ' - ' + (startYear + 9) );
		var viewYear = this.bd.find('.viewYear').html('');
		if(viewYear.length === 0){
			viewYear = $('<div class="viewYear zDatepickerView"></div>');
		}
		for(var i = 0; i < 12; i++){
			viewYear.append('<span>' + (startYear + i) + '</span>');
		}
		viewYear.find('>span:first-child, >span:last-child').addClass('old');
		this.bd.append(viewYear);
	}

	self._renderMonth = function(){
		var viewMonth = self.ele.find('.viewMonth');
	
		if(viewMonth.length > 0){
			self._setActive();
			return;
		}
		viewMonth = $('<div class="viewMonth zDatepickerView"></div>');
		self.months.map(function(item, i){
			viewMonth.append('<span value="' + i + '">' + item + '</span>');
		})
		this.bd.append(viewMonth);
	}

	self._renderWeek = function(){
		var viewWeek = self.ele.find('.viewWeek');
		
		if(viewWeek.length > 0){
			self._setActive();
			return;
		}
		weekCount = ZDate.getWeeksByYear(this.year);
		var viewWeek = $('<div class="viewWeek zDatepickerView"></div>');
		for(var i = 1; i <= weekCount; i ++){
			var strWeek = i;
			i < 10 && ( strWeek = '0' + i.toString() );
			viewWeek.append('<span>' + strWeek + '</span>');
		}
		viewWeek.append('<label class="timeInfo"></label>');
		this.bd.append(viewWeek);
		self._setTimeInfo(self.currWeek);
	}

	self._renderDay = function(){
		var viewDay = self.ele.find('.viewDay');
		viewDay.find('>span').remove();
		if(viewDay.length === 0){
			viewDay = $('<div class="viewDay zDatepickerView"></div>').appendTo(self.bd);
			var weekLine = $('<p></p>').appendTo(viewDay);
			this.weeks.map(function(item, i){
				weekLine.append('<span>' + item + '</span>');
			})
		}

		var date = new Date(self.queue[0], self.queue[1] + 1, 0).getDate();
		var day = new Date(self.queue[0], self.queue[1], 1).getDay();
		var lastMonthDate = new Date(self.queue[0], self.queue[1], 0).getDate();

		for(day --; day >= 0; day --){
			viewDay.append('<span class="old">' + (lastMonthDate - day) + '</span>');
		}

		for(var i = 1; i <= date; i ++){
			viewDay.append('<span>' + i + '</span>');
		}

		var count = viewDay.find('>span').length;
		var i = 0;
		for(;count < 42; count ++){
			i++;
			viewDay.append('<span class="new">' + i + '</span>');
		}
	}

	self._renderHour = function(){
		if(self.ele.find('.viewHour').length > 0){
			self._setActive();
			return;
		}
		var viewHour = $('<div class="viewHour zDatepickerView"></div>');

		for(var i = 0; i < 24; i ++){
			var str = i.toString();
			if(i < 10){
				str = '0' + str;
			}
			viewHour.append('<span value="' + str + '">' + str + ':00</span>');
		}
		this.bd.append(viewHour);
	}

	self._renderMinute = function(){
		if(self.ele.find('.viewMinute').length > 0){
			self._setActive();
			return;
		}
		var viewMinute = $('<div class="viewMinute zDatepickerView"></div>');

		for(var i = 1; i < 60; i ++){
			var str = i.toString();
			if(i < 10){
				str = '0' + str;
			}
			viewMinute.append('<span>' + str + '</span>');
		}
		viewMinute.append('<span class="zDatepickerInfo">Minutes</span>');
		this.bd.append(viewMinute);
	}

	self._renderSecond = function(){
		if(self.ele.find('.viewSecond').length > 0){
			self._setActive();
			return;
		}
		var viewSecond = $('<div class="viewSecond zDatepickerView"></div>');

		for(var i = 1; i < 60; i ++){
			var str = i.toString();
			if(i < 10){
				str = '0' + str;
			}
			viewSecond.append('<span>' + str + '</span>');
		}

		viewSecond.append('<span class="zDatepickerInfo">Seconds</span>');
		this.bd.append(viewSecond);
	}

	self.setPosition = function(){
		var position = self.target.offset();
		var left = position.left;
		var top = position.top;

		var eleTop = top + self.target.outerHeight() + 8;
		var win = $(window);

		self.ele.addClass('bottom').removeClass('right');
		if( eleTop + self.ele.height() > win.outerHeight() + win.scrollTop() ){
			self.ele.removeClass('bottom');
			eleTop = top - self.ele.outerHeight() - 8;
		}
		if( left + self.ele.outerWidth() > win.scrollLeft() + win.width() ){
			left = left - self.ele.outerWidth() + self.target.outerWidth();
			self.ele.addClass('right');
		}
		this.ele.css({
			left: left,
			top: eleTop
		})
	}

	self._setHdContent = function(lastVal){
		var content = "";
		var prexMap = {
			Year: '',
			Month: '-',
			Day: '-',
			Week: '',
			Hour: ' ',
			Minute: ':',
			Second: ':'
		}
		if(self.queue.length > 0){
			self.queue.map(function(item, i){
				var view = self.options.views[i];
				
				var item = parseInt(item);
				if(view === 'Month'){
					item ++;
				}
				if(item < 10){
					item = '0' + item.toString();
				}
				content += prexMap[view] + item;
			})
		}
		else{
			if(!lastVal){
				lastVal = self.currDate.getFullYear();
			}
			var startYear = parseInt(parseInt(lastVal) / 10) * 10;
			content = startYear.toString() + ' - ' + (startYear + 9);
		}

		if(content.length === 13){
			content += ':00';
		}

		self.hd.find('.zDatepickerHdContent').html(content);
		self._setActive();

		return content;
	}

	self._setVal = function(){
		var val = self._setHdContent();

		self.target.val(val);
		self.ele.hide();
		self.target.change()
	}

	self._nextView = function(){
		var clickSpan = $(this);
		var slcVal = clickSpan.attr('value') || clickSpan.html();
		if(self.options.views[self.queue.length] === 'Day'){
			if(clickSpan.hasClass('old')){
				var month = parseInt(self.queue.pop());
				month --;
				if(month < 0){
					month = 11;
					var year = parseInt(self.queue.pop());
					year --;
					self.queue.push(year);
				}
				self.queue.push(month);
			}
			else if(clickSpan.hasClass('new')){
				var month = parseInt(self.queue.pop());
				month ++;
				if(month > 11){
					month = 0;
					var year = parseInt(self.queue.pop());
					year ++;
					self.queue.push(year);
				}
				self.queue.push(month);
			}
		}

		self.queue.push(slcVal);
		if(self.queue.length === self.options.views.length){
			self._setVal();
			return;
		}
		var view = self.options.views[self.queue.length];
		self.ele.find('.zDatepickerView').hide();
		if(view === 'Day'){
			self._renderDay();
		}
		self.ele.find('.view' + view).show();
		self._setHdContent();
		
		self._setActive();
    	!self.ele.hasClass('bottom') && self.setPosition();
	}

	self._prevView = function(){
		if(self.queue.length < 1){
			return;
		}

		var prevView = self.options.views[self.queue.length - 1];

		self.ele.find('.zDatepickerView').hide();
		self.ele.find('.view' + prevView).show();
		if(prevView === 'Year'){
			self._renderYear();
		}
    	self._setHdContent(self.queue.pop());
		
		self._setActive();
    	!self.ele.hasClass('bottom') && self.setPosition();
	}

	self._getDateFromQueue = function(){
		var date = new Date(self.queue[0], self.queue[1], self.queue[2]);
		var arr = ['setHours', 'setMinutes', 'setSeconds'];
		self.queue.slice(3).map(function(item, i){
			date[arr[i]](item);
		})

		return date;
	}

	self._setDateToQueue = function(date){
		if(self.options.minView !== 'Week'){
			date = new Date(date);
			var nowVal = {
				Year: date.getFullYear(),
				Month: date.getMonth(),
				Day: date.getDate(),
				Week: ZDate.getWeekString(date).toString().slice(4),
				Hour: date.getHours(),
				Minute: date.getMinutes(),
				Second: date.getSeconds()
			}

			var length = self.queue.length;
			if(length === 0){
				length = 3;
			}

			self.queue = [];
			self.options.views.map(function(item, i){
				if(i < length){
					self.queue.push(nowVal[item]);
				}
			})
		}
		else{	
			self.queue[0] = self.currWeek.toString().slice(0, 4);
			self.queue[1] = self.currWeek.toString().slice(4);
		}
		
	}

	self._setTimeInfo = function(weekStr){
		if(!weekStr){
			weekStr = ZDate.getWeekString(new Date());
		}
		var startDate = ZDate.getStartDateByWeek(weekStr).getTime();
		var endDate = startDate + 6 * 24 * 60 * 60000;
		var label = self.bd.find('.viewWeek>.timeInfo');
		if(label.length === 0){
			label = $('<label class="timeInfo"></label>').appendTo(self.bd.find('.viewWeek'));
		}
		label.html('<i class="icon-clock2"></i>' + ZDate.format(startDate, 'mmdd') + ' - ' + ZDate.format(endDate, 'mmdd'));
	}

	self._bindEvents = function(){
		self.ele.off()
		.on('click', function(e){
	    	e.stopPropagation();
		})
		.on('click', '.zDatepickerHdContent', self._prevView)
	    .on('click', '.zDatepickerView>span', self._nextView)
	    .on('click', '.zDatepickerHd>i', function(e){
	    	var i = $(this);
	    	var hdContent = self.hd.find('.zDatepickerHdContent');
	    	var content = hdContent.text();
	    	var currView = self.options.views[self.queue.length];
	    	var eleView = self.ele.find('.view' + currView);

	    	switch(currView){
	    		case 'Year':
	    			year = parseInt(content.slice(0, 4));
		    		i.hasClass('iPrev')? (year -= 10) : (year += 10);
		    		self._renderYear(year);
		    		return;
		    	case 'Month': 
		    		year = parseInt(self.queue[0]);
		    		i.hasClass('iPrev')? (year --) : (year ++);
		    		hdContent.html(year);
		    		self.queue[0] = year;
		    		self._setActive();
		    		return;
		    	case 'Week':
		    		year = parseInt(self.queue[0]);
		    		i.hasClass('iPrev')? (year --) : (year ++);
		    		hdContent.html(year);
		    		self.queue[0] = year;
		    		self._setActive();

		    		var weekCount = ZDate.getWeeksByYear(year);
		    		if(weekCount === 52){
		    			eleView.find('span:contains(53)').remove();
		    		}
		    		else if(eleView.find('span:contains(53)').length === 0){
		    			eleView.append('<span>53</span>');
		    		}
		    		return;
		    	case 'Day':
		    		var month = parseInt(self.queue[1]);
		    		var year = parseInt(self.queue[0]);
		    		i.hasClass('iPrev')? (month --) : (month ++);
		    		if(month === -1){
		    			year --;
		    			month = 11;
		    		}
		    		if(month === 12){
		    			year ++;
		    			month = 0;
		    		}
		    		self.queue[0] = year;
		    		self.queue[1] = month;
		    		self._setHdContent();
		    		self._renderDay();
		    		return; 
		    	case 'Hour':
		    		var date = self._getDateFromQueue().getTime();
		    		var oneDay = 24 * 60 * 60000;
		    		i.hasClass('iPrev') && (oneDay = -1 * oneDay);
		    		date += oneDay;
		    		self._setDateToQueue(date);
		    		self._setHdContent();
		    		return;
		    	case 'Minute': 
		    		var date = self._getDateFromQueue().getTime();
		    		var oneHour = 60 * 60000;
		    		i.hasClass('iPrev') && (oneHour = -1 * oneHour);
		    		date += oneHour;
		    		self._setDateToQueue(date);
		    		self._setHdContent();
		    		return;
		    	case 'Second': 
		    		var date = self._getDateFromQueue().getTime();
		    		var oneMinute = 60000;
		    		i.hasClass('iPrev') && (oneMinute = -1 * oneMinute);
		    		date += oneMinute;
		    		self._setDateToQueue(date);
		    		self._setHdContent();
		    		return;
	    	}
	    })
	    .on('mouseenter', '.zDatepickerBd>.viewWeek>span', function(){
	    	var weekString = self.queue[0] + this.innerText;
	    	self._setTimeInfo(weekString);
	    })
	    .on('mouseout', '.zDatepickerBd>.viewWeek>span', function(){
	    	self._setTimeInfo(self.currWeek);
	    })
	}

	self.init = function(target){
		self.target = $(target);

		self.ele = $('.zDatepickerWrap');
		if(self.ele.length === 0){
			self.ele = $('<div class="zDatepickerWrap bottom"><div class="zDatepickerHd"><i class="iPrev">&lt;</i><span class="zDatepickerHdContent"></span><i class="iNext">&gt;</i></div><div class="zDatepickerBd"></div></div>').appendTo('body');
		}
		self.ele.attr('data-theme', self.options.theme);
		
		self._bindEvents();
		self.ele.show();
		
		self.hd = self.ele.find('.zDatepickerHd');
		self.bd = self.ele.find('.zDatepickerBd');
		self.currDate = new Date();
		var strDate = self.target.val().replace(/-/g, '/');
		if(strDate){
			self.currDate = new Date(strDate);
		}
		if(self.options.minView === 'Week'){
			self.currWeek = self.target.val() || ZDate.getWeekString(new Date());
		}
		self._render();

		self.setPosition();
		// self._setActive();
	}

	self.init(target);
}


module.exports = instance;
