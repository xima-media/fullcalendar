
/* A day view with an all-day cell area at the top, and a time grid below by resource
----------------------------------------------------------------------------------------------------------------------*/

fcViews.hResourceDay = HResourceDayView;

function HResourceDayView(calendar) { // TODO: make a ResourceView mixin
	HResourceView.call(this, calendar); // call the super-constructor
}

HResourceDayView.prototype = createObject(HResourceView.prototype); // define the super-class
$.extend(HResourceDayView.prototype, {

	name: 'hResourceDay',


	incrementDate: function(date, delta) {
		var out = date.clone().stripTime().add(delta, 'days');
		out = this.skipHiddenDays(out, delta < 0 ? -1 : 1);
		return out;
	},


	render: function(date) {
		this.start = this.intervalStart = date.clone().stripTime();
		this.end = this.intervalEnd = this.start.clone().add(1, 'days');

		this.title = this.calendar.formatDate(this.start, this.opt('titleFormat'));
		
		HResourceView.prototype.render.call(this, 12); // call the super-method
	},

	// Computes HTML classNames for a single-day cell
	getDayClasses: function(date) {
		var view = this.view;
		var today = view.calendar.getNow().stripTime();
		var classes = [ 'fc-' + dayIDs[date.day()] ];

		if (
			view.name === 'month' &&
			date.month() != view.intervalStart.month()
		) {
			classes.push('fc-other-month');
		}

		if (date.isSame(today, 'day')) {
			classes.push(
				'fc-todaysss',
				view.highlightStateClass
			);
		}
		else if (date < today) {
			classes.push('fc-past');
		}
		else {
			classes.push('fc-future');
		}

		return classes;
	}

});