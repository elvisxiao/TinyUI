(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* @file 用于Rest结构的Ajax交互，提交的数据均为application/json类型
* @author Elvis
* @version 0.1 
*/ 

/**
* 用于Rest结构的Ajax交互，提交的数据均为application/json类型
* @exports oc.ajax

* @example
* oc.ajax.get('/list', function(res){
    console.log(res);
}, function(res){
    console.log(res.responseText);
})

* @example
* oc.ajax.post('/add', {id: 1, date: '2015-01-01'}, function(res){
    console.log(res);
})

*/
var Ajax = {}

/**
@inner 内部方法
@param {string} url - ajax的url地址
@param {string} method - post、get、put、delete
@param {function} cbOk - 200响应的回调方法，会将返回的response作为参数传入
@params {function} cbError - 其他返回的响应事件，会将返回的response作为参数传入
*/
Ajax._send = function(url, method, data, cbOk, cbError){
    var self = this;
    var params = {
        url: url,
        type: "GET",
        headers: {
            "Content-Type": "application/json",
            // "Accept": "application/json"
        }
    }
    if(method){
        params.type = method;
    }
    if(data){
        params.data = JSON.stringify(data);
    }

    params.success = function(res){
        cbOk(res);
    }
    if(cbError){
        params.error = function(res){
            cbError(res);
        }
        // $.ajax(params, cbOk, cbError).done(cbOK).fail(cbError);
    }
    else{
        params.error = self.error;
        // $.ajax(params, cbOk, cbError).done(cbOk).fail(self.error);
    }

    $.ajax(params);
},

/**
* Get方法
* @param {string} url - ajax的url地址
* @param {function} cbOk - 200响应的回调方法，会将返回的response作为参数传入
* @params {function} cbError - 其他返回的响应事件，会将返回的response作为参数传入，可省略，省略时走error方法
*/
Ajax.get = function(url, cbOk, cbError) {
	this._send(url, null, null, cbOk, cbError);
}

/**
* Post方法
* @param {string} url - ajax的url地址
* @param {object} data - ajax的主题内容
* @param {function} cbOk - 200响应的回调方法，会将返回的response作为参数传入
* @params {function} cbError - 其他返回的响应事件，会将返回的response作为参数传入，可省略，省略时走error方法
*/
Ajax.post = function(url, data, cbOk, cbError) {
	this._send(url, "post", data, cbOk, cbError);
}

/**
* Put方法
* @param {string} url - ajax的url地址
* @param {object} data - ajax的主题内容
* @param {function} cbOk - 200响应的回调方法，会将返回的response作为参数传入
* @params {function} cbError - 其他返回的响应事件，会将返回的response作为参数传入，可省略，省略时走error方法
*/
Ajax.put = function(url, data, cbOk, cbError) {
	this._send(url, "put", data, cbOk, cbError);
}

/**
* Delete方法
* @param {string} url - ajax的url地址
* @param {function} cbOk - 200响应的回调方法，会将返回的response作为参数传入
* @params {function} cbError - 其他返回的响应事件，会将返回的response作为参数传入，可省略，省略时走error方法
*/
Ajax.delete = function(url, cbOk, cbError) {
	this._send(url, "delete", null, cbOk, cbError);
}

/**
* Ajax出错时，通用处理方法
* @param {object} res - HTTP Response,Ajax是服务器端返回的响应
*/
Ajax.error = function(res){
    oc.dialog.tips('Request error: ' + res.responseText);
    console.log('Request error:', res);
}

module.exports = Ajax;


},{}],2:[function(require,module,exports){
module.exports = (function(){
	$(function(){
		$('body').on('click', '.zCollapse .zPanelHd', function(e){
			e.preventDefault();

			var panel = $(this).parent();
			if(panel.hasClass('active')){
				panel.removeClass('active');
			}
			else{
				var group = panel.attr('data-group');
				if(group){
					$('.zCollapse[data-group="' + group + '"]').removeClass('active');
				}
				panel.addClass('active');
			}
		})
	})
	
})();

},{}],3:[function(require,module,exports){
 
/**
* @file 用于Javascript Date类型的扩展
* @author Elvis
* @version 0.1 
*/ 

/**
* 用于Javascript Date类型的扩展
* @exports oc.date

* @example
* // returns 2015年01月01日
* oc.date.format('2015-01-01', 'yyyy年mm月dd日')
* @example
* // returns 一天的毫秒数（24 * 60 * 60000）
* oc.date.compare('2015-01-02', '2015-01-01')
*/
var ZDate = {};

/**
* 根据传入格式，格式化输出时间字符串
* @param {date} date 时间值 - 可以为Timespane，或者'2015/01/01'、'2015-01-01'或其他可new Date()的时间字符串
* @param {string} format 格式化输出方式 - yyyy年，mm月，dd天，hh小时，MM分钟，ss秒，ms，分秒
* @returns {string} 格式化后的字符串
*/
ZDate.format = function(date, format){
    if(date.toString().indexOf('-') > 0){
        date = date.toString().replace(/-/g, '/');
    }

    var reg = {
        yyyy: 'year',
        hh: 'hours',
        mm: 'month',
        dd: 'date',
        hh: 'hours',
        MM: 'minites',
        ss: 'seconds',
        ms: 'millSeconds'
    }
    
    var date = new Date(date);
    var model = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        hours: date.getHours(),
        minites: date.getMinutes(),
        seconds: date.getSeconds(),
        millSeconds: date.getMilliseconds()
    }

    if(!format){
        return model.year + '-' + model.month + '-' + model.date;
    }

    for(var key in reg){
        var param = reg[key];
        var val = model[param];
        if(val.toString().length < 2){
            val = '0' + val.toString();
        }
        format = format.replace(key, val);
    }

    return format;
}

/**
* 比较时间大小，返回date1 - date2得到的timespane
* @param {date} date1 - 时间被减数: 可以为Timespane，或者'2015/01/01'、'2015-01-01'或其他可new Date()的时间字符串
* @param {date}  date2 - 时间减数: 可以为Timespane，或者'2015/01/01'、'2015-01-01'或其他可new Date()的时间字符串
* @returns {number} date1 - date2得到的timespane
*/
ZDate.compare = function(date1, date2){
    if(typeof date1 == "string"){
        date1 = date1.replace(/-/g, '/');
    }
    if(typeof date2 == "string"){
        date2 = date2.replace(/-/g, '/');
    }

    var date1 = new Date(date1).getTime();
    var date2 = new Date(date2).getTime();

    return date1 - date2;
}   

/**
* 根据传入的年，获取该年一共有多少周
* @param {number} year 四位的年（2015）
* @returns {number} 这一年一共有多少周，（52/53）
*/
ZDate.getWeeksByYear = function(year){
    var ret = 52;

    var year = parseInt(year + "");
    
    var has53Years = [1994,2000,2005,2011,2016,2022,2028,2033,2039,2044,2050,2056,2061,2067,2072,2078,2084,2089,2095,2101,2107,2112,2118,2124,2129,2135,2140,2146,2152,2157,2163,2168,2174,2180,2185,2191,2196,2203,2208,2214,2220,2225,2231,2236,2242,2248,2253,2259,2264,2270,2276,2281,2287,2292,2298,2304,2310,2316,2321,2327,2332,2338,2344,2349,2355,2360,2366,2372,2377,2383,2388,2394];
    
    if($.inArray(year, has53Years) !== -1){
        ret ++;
    }

    return ret;
}

/**
* 根据传入的date字符串或者timespan，返回该天在这一年中的第几周中：201406 - 2015年06周
* @param {object} date 传入的date字符串（2014-12-12或者2014/12/12)，或者timespan，默认值为JS当天
* @returns {string} 该天在这一年中的第几周中，如：201406 - 2015年06周
*/
ZDate.getWeekString = function(date) {
    if (!date) {
        date = new Date();
    }
    if (typeof date === 'string') {
        if(date.indexOf('-') > -1){
            date = date.replace(/-/g, '/');
        }
        else{
            var year = date.slice(0, 4);
            var month = date.slice(4, 6);
            var day = date.slice(6);
            date = year + '/' + month + '/' + day;
        }
    }
    date = new Date(date);

    if (date.getMonth() == 11 && date.getDate() > 20) {
        var anotherDay = new Date(date);
        anotherDay.setDate(anotherDay.getDate() + 6 - anotherDay.getDay());

        if (anotherDay.getFullYear() > date.getFullYear()) {
            return anotherDay.getFullYear() * 100 + 1;
        }
    }
    var firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    var day = firstDayOfYear.getDay();
    firstDayOfYear.setDate(8 - firstDayOfYear.getDay());

    if (firstDayOfYear > date) {
        return date.getFullYear() * 100 + 1;
    }
    var week = Math.floor((date - firstDayOfYear) / (1000 * 60 * 60 * 24 * 7));

    return date.getFullYear() * 100 + week + 2;
}

/**
* 根据传入的date字符串或者timespan，返回该天在这一年中的第几周中：201406 - 2015年06周
* @param {string} week 传入的周字符串，格式为:201510，代表2015年的第十周
* @returns {object} 该周的起始时间值
*/
ZDate.getStartDateByWeek = function(week) {
    if (!week) {
        return '';
    }

    if (typeof week === 'string') {
        week = parseInt(week);
    }

    var year = Math.floor(week / 100);
    var w = week % 100;
    var weekDate = new Date(year, 0, 1);

    weekDate.setDate((w - 1) * 7 + 1 - weekDate.getDay());

    return weekDate;
}

/**
* 根据传入的周，获取下一周
* @param {string} week 传入的周字符串，格式为:201510，代表2015年的第十周
* @returns {string} 该周的下一周
*/
ZDate.getNextWeek = function(week) {
    if (typeof week === 'string') {
        week = week.replace(/-/g, '');
        week = parseInt(week);
    }
    var year = Math.floor(week / 100);
    var w = week % 100;
    if (w < 52) {
        return year * 100 + w + 1;
    } 
    if (w == 53) {
        return (year + 1) * 100 + 1;
    } 
 
    if (this.getWeeksByYear(year) == 52) {
        return (year + 1) * 100 + 1;
    } 

    return year * 100 + w + 1;
}


/**
* 周选择器，类似与日期选择控件一样，用来选择周，如201523代表2015年第23周
* @param {object} ipt 输入周的输入框对象或者jquery选择器
*/
ZDate.weekPicker = function(ipt){
    var ipt = $(ipt);
    var initVal = $.trim(ipt.val());

    var reanderTable = function(){
        var table = $('<table class="zWeekPicker"></table>');
        var thead = $('<thead></thead>').appendTo(table);
        var curr = new Date();
        if(!initVal){
            initVal = ZDate.getWeekString(curr).toString();
        }
        var year = initVal.slice(0, 4);
        var week = initVal.slice(4);
        
        thead.append('<tr><th colspan="100"><i class="icon-arrow-left"></i><span class="spanYear">' + year + '</span><i class="icon-arrow-right"></i></th></tr>');

        var tbody = $('<tbody></tbody>').appendTo(table);

        var weekCount = ZDate.getWeeksByYear(year);

        var tr = $('<tr></tr>').appendTo(tbody);
        for(var i = 0; i < weekCount; i++){
            if(i % 7 === 0){
                tr = $('<tr></tr>').appendTo(tbody);
            }
            var str = (i + 1).toString();
            if(i < 9){
                str = '0' + str;
            }
            tr.append('<td>' + str + '</td>')
        }
       
        tbody.find('td:contains(' + week + ')').addClass('active');

        var weekStart = ZDate.getStartDateByWeek(year + week);

        var weekEnd = weekStart.getTime() + 6 * 24 * 60 * 60000;
        weekEnd = ZDate.format(weekEnd, 'mmdd');
        weekStart = ZDate.format(weekStart, 'mmdd');
        tbody.find('tr:last-child').append('<td colspan="10" class="zWeekPickerTag"><i class="icon-clock2"></i><span>' + weekStart + ' - ' + weekEnd + '</span></td>');

        table.on('click', 'thead i', function(e){
            var i = $(this);
            var eleYear = i.parent().find('.spanYear');
            var year = parseInt(eleYear.text());
            if(i.hasClass('icon-arrow-left')){
                year --;
            }
            else{
                year ++;
            }
            weekCount = ZDate.getWeeksByYear(year);
            if(weekCount == 52){
                table.find('td:contains(53)').remove();
            }
            else if(table.find('td:contains(53)').length === 0){
                // table.find('tbody tr:last-child').append('<td>53</td>');
                $('<td>53</td>').insertBefore(table.find('td.zWeekPickerTag'));
            }
            eleYear.html(year);
        })
        .on('mouseenter', 'tbody td:not(.zWeekPickerTag)', function(){
            var thisWeek = this.innerHTML;
            var weekStart = ZDate.getStartDateByWeek(year + thisWeek);
            var weekEnd = weekStart.getTime() + 6 * 24 * 60 * 60000;
            weekEnd = ZDate.format(weekEnd, 'mmdd');
            weekStart = ZDate.format(weekStart, 'mmdd');
            tbody.find('td.zWeekPickerTag span').html(weekStart + ' - ' + weekEnd);
        })
        .on('mouseleave', 'tbody', function(){
            var weekStart = ZDate.getStartDateByWeek(year + week);
            var weekEnd = new Date(weekStart).getTime() + 6 * 24 * 60 * 60000;
            weekEnd = ZDate.format(weekEnd, 'mmdd');
            weekStart = ZDate.format(weekStart, 'mmdd');
            
            tbody.find('td.zWeekPickerTag span').html(weekStart + ' - ' + weekEnd);
        })
        .on('click', function(e){
            e.stopPropagation();
        })

        $('body').on('click', function(){
            table.hide();
        })
        table.appendTo('body');

        return table;
    }

    var setTablePosition = function(ipt){
        var ele = $('.zWeekPicker');
        if(ele.length === 0){
            ele = reanderTable();
        }
        var position = ipt.position();
        var val = $.trim(ipt.val());
        if(val && val.length === 6){
            var year = val.slice(0, 4);
            var week = val.slice(4);

            ele.find('.spanYear').html(year);
            ele.find('td.active').removeClass('active');
            ele.find('td:contains(' + week + ')').addClass('active');
        }
        ele.css({
            'left': position.left,
            'top': position.top + ipt.outerHeight(),
            'display': 'block'
        })
        
        ele.off('click', 'tbody td:not(.zWeekPickerTag)').on('click', 'tbody td:not(.zWeekPickerTag)', function(){
            ele.hide();
            var year = ele.find('.spanYear').text();
            var week = $(this).html();
            var text = year + week
            ipt.val(text);
            
            ipt.change();
            // ev = document.createEvent("HTMLEvents");  
            // ev.initEvent("change", false, true);  
            // ipt[0].dispatchEvent(ev);  
        })
    }

    ipt = $(ipt);

    ipt.on('click', function(e){
        e.stopPropagation();
        setTablePosition(ipt);
    })
}   


module.exports = ZDate;
},{}],4:[function(require,module,exports){
module.exports = {
    show: function(target, title, content, defaultDirect) {
        var target = $(target);
        if(target.data('zTarget')){
            return;
        }
        var elePop = $('<div class="zDropdown"><div class="zDropdownBd"></div></div>');
        
        elePop.find('.zDropdownBd').append(content);
        if(title){
            var hd = $('<div class="zDropdownHd"></div>').append(title);
            elePop.prepend(hd);
        }

        elePop.appendTo('body');
        this._setPosition(target, elePop, title, defaultDirect);
        elePop.data('zTarget', target);
        target.data('zTarget', elePop);
    },

    remove: function(ele){
        if(!ele){
            ele = $('.zDropdown');
        }
        else{
            ele = $(ele);
            if(!ele.hasClass('zDropdown')){
                ele = ele.data('zTarget');
            }
        }

        if(ele && ele.each){
            ele.each(function(){
                var one = $(this);
                var target = one.data('zTarget');
                one.remove();
                one.data('zTarget', null);
                target && target.data('zTarget', null);
            })
        }
    },

    _setPosition: function(target, elePop, hasTitle, defaultDirect){
        var position = target.offset();
        var left = position.left;
        var top = position.top;
        var win = $(window);

        var origin = {
            upTop: top - elePop.outerHeight() - 8,
            downTop: top + target.outerHeight() + 8,
            leftLeft: left,
            rightLeft: left - elePop.outerWidth() + target.outerWidth()
        }

        //设置左边距离
        var targetLeft = origin.leftLeft;

        if(defaultDirect === "right" && origin.rightLeft > win.scrollLeft() ){
            targetLeft = origin.rightLeft;
            elePop.addClass('zDropdownRight');
        }
        else if( left + elePop.outerWidth() > win.scrollLeft() + win.width() ){
            targetLeft = origin.rightLeft;
            elePop.addClass('zDropdownRight');
        }

        //设置顶部距离
        var targetTop = origin.downTop;
        if(defaultDirect === "up" && origin.upTop > win.scrollTop()){
            targetTop = origin.upTop;
            elePop.addClass('zDropdownUp');
        }
        else if((targetTop + elePop.height() > win.outerHeight() + win.scrollTop()) ){ //下面位置不够放时，尝试放到上面去
            targetTop = origin.upTop;
            //判断上面位置是否足够放置，如果不行，去上或下高度比较大的一个
            if(targetTop < win.scrollTop() ){
                var alignTop = top - win.scrollTop();
                var alignBottom = win.outerHeight() - alignTop - target.outerHeight();
                var maxHeight = alignTop > alignBottom? alignTop : alignBottom;
                elePop.css('height', maxHeight);
                if(hasTitle){
                    elePop.find('.zDropdownBd').css('height', maxHeight - 40);
                }
                if(alignBottom > alignTop){
                    targetTop = origin.downTop;
                }
                else{//下面的位置比上面高度小，放上去
                    targetTop = top - elePop.outerHeight() - 8;
                    elePop.addClass('zDropdownUp');
                }
            }
            else{ //上面位置够，放上去
                elePop.addClass('zDropdownUp');
            }
        }
        

        elePop.css({
            left: targetLeft,
            top: targetTop,
            "min-width": target.outerWidth()
        })
    }
}

},{}],5:[function(require,module,exports){
var ui = {};

ui.collapse = require('./collapse');
ui.scrollSpy = require('./scrollSpy');
ui.tooltip = require('./tooltip');
ui.popover = require('./popover');
ui.progress = require('./progress');
ui.select = require('./select');
ui.tab = require('./tab');
ui.modal = require('./modal');
ui.ui = require('./ui');
ui.ajax = require('./ajax');
ui.date = require('./date');
ui.weekpicker= require('./weekpicker');

window && (window.oc = ui);

if(module && module.exports){
    module.exports = ui;
}

},{"./ajax":1,"./collapse":2,"./date":3,"./modal":6,"./popover":7,"./progress":8,"./scrollSpy":9,"./select":10,"./tab":11,"./tooltip":12,"./ui":13,"./weekpicker":14}],6:[function(require,module,exports){
module.exports = {
	modalTemplate: '<div class="zModalCover"><div class="zModal"><div class="zModalHd"><i class="zModalClose">×</i></div><div class="zModalBd"></div></div></div>',

    show: function(element) {
        var $ele = $(element);
        $ele.show();
    },

    _generateModal: function(title, content){
    	var modal = $(this.modalTemplate).appendTo('body');
    	if(title){
    		modal.find('.zModalHd').append(title);
    	}
    	modal.find('.zModalBd').append(content);
    	modal.show();
    	modal.find('.zModal').css({'display': 'inline-block', 'margin-top': modal.find('.zModal').height() / -2.0 - 60});

    	modal.on('click', function(){
    		modal.remove();
    	})
    	.on('click', '.zModalClose', function(){
    		modal.remove();
    	})
    	.on('click', '.zModal', function(e){
    		e.stopPropagation();
    	})

    	return modal;
    },

    alert: function(title, content, cb) {
    	if(arguments.length === 1){
    		content = arguments[0];
    		title = '';
    	}
    	var modal = this._generateModal(title, content);
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalClose zModalAlertBtn">确定</button></div>');
        
        cb && cb();
        typeof content === 'function' && content();
    },

    confirm: function(content, cbOk, cbNo){
    	if(arguments.length < 2){
    		this.alert('Confirm arguments error');
    		return;
    	}

    	var modal = this._generateModal('', content);
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalClose zModalBtnLeft">确定</button><button class="zModalClose zModalBtnRight">取消</button></div>');

    	modal.on('click', '.zModalBtnLeft', function(){
    		cbOk && cbOk();
    	})

    	modal.on('click', '.zModalBtnRight', function(){
    		cbNo && cbNo();
    	})
    },

    prompt: function(content, cbOk, cbNo, required){
    	if(arguments.length < 2){
    		this.alert('Prompt arguments error');
    		return;
    	}
    	if(arguments.length === 3 && typeof cbNo === 'boolean'){
    		required = cbNo;
    		cbNo = null;
    	}

    	var modal = this._generateModal('', content);
    	modal.find('.zModal').find('.zModalBd').append('<p><input type="text" class="zIpt w"/></p>');
    	var ipt = modal.find('input');
    	required && (ipt.attr('placeholder', '必填 ...'));
    	
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalBtnLeft">确定</button><button class="zModalClose zModalBtnRight">取消</button></div>');

    	modal.on('click', '.zModalBtnLeft', function(){
    		var val = ipt.val();

    		if(!val && required){ //必填项
    			ipt.focus();
    		}
    		else{
				cbOk && cbOk(val);
    		}
    	})

    	modal.on('click', '.zModalBtnRight', function(){
    		cbNo && (typeof cbNo === 'function') && cbNo();
    	})
    },

    init: (function() {
        $(function() {
            var body = $('body');
            var setToMiddle = function(ele) {
                var marginTop = ele.height() / -2.0;
                ele.css('top', '50%');
                var top = parseInt(ele.css('top'));
                if (marginTop + top < 0) {
                    ele.css({
                        'margin-top': '0',
                        'top': 0
                    });
                } else {
                    ele.css({
                        'margin-top': marginTop,
                        'top': '50%'
                    });
                }
            }

            body.on('click', '[data-modal]', function() {
                var $btn = $(this);
                var id = $btn.attr('data-modal');
                var modal = $(id);
                if (modal.find('.zModalHd .zModalClose').length === 0) {
                    modal.find('.zModalHd').append('<i class="zModalClose">×</i>');
                }
                var modalCover = modal.parents('.zModalCover');
                if (modalCover.length === 0) {
                    modalCover = $('<div class="zModalCover"></div>').append(modal);
                }

                body.append(modalCover).addClass('zModalActive');
                modalCover.css('display', 'block');
                modal.css('display', 'inline-block');

                setToMiddle(modal);
            })
            .on('click', '.zModal .zModalClose', function() {
                var modal = $(this).parents('.zModalCover');
                modal.css('display', 'none');
                body.removeClass('zModalActive');
            })

            $(window).on('resize', function() {
                var modal = $('.zModalCover:visible').find('.zModal');
                setToMiddle(modal);
            })
        })
    })()
}

},{}],7:[function(require,module,exports){
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

},{"./dropdown":4}],8:[function(require,module,exports){
var instance = {}
instance.start = function(){
	var progress = $('body>.zProgressTop');
	if(progress.length === 0){
		$('<div class="zProgressTop"><i class="icon-spinner2 zSpin"></i></div>').appendTo('body');
	}
	else{
		progress.removeClass('zProgressTopDone');
	}
}
instance.done = function(){
	$('body>.zProgressTop').addClass('zProgressTopDone');
}

module.exports = instance;

},{}],9:[function(require,module,exports){
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

		$('.zScrollSpyNav').scroll(function(e){
			e.preventDefault();
			var scrollDiv = $(this);
		
			var siblingsItems = scrollDiv.find('.zScrollSpyNavItem');

			for(var i = 0; i < siblingsItems.length; i ++){
				var item = $(siblingsItems[i]);
				var id = item.attr('id');
				$('[href="#' + id + '"]').removeClass('zScrollSpyNavActive');
				var top = item.position().top;
				var height = item.outerHeight();
				console.log(top + ': ' + height);
				if(top < 15 && top > -1.0 * height){
    				$('[href="#' + id + '"]').addClass('zScrollSpyNavActive');
					break;
				}
				else if(top > 15){
					item = $(siblingsItems[i - 1]);
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
		})
    })  
}

initEvent();

module.exports = instance;

},{"./ui":13}],10:[function(require,module,exports){
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

},{"./dropdown":4}],11:[function(require,module,exports){
var instance = function(){

}

var initEvent = function(){
    $(function(){
    	$('.zTab').each(function(){
    		var tab = $(this);
    		if(tab.find('.zTabHd>a.active').length === 0){
    			var a = tab.find('.zTabHd>a:eq(0)').addClass('active');
    			tab.find(a.attr('href')).addClass('active');
    		}
    	})
        $('body')
        .off('click', '.zTab')
        .on('click', '.zTab .zTabHd>a', function(e){
        	e.preventDefault();
            var ele = $(this);
            if(ele.hasClass('.active')){
            	return;
            }

            tab = ele.parents('.zTab');
            tab.find('.zTabHd>a, .zTabItem').removeClass('active');
            ele.addClass('active');
            
            var id = ele.attr('href');
            tab.find(id).addClass('active');
        })
    })  
}

initEvent();

module.exports = instance;

},{}],12:[function(require,module,exports){
var dropdown = require('./dropdown');

var Tooltip = function(ele, content, theme){
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

},{"./dropdown":4}],13:[function(require,module,exports){
/**
* @file 基本的、单个UI元素
* @author Elvis
* @version 0.1 
*/

/**
* 基本的、单个UI元素
* @exports oc.ui
*/
var UI = {};

/**
* 判断元素是否在当前屏幕的可见范围内
* @param {object} ele - 元素的选择器或者Jquery对象
* @return {boolean} true / false
**/
UI.isOnScreen = function(ele){
    var win = $(window);
    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    }
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var ele = $(ele);

    var bounds = ele.offset();
    bounds.right = bounds.left + ele.outerWidth();
    bounds.bottom = bounds.top + ele.outerHeight();
    
    return (! (viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
}


/**
* 开关Toggle button, 此方法会影响页面中所有.zToggleBtn, .zToggleBtnSm元素
* @param {string} on - 开关打开时显示的文字，默认值为“ON”
* @param {string} off - 开关关闭时显示的文字，默认值为“OFF”
**/
UI.toggleBtn = function(on, off){
    if(on === undefined){
        on = 'ON';
        off = 'OFF';
    }
    var self = this;
    $('.zToggleBtn, .zToggleBtnSm').each(function(){
        var ele = $(this);
        self.toggleOneBtn(ele, on, off);
    })
},

/**
* 开关Toggle button，此方法只影响传入的Jquery对象
* @param {object} btn - 需要设置的Jquery对象，为一个checkbox
* @param {string} on - 开关打开时显示的文字，默认值为“ON”
* @param {string} off - 开关关闭时显示的文字，默认值为“OFF”
**/
UI.toggleOneBtn = function(btn, on, off){
    var btnClass = 'zToggleBtn';
    btn.removeClass('zToggleBtn');
    if(btn.hasClass('zToggleBtnSm')){
        btn.removeClass('zToggleBtnSm');
        btnClass += ' zToggleBtnSm';
    }

    var isChecked = btn[0].checked;
    if(isChecked){
        btnClass += ' active';
    }
    var span = $('<span class="' + btnClass + '"><i class="zToggleBtnON">' + on + '</i><i class="zToggleBtnOFF">' + off + '</i>' +  btn[0].outerHTML + '</span>');
    btn.replaceWith(span);
    span.find('input').prop('checked', isChecked);

    span.off('change', 'input').on('change', 'input', function(){
        if(this.checked){
            $(this).parents('.zToggleBtn:eq(0)').addClass('active');
        }
        else{
            $(this).parents('.zToggleBtn:eq(0)').removeClass('active');
        }
    })
},

/**
* 根据输入信息自动补全的控件
* @param {object} ele - 作用的元素，为jquery对象或集合
* @param {object} array - 提示用的字符串数组
* @param {function} cb - 选择后的回调函数，会传入选择的值，与选择的li元素作为参数
* @param {boolean} prefix - 是否支持输入多个
* @example
* oc.ui.autoComplete('#ipt', ['A99999', 'A11111', 'B22222'], function(val, li){
    console.log(val);
}, true)
*/
UI.autoComplete = function(ele, array, cb, prefix){
    ele = $(ele);
    if(typeof array === 'function'){
        cb = array;
        array = null;
    }
    ele.off('keyup').off('keydown').off('blur');
    ele.on('keydown', function(e){
        var ipt = $(this);
        var ul = ipt.next('ul.zAutoComplete');
        if(e.keyCode === 13 && ul.find('li.active').length > 0){
            event.preventDefault();
            return false;
        }
    })
    ele.on('keyup', function(e){
        var ipt = $(this);
        var ul = ipt.next('ul.zAutoComplete');

        if(e.keyCode === 40){
            var focusLi = ul.find('li.active');
            if(focusLi.length === 0){
                ul.find('li:eq(0)').addClass('active');
            }
            else{
                var nextLi = focusLi.next('li');
                if(nextLi.length > 0){
                    nextLi.addClass('active');
                    focusLi.removeClass('active');
                }
            }

            return;
        }
        if(e.keyCode === 38){
            var focusLi = ul.find('li.active');
            if(focusLi.length === 0){
                return;
            }
            
            var prevLi = focusLi.prev('li');
            if(prevLi.length > 0){
                prevLi.addClass('active');
                focusLi.removeClass('active');
            }

            return;
        }

        if(e.keyCode === 13){
            var focusLi = ul.find('li.active');
            if(focusLi.length > 0){
                var slcVal = focusLi.html();
                var text = ipt.val();
                // val = val.replace(/.*;|.*,|.*\s/g, '');
                if(prefix){
                    var mathedArray = text.match(/(.|,|\s)*(;|,|\s)/);
                    text = '';
                    if(mathedArray && mathedArray.length > 0){
                        text = mathedArray[0];
                    }
                    ipt.val(text + slcVal);
                }
                else{
                    ipt.val(slcVal);
                }
                
                ul.remove();
                cb && cb(slcVal, ipt);
            }
            return;
        }
        
        var source = array;
        if(!array){
            var sourceString = ipt.attr('data-source');
            if(sourceString){
                source = eval(sourceString);
            }
            else{
                source = ipt.data('source');
            }
        }
        if(!source){
            return;
        }

        $('.zAutoComplete').remove();
        var val = $.trim(this.value);
        if(prefix){
            val = val.replace(/.*;|.*,|.*\s/g, '');
        }
        if(!val){

            return;
        }
        var matchedArray = source.filter(function(item){
            return item.toUpperCase().indexOf(val.toUpperCase()) > -1;
        });
        
        var len = matchedArray.length;
        if(len === 0) {

            return;
        }

        if(len > 8){
            len = 8;
        }

        var ul = $('<ul class="zAutoComplete"></ul>');
        for(var i = 0; i < len; i++){
            ul.append('<li tabindex="0">' + matchedArray[i] + '</li>');
        }
        var top = ipt.position().top + ipt.outerHeight();
        var left = ipt.position().left;
        ul.css({top: top, left: left}).on('click', 'li', function(){
            var slc = $(this).html();
            // ipt.val(slc);
            var text = ipt.val();
            if(prefix){
                var mathedArray = text.match(/(.|,|\s)*(;|,|\s)/);
                text = '';
                if(mathedArray && mathedArray.length > 0){
                    text = mathedArray[0];
                }
                // text = text.replace(text.replace(/.*;|.*,|.*\s/g, ''), '');
                ipt.val(text + slc);
            }
            else{
                ipt.val(slc);
            }
            $('.zAutoComplete').remove();
            cb && cb(slc, ipt);
        })
        .on('mouseenter', 'li', function(){
            ul.find('.active').removeClass('active');
            $(this).addClass('active');
        })
        
        ipt.after(ul);

    }).on('blur', function(){
        setTimeout(function(){
            $('.zAutoComplete').remove();
        }, 200);
    });
}

/**
* Checkbox控件
*/
UI.cbx = function(){
    $('.zCbx').off('change', 'input').on('change', 'input', function(){
        if(this.checked){
            $(this).parent().addClass('active');
        }
        else{
            $(this).parent().removeClass('active');
        }
    });
    return {
        check: function(ele){
            if(!ele.hasClass('zCbx')){
                if(ele.find('input:checkbox').length === 0){
                    return console.warn("zCkb does not contain a input:checkbox item");
                }
                ele.addClass('active').find('input:checkbox')[0].checked = true;
            }
        },
        unCheck: function(ele){
            if(ele.hasClass('zCbx')){
                if(ele.find('input:checkbox').length === 0){
                    return console.warn("zCkb does not contain a input:checkbox item");
                }
                ele.removeClass('active').find('input:checkbox')[0].checked = false;
            }
        }
    };
};


/**
* 将select变成多选框
* @param {function} cb - 点击确定之后的回调函数
*/
UI.multiSelect = function(cb){
    $("select.zMultiSelect").each(function(){
        var ele = $(this);
        var width = ele.outerWidth();
        var height = ele.outerHeight() + 'px';
        var name = ele.attr('name');
        if(name === undefined){
            name = '';
        }
        var zEle = $('<div class="zMultiSelect"><div class="zMultiSelectText"></div><div class="zMultiSelectMain"><ul></ul></div></div>');
        zEle.css('width', width);
        zEle.find('.zMultiSelectText').css({'height': height, 'line-height': height}).html(ele.attr('data-slc'));
        
        var lis = '';
        ele.find('option').each(function(i, item){
            lis += '<li><label class="zCbx"><input type="checkbox", name="' + name + '" value="' + item.value + '">' + item.innerHTML + '</label></li>';
        });
        lis += '<li><button class="btnPrimary btnXs" type="button">Confirm</button></li>';
        zEle.find('ul').html(lis);

        ele.replaceWith(zEle);
    });


    UI.cbx();
    var bindEvent = function(){
        var selectDiv = $(".zMultiSelect");
        // selectDiv.off('click', 'button').off('click', '.zMultiSelectText');
        
        selectDiv.on('click', '.zMultiSelectText', function(){
            var select  = $(this).parents('.zMultiSelect:eq(0)');
            if(!select.hasClass('active')){
                select.addClass('active').find('.zMultiSelectMain').show();
                var text = this.innerHTML;
                var textArr = text.split(';');
                select.find('.zCbx').removeClass('active').find('input:checkbox').attr('checked', false);
                for(var i in textArr){
                    var val = textArr[i];
                    var cbx = select.find('input:checkbox[value="' + val + '"]');
                    if(cbx.length > 0) {
                        cbx[0].checked = true;
                        cbx.parent().addClass('active');
                    }
                }
            }
            else{
                select.removeClass('active').find('.zMultiSelectMain').hide();
            }
        }).on('click', 'button', function(e){
            var select  = $(this).parents('.zMultiSelect:eq(0)');
            var main = $(this).parents('.zMultiSelectMain:eq(0)');
            var values = '';
            main.find('input:checked').each(function(){
                values += this.value + ';';
            });
            if(values){
                values = values.slice(0, -1);
            }
            select.removeClass('active').find('.zMultiSelectText').html(values);
            main.hide();
            e.stopPropagation();
            
            cb && cb(select);
        }).click(function(e){
            e.stopPropagation();
        });

        $('html').click(function(){
            selectDiv.removeClass('active').find('.zMultiSelectMain').hide();
        });
    } ;
    bindEvent();
}

/**
* PopOver提示框，支持上下左右自定义
* @param {object} btn - 作用对象，一般为btn，Jquery或者Jquery选择器
* @param {string} title - 标题
* @param {string} content - 内容
* @param {string} popPosition - 位置，默认为right，可选值为：right、left、top、bottom
*/
UI.popOver = function(btn, title, content, popPosition){
    btn = $(btn);
    
    if(btn.next('.zPopOver').length > 0){
        btn.next('.zPopOver').remove();
        return;
    }

    var ele = $('<div class="zPopOver zPopOver' + popPosition + '"></div>');
    ele.append('<div class="zPopOverTitle">' + title + '<i class="icon-close"></i></div>');
    ele.append('<div class="zPopOverContent">' + content + '</div>');
    btn = $(btn);
    var position = btn.position();
    btn.after(ele);

    //右边
    var left = position.left + btn.outerWidth() + 20;
    var top = position.top + btn.outerHeight() / 2 - ele.outerHeight() / 2 - 5;

    //左边
    if(popPosition === 'left'){
        left = position.left - ele.outerWidth() - 20;
    }
    else if(popPosition === 'top'){
        left = position.left - ele.outerWidth() / 2 + btn.outerWidth() / 2;
        top = position.top - ele.outerHeight() - 20;
    }
    else if(popPosition === 'bottom'){
        left = position.left - ele.outerWidth() / 2 + btn.outerWidth() / 2;
        top = position.top + btn.outerHeight() + 20;
    }

    ele.css({
        left: left,
        top: top
    })
    ele.on('click', '.zPopOverTitle i.icon-close', function(){
        ele.remove();
    })
}

/**
* 关闭PopOver提示框
* @param {object} btn - 作用对象或者popOver本身
*/
UI.popOverRemove = function(btn){
    var btn = $(btn);
    if(btn.hasClass('.zPopOver')){
        btn.remove();
    }
    else{
        btn.next('.zPopOver').remove();
    }
}

module.exports = UI;
},{}],14:[function(require,module,exports){
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

},{"./date":3}]},{},[5]);