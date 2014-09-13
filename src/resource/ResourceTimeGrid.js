
/* A component that renders one or more columns of vertical time slots
----------------------------------------------------------------------------------------------------------------------*/

function ResourceTimeGrid(view) {
	TimeGrid.call(this, view); // call the super-constructor
}


ResourceTimeGrid.prototype = createObject(TimeGrid.prototype); // define the super-class
$.extend(ResourceTimeGrid.prototype, {

});
