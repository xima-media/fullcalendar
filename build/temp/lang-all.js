(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jquery", "moment" ], factory);
    }
    else {
        factory(jQuery, moment);
    }
})(function($, moment) {


moment.lang("en");
$.fullCalendar.lang("en");
if ($.datepicker) $.datepicker.setDefaults($.datepicker.regional[""]);

});