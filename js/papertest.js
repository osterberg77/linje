var mainPath = new Path();
mainPath.strokeWidth=2;
mainPath.strokeColor='black';

var oldPath = new Path();
oldPath.strokeWidth=2;

var oldPathTail = new Path();
oldPathTail.strokeWidth=2;

var tolerance = 20;
var pathRes=5;
var blockMouse = false;
var tail=false;
tool.minDistance=2;

function setOld(){
	oldPath.strokeColor='lightgray';
	oldPath.dashArray=[4,2];
	oldPathTail.strokeColor='gray';
	oldPathTail.dashArray=0;
}

function onMouseDown(event){
	blockMouse=false;
	if (mainPath.length==0) { //Empty path?
		mainPath.add(event.point);
	} else {
		var closest=mainPath.getNearestPoint(event.point);
		if (event.point.getDistance(closest)<tolerance) { //Check if close to path
			if (mainPath.firstSegment.point==closest) { //Is it the first point?
				oldPath.removeSegments();
				oldPath.addSegments(mainPath.segments);
				mainPath.removeSegments();
				mainPath.add(closest);
			} else if (mainPath.lastSegment.point==closest) { //Is it the last point?
				oldPath.removeSegments();
			} else {
				oldPath=mainPath.split(mainPath.getLocationOf(closest)); //Split line
			}
			setOld();
			mainPath.add(event.point);
		} else {blockMouse=true}; //blockMouse=true (scroll or lines) mainPath.add(event.point)
	}
}

function onMouseDrag(event){
	if (tail){
		oldPath.join(oldPathTail);
		oldPathTail.removeSegments();
		tail=false;
	}
	if (!blockMouse) {
		if (!(oldPath.length==0) && (event.point.getDistance(oldPath.firstSegment.point)>tolerance)) {
			var closest=oldPath.getNearestPoint(event.point);
			if (event.point.getDistance(closest)<tolerance) {
				if (oldPath.lastSegment.point==closest || oldPath.firstSegment.point==closest) {
				} else {
					oldPathTail=oldPath.split(oldPath.getLocationOf(closest));
					setOld();
					tail=true;
				}
			}
		}
		mainPath.add(event.point);
	} else {
		view.center-=event.delta;
	}
}

function onMouseUp(event){
	if (tail){
		oldPath.join(oldPathTail);
		oldPathTail.removeSegments();
		tail=false;
	}
	if (!blockMouse) {
		if (!(oldPath.length==0)) {
			var closest=oldPath.getNearestPoint(event.point);
			if (event.point.getDistance(closest)<tolerance) {
				if (oldPath.lastSegment.point==closest) {
				} else if (oldPath.firstSegment.point==closest) {
					mainPath.join(oldPath);
				} else {
					mainPath.join(oldPath.split(oldPath.getLocationOf(closest)));
				}
			}
		}
		oldPath.removeSegments();
		mainPath.reduce();
	} else {
		console.log(mainPath.segments.length);
		mainPath.smooth;
		mainPath.simplify(2);
		console.log(mainPath.segments.length);
	}
}
