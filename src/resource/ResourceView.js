
/* An abstract class for all agenda-related views. Displays one more columns with time slots running vertically.
----------------------------------------------------------------------------------------------------------------------*/
// Is a manager for the TimeGrid subcomponent and possibly the DayGrid subcomponent (if allDaySlot is on).
// Responsible for managing width/height.

setDefaults({
	allDaySlot: true,
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

var AGENDA_ALL_DAY_EVENT_LIMIT = 5;


function generateAgendaAxisFormat(options, langData) {
	return langData.longDateFormat('LT')
		.replace(':mm', '(:mm)')
		.replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
		.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
}


function generateAgendaTimeFormat(options, langData) {
	return langData.longDateFormat('LT')
		.replace(/\s*a$/i, ''); // remove trailing AM/PM
}


function ResourceView(calendar) {
	View.call(this, calendar); // call the super-constructor

	// overrides - the view.js should expose these on the prototype then we wouldn't have to do this.
	this.cellToDate = ResourceView.prototype.cellToDate;

	this.timeGrid = new ResourceTimeGrid(this);

	if (this.opt('allDaySlot')) { // should we display the "all-day" area?
		this.dayGrid = new DayGrid(this); // the all-day subcomponent of this view

		// the coordinate grid will be a combination of both subcomponents' grids
		this.coordMap = new ComboCoordMap([
			this.dayGrid.coordMap,
			this.timeGrid.coordMap
		]);
	}
	else {
		this.coordMap = this.timeGrid.coordMap;
	}
}


ResourceView.prototype = createObject(AgendaView.prototype); // define the super-class
$.extend(ResourceView.prototype, {

	cellToDate: function() {
		return this.start.clone();
	},

	// fix the classes, etc.
	headCellHtml: function(row, col, date) {
		var view = this;
		var calendar = view.calendar;
		var colFormat = view.opt('columnFormat');
		var resource = this.calendar.fetchResources()[col];
		return '' +
			'<th class="fc-day-header ' + view.widgetHeaderClass + ' fc-' + resource.id + '">' +
				htmlEscape(resource.name) + 
			'</th>';
	}	

});
