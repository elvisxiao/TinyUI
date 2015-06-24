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
