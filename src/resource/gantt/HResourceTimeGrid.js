
/* A component that renders one or more columns of vertical time slots
----------------------------------------------------------------------------------------------------------------------*/

function HResourceTimeGrid(view) {
	TimeGrid.call(this, view); // call the super-constructor
}


HResourceTimeGrid.prototype = createObject(TimeGrid.prototype); // define the super-class
$.extend(HResourceTimeGrid.prototype, {
// Slices up a date range into a segment for each column
// Each column represents a resource.  An event can be assigned to multiple resources
// so we need to build segs accordingly
  rangeToSegs: function(rangeStart, rangeEnd, resourceIds) {
    var view = this.view;
    var segs = [];
    var seg;
    var col;
    var cellDate;
    var colStart, colEnd;

    var resources = view.calendar.fetchResources();

    // normalize
    rangeStart = rangeStart.clone().stripZone();
    rangeEnd = rangeEnd.clone().stripZone();

    for (col = 0; col < view.colCnt; col++) {
      var resource = resources[col];
      if (resource && resourceIds && resourceIds.indexOf(resource.id) > -1){
        cellDate = view.cellToDate(0, col); // use the View's cell system for this
        colStart = cellDate.clone().time(this.minTime);
        colEnd = cellDate.clone().time(this.maxTime);
        seg = intersectionToSeg(rangeStart, rangeEnd, colStart, colEnd);
        if (seg) {
          seg.col = col;
          segs.push(seg);
        }
      }
    }

    return segs;
  }

});
