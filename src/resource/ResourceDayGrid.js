
/* A component that renders a grid of whole-days that runs horizontally. There can be multiple rows, one per week.
----------------------------------------------------------------------------------------------------------------------*/

function ResourceDayGrid(view) {
	DayGrid.call(this, view); // call the super-constructor
}


ResourceDayGrid.prototype = createObject(DayGrid.prototype); // declare the super-class
$.extend(ResourceDayGrid.prototype, {

});
