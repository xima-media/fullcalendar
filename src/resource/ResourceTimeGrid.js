
/* A component that renders one or more columns of vertical time slots
----------------------------------------------------------------------------------------------------------------------*/

function ResourceTimeGrid(view) {
	TimeGrid.call(this, view); // call the super-constructor
}


ResourceTimeGrid.prototype = createObject(TimeGrid.prototype); // define the super-class
$.extend(ResourceTimeGrid.prototype, {
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
      if (resourceIds.indexOf(resource.id) > -1){
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
  },
    // Process a mousedown on an element that represents a day. For day clicking and selecting.
  dayMousedown: function(ev) {
    var _this = this;
    var view = this.view;
    var isSelectable = view.opt('selectable');
    var dates = null; // the inclusive dates of the selection. will be null if no selection
    var start; // the inclusive start of the selection
    var end; // the *exclusive* end of the selection
    var dayEl;

    // this listener tracks a mousedown on a day element, and a subsequent drag.
    // if the drag ends on the same day, it is a 'dayClick'.
    // if 'selectable' is enabled, this listener also detects selections.
    var dragListener = new DragListener(this.coordMap, {
      //distance: 5, // needs more work if we want dayClick to fire correctly
      scroll: view.opt('dragScroll'),
      dragStart: function() {
        view.unselect(); // since we could be rendering a new selection, we want to clear any old one
      },
      cellOver: function(cell, date) {
        if (dragListener.origDate) { // click needs to have started on a cell

          dayEl = _this.getCellDayEl(cell);

          dates = [ date, dragListener.origDate ].sort(dateCompare);
          start = dates[0];
          end = dates[1].clone().add(_this.cellDuration);

          if (isSelectable) {
            var resources = view.calendar.fetchResources();
            _this.renderSelection(start, end, {event: { resources: [ resources[cell.col].id ]}});
          }
        }
      },
      cellOut: function(cell, date) {
        dates = null;
        _this.destroySelection();
      },
      listenStop: function(ev) {
        if (dates) { // started and ended on a cell?
          if (dates[0].isSame(dates[1])) {
            view.trigger('dayClick', dayEl[0], start, ev);
          }
          if (isSelectable) {
            // the selection will already have been rendered. just report it
            view.reportSelection(start, end, ev);
          }
        }
      }
    });

    dragListener.mousedown(ev); // start listening, which will eventually initiate a dragStart
  },

  // Renders a visual indication of a selection. Overrides the default, which was to simply render a highlight.
  renderSelection: function(start, end, sourceSeg) {
    if (this.view.opt('selectHelper')) { // this setting signals that a mock helper event should be rendered
      this.renderRangeHelper(start, end, sourceSeg);
    }
    else {
      this.renderHighlight(start, end, sourceSeg);
    }
  },
  // Renders a mock event over the given date(s).
  // `end` can be null, in which case the mock event that is rendered will have a null end time.
  // `sourceSeg` is the internal segment object involved in the drag. If null, something external is dragging.
  renderRangeHelper: function(start, end, sourceSeg) {
    var view = this.view;
    var fakeEvent;

    // compute the end time if forced to do so (this is what EventManager does)
    if (!end && view.opt('forceEventDuration')) {
      end = view.calendar.getDefaultEventEnd(!start.hasTime(), start);
    }

    fakeEvent = sourceSeg ? createObject(sourceSeg.event) : {}; // mask the original event object if possible
    fakeEvent.start = start;
    fakeEvent.end = end;
    fakeEvent.allDay = !(start.hasTime() || (end && end.hasTime())); // freshly compute allDay

    // this extra className will be useful for differentiating real events from mock events in CSS
    fakeEvent.className = (fakeEvent.className || []).concat('fc-helper');

    // if something external is being dragged in, don't render a resizer
    if (!sourceSeg) {
      fakeEvent.editable = false;
      fakeEvent.resources = sourceSeg.event.resources;
    }

    this.renderHelper(fakeEvent, sourceSeg); // do the actual rendering
  }

});
