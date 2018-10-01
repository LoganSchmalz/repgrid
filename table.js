function init() {
	var button = document.getElementById("row");
	button.onclick = createRow;
}

function createRow() {
	var label = document.getElementById("rowLabel").value; //get input
	
	if (label != "") {
		var table = document.getElementById("repGrid"); //get table and add row
		var row = table.insertRow(-1);
		
		var headerCell = document.createElement("th"); //create left side
		headerCell.innerHTML = label;
		row.appendChild(headerCell);
		
		for (var i = 1; i < table.rows[0].cells.length - 1; i++) { //make input for every cell other than ends
			var cell = document.createElement("td");
			cell.appendChild(document.createElement("input"));
			row.appendChild(cell);
		}
		
		headerCell = document.createElement("th"); //must create new element to make new object
		headerCell.innerHTML = "Not " + label;
		row.appendChild(headerCell);
		
		document.getElementById("rowLabel").value = ""; //clear input
	}
}