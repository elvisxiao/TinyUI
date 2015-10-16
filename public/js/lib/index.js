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
ui.weekpicker = require('./weekpicker');
ui.datepicker = require('./datepicker');
ui.table = require('./table');
ui.dropdown = require('./dropdown');
ui.at = require('./@.js');
ui.security = require('./security.js');
ui.localStorage = require('./localStorage.js');

window && (window.oc = ui);

if(module && module.exports){
    module.exports = ui;
}
