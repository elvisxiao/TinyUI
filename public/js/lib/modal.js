var instance = {
	modalTemplate: '<div class="zModalCover"><div class="zModal"><div class="zModalHd"><i class="zModalClose">×</i></div><div class="zModalBd"></div></div></div>',

    show: function(element) {
        var modal = $(element);
        var body = $('body');

        if (modal.find('.zModalHd .zModalClose').length === 0) {
            modal.find('.zModalHd').append('<i class="zModalClose">×</i>');
        }
        var modalCover = modal.parent('.zModalCover');
        if (modalCover.length === 0) {
            modalCover = $('<div class="zModalCover"></div>').append(modal);
        }
        
        body.append(modalCover).addClass('zModalActive');
        modalCover.css('display', 'block');
        modal.css('display', 'block');

        this._setToMiddle(modal);
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
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalClose zModalAlertBtn">Confirm</button></div>');
        
        cb && cb();
        typeof content === 'function' && content();
    },

    _showTips: function(){
        var title, content, time, cb;

        var args = arguments[0];
        
        if(args.length === 1){
            content = args[0];
            title = '';
            time = 2000;
        }
        else if(args.length === 2){
            if(typeof args[1] === 'function'){
                cb = args[1];
                content = args[0];
                time = 2000;
                title = '';
            }
            else if(typeof args[1] === 'number'){
                time = args[1];
                content = args[0];
                title = '';
            }
            else{
                time = 2000;
            }
        }
        else if(args.length === 3){
            if(typeof args[2] === 'function' && typeof args[1] === 'string'){
                cb = args[2];
                time = 2000;
            }
            else if(typeof args[2] === 'function' && typeof args[1] === 'number'){
                title = '';
                cb = args[2];
                time = args[1];
                content = args[0];
            }
        }
        
        var modal = this._generateModal(title, content);

        setTimeout(function(){
            modal.remove();
            cb && cb();
        }, time);

        return modal;
    },

    tips: function(title, content, time, cb){
        this._showTips(arguments);
    },

    warn: function(){
        var modal = this._showTips(arguments);
        modal.find('.zModalBd').addClass('zModalTips');
    },

    error: function(){
        var modal = this._showTips(arguments);
        modal.find('.zModalBd').addClass('zModalError');
    },

    confirm: function(content, cbOk, cbNo){
    	if(arguments.length < 2){
    		this.alert('Confirm arguments error');
    		return;
    	}

    	var modal = this._generateModal('', content);
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalClose zModalBtnLeft">Confirm</button><button class="zModalClose zModalBtnRight">Cancel</button></div>');

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
    	required && (ipt.attr('placeholder', 'required ...'));
    	
    	modal.find('.zModal').append('<div class="zModalFt"><button class="zModalBtnLeft">Submit</button><button class="zModalClose zModalBtnRight">Cancel</button></div>');

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

    _setToMiddle: function(ele) {
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
    },
    
    close: function(modal){
        if(!modal){
            $('.zModalCover').each(function(){
                var one = $(this);
                one.css('display', 'none');
            })
        }
        else{
            modal = $(modal);
            if(!modal.hasClass('zModalCover')){
                modal = modal.parents('.zModalCover');
            }
            modal.css('display', 'none');
        }
        
        $('body').removeClass('zModalActive');
    },

    init: function() {
        var self = this;

        $(function() {
            var body = $('body');
            
            body.on('click', '[data-modal]', function() {
                var $btn = $(this);
                var id = $btn.attr('data-modal');
                
                self.show(id);
            })
            .on('click', '.zModal .zModalClose', function(e) {
                e.stopPropagation();
                var modal = $(this).parents('.zModalCover');
                modal.css('display', 'none');
                body.removeClass('zModalActive');
            })
            
            $(window).on('resize', function() {
                var modal = $('.zModalCover:visible').find('.zModal');
                self._setToMiddle(modal);
            })
        })
    }
}

instance.init();

module.exports = instance;
