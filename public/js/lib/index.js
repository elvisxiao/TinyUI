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
