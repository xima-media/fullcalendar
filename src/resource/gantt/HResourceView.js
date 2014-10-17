
/* An abstract class for all agenda-related views. Displays one more columns with time slots running vertically.
----------------------------------------------------------------------------------------------------------------------*/
// Is a manager for the TimeGrid subcomponent and possibly the DayGrid subcomponent (if allDaySlot is on).
// Responsible for managing width/height.

setDefaults({
	allDaySlot: false,
	allDayText: 'all-day',

	scrollTime: '06:00:00',

	slotDuration: '00:30:00',

	axisFormat: generateAgendaAxisFormat,
	timeFormat: {
		agenda: generateAgendaTimeFormat
	},

	minTime: '00:00:00',
	maxTime: '24:00:00',
	slotEventOverlap: true
});

function HResourceView(calendar) {
	View.call(this, calendar); // call the super-constructor

	// overrides - the view.js should expose these on the prototype then we wouldn't have to do this.
	this.cellToDate = HResourceView.prototype.cellToDate;

	this.timeGrid = new HResourceTimeGrid(this);

	// if (this.opt('allDaySlot')) { // should we display the "all-day" area?
	// 	this.dayGrid = new ResourceDayGrid(this); // the all-day subcomponent of this view

	// 	// the coordinate grid will be a combination of both subcomponents' grids
	// 	this.coordMap = new ComboCoordMap([
	// 		this.dayGrid.coordMap,
	// 		this.timeGrid.coordMap
	// 	]);
	// }
	// else {
		this.coordMap = this.timeGrid.coordMap;
	// }
}


HResourceView.prototype = createObject(HAgendaView.prototype); // define the super-class
$.extend(HResourceView.prototype, {

	cellToDate: function() {
		return this.start.clone();
	},

	// fix the classes, etc.
	headCellHtml: function(row, col, date) {
		var view = this;
		var dateCell = date.add(col, 'hour').clone();

		return '' +
			'<th class="fc-day-header ' + view.widgetHeaderClass + '">' +
				htmlEscape(dateCell.format('HH:mm')) +
			'</th>';
	}

// slotBgCellHtml: function(row, col, date) {
	// 	var view = this.view;
	// 	var classes = this.getDayClasses(date);

	// 	classes.unshift('fc-day', view.widgetContentClass);

	// 	return '<td class="' + classes.join(' ') + '" data-date="' + date.format() + '"></td>';
	// }
	
	// slotBgCellHtml: function(row, col, date) {
	// 	var view = this.view;
	// 	var classes = this.getDayClasses(date);

	// 	classes.unshift('fc-day', view.widgetContentClass);

	// 	return '<td class="' + classes.join(' ') + '" data-date="' + date.format() + '"></td>';
	// }

});
