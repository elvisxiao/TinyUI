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
