
/* A component that renders a grid of whole-days that runs horizontally. There can be multiple rows, one per week.
----------------------------------------------------------------------------------------------------------------------*/

function ResourceDayGrid(view) {
	DayGrid.call(this, view); // call the super-constructor
}


ResourceDayGrid.prototype = createObject(DayGrid.prototype); // declare the super-class
$.extend(ResourceDayGrid.prototype, {
	// Renders a visual indication of an event hovering over the given date(s).
	// `end` can be null, as well as `seg`. See View's documentation on renderDrag for more info.
	// A returned value of `true` signals that a mock "helper" event has been rendered.
	renderDrag: function(start, end, seg) {
		var opacity;

		// always render a highlight underneath
		this.renderHighlight(
			start,
			end || this.view.calendar.getDefaultEventEnd(true, start),
			seg.event.resources
		);

		// if a segment from the same calendar but another component is being dragged, render a helper event
		if (seg && !seg.el.closest(this.el).length) {

			this.renderRangeHelper(start, end, seg);

			opacity = this.view.opt('dragOpacity');
			if (opacity !== undefined) {
				this.helperEls.css('opacity', opacity);
			}

			return true; // a helper has been rendered
		}
	},

  // Renders an emphasis on the given date range. `start` is an inclusive, `end` is exclusive.
	renderHighlight: function(start, end, resourceIds) {
		var segs = this.rangeToSegs(start, end, resourceIds);
		var highlightNodes = [];
		var i, seg;
		var el;

		// build an event skeleton for each row that needs it
		for (i = 0; i < segs.length; i++) {
			seg = segs[i];
			el = $(
				this.highlightSkeletonHtml(seg.leftCol, seg.rightCol + 1) // make end exclusive
			);
			el.appendTo(this.rowEls[seg.row]);
			highlightNodes.push(el[0]);
		}

		this.highlightEls = $(highlightNodes); // array -> jQuery set
	},


	rangeToSegs: function(rangeStart, rangeEnd, resourceIds) {
		var col, segments = [];
		resourceIds = resourceIds || [];

		var currentDate = this.view.calendar.getDate();
		if((rangeStart <= currentDate) && (currentDate < rangeEnd)) {
			var view = this.view;
			var resources = view.calendar.fetchResources();
		
			for (col = 0; col < view.colCnt; col++) {
	      var resource = resources[col];
	      if (resourceIds.indexOf(resource.id) > -1){
					segments.push({
						row: 0,
						leftCol: col,
						rightCol: col,
						isStart: true,
						isEnd: true
					});
				}
			}
		}

		return segments;
	}
});