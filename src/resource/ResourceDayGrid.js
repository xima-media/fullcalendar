
/* A component that renders a grid of whole-days that runs horizontally. There can be multiple rows, one per week.
----------------------------------------------------------------------------------------------------------------------*/

function ResourceDayGrid(view) {
	DayGrid.call(this, view); // call the super-constructor
}


ResourceDayGrid.prototype = createObject(DayGrid.prototype); // declare the super-class
$.extend(ResourceDayGrid.prototype, {
	rangeToSegs: function(rangeStart, rangeEnd, resourceIds) {
		var col, segments = [];
		
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