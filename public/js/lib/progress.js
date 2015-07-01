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
