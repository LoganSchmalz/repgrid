//function init() {
//	var button = document.getElementById("row");
//	button.onclick = createRow;
//}

function createRow() {
	var rowLabel = document.getElementById("rowLabel");
	var label = rowLabel.value; //get input
	
	if (label != "") {
		var table = document.getElementById("repGrid"); //get table and add row
		var row = table.insertRow(-1);
		
		var headerCell = document.createElement("th"); //create left side
		headerCell.innerHTML = label;
		row.appendChild(headerCell);
		
		for (var i = 1; i < table.rows[0].cells.length - 1; i++) { //make input for every cell other than ends
			var inputCell = document.createElement("td");
			inputCell.appendChild(document.createElement("input"));
			row.appendChild(inputCell);
		}
		
		headerCell = document.createElement("th"); //must create new element to make new object
		headerCell.innerHTML = "Not " + label; //makin the not-construct on the right side
		row.appendChild(headerCell);
		
		rowLabel.value = ""; //clear input
	}
}

function createColumn() {
	var columnLabel = document.getElementById("columnLabel");
	var label = columnLabel.value; //get input
	
	if (label != "") {
		var table = document.getElementById("repGrid"); //get table
		var columnNum = table.rows[0].cells.length - 1; //subtract one so we know index of last column (arrays start at 0)
		
		var headerCell = document.createElement("th"); //create construct label
		headerCell.innerHTML = label;
		table.rows[0].insertBefore(headerCell, table.rows[0].cells[columnNum]); //inserts before the last column (last column is ratings/not-constructs)
		
		for (var i = 1; i < table.rows.length; i++) { //make input for eveyr other cell in column
			var inputCell = document.createElement("td");
			inputCell.appendChild(document.createElement("input"));
			table.rows[i].insertBefore(inputCell, table.rows[i].cells[columnNum]); //again, instert before last column
		}
	}
	
	columnLabel.value = ""; //clear input
}