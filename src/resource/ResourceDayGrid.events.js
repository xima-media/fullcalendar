
/* Event-rendering methods for the DayGrid class
----------------------------------------------------------------------------------------------------------------------*/

$.extend(ResourceDayGrid.prototype, {
	eventToSegs: function(event, intervalStart, intervalEnd) {
		var eventStart = event.start.clone().stripZone(); // normalize
    var eventEnd = this.view.calendar.getEventEnd(event).stripZone(); // compute (if necessary) and normalize
    var segs;
    var i, seg;

    if (intervalStart && intervalEnd) {
      seg = intersectionToSeg(eventStart, eventEnd, intervalStart, intervalEnd);
      segs = seg ? [ seg ] : [];
    }
    else {
      segs = this.rangeToSegs(eventStart, eventEnd, event.resources); // defined by the subclass
    }

    // assign extra event-related properties to the segment objects
    for (i = 0; i < segs.length; i++) {
      seg = segs[i];
      seg.event = event;
      seg.eventStartMS = +eventStart;
      seg.eventDurationMS = eventEnd - eventStart;
    }

    return segs;
  }
});