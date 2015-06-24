(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function(){
	// window.$ = require('../jquery-2.1.3.min.js');
	window.oc = {};
	
	// oc.ui = require('./ui');
	// oc.dialog = require('./dialog');
	// oc.localStorage = require('./localStorage');
	// oc.FileView = require('./fileView');
	// oc.Uploader = require('./uploader');
	// oc.TreeSelect = require('./treeSelect');
	// oc.TreeDialogSelect = require('./treeDialogSelect');
	// oc.Tree = require('./tree');
	// oc.ImageCrop = require('./imageCrop');
	// oc.Sidebar = require('./sidebar');
	// oc.TreeOrganization = require('./treeOrganization');
	// oc.TreePIS = require('./treePIS');
	// oc.ajax = require('./ajax');
	// oc.date = require('./date');
	oc.collapse = require('./collapse');
	oc.modal = require('./modal');
	
	var cssPath = $('script[data-occss]').attr('data-occss');
	if(cssPath){
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: cssPath}).appendTo("head");
		cssPath = cssPath.replace('oc.css', 'icons/style.css');
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: cssPath}).appendTo("head");
	}
	else if(location.href.indexOf('tinyp2p') > -1 || location.href.indexOf('local') > -1){
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: 'http://ui.tinyp2p.com/dest/oc.css'}).appendTo("head");
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: 'http://ui.tinyp2p.com/icons/style.css'}).appendTo("head");
	}
	else{
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: 'http://res.laptopmate.us/webapp/js/oc/oc.css'}).appendTo("head");
		$("<link>").attr({ rel: "stylesheet", type: "text/css", href: 'http://res.laptopmate.us/webapp/js/oc/icons/style.css'}).appendTo("head");
	}
})()
},{"./collapse":1,"./modal":3}],3:[function(require,module,exports){
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

    alert: function(title, content) {
    	if(arguments.length < 2){
    		content = arguments[0];
    		title = '';
    	}
    	var modal = this._generateModal(title, content);
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalClose zModalAlertBtn">确定</button></div>');
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

},{}]},{},[2]);
