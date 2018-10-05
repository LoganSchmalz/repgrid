function createRow() {
	var rowLabel = document.getElementById("rowLabel");
	var label = rowLabel.value; //get input
	
	if (label != "") {
		var table = document.getElementById("repGrid");
		var row = table.insertRow(-1);
		
		var headerCell = document.createElement("th"); //create left side
		headerCell.innerHTML = label;
		headerCell.contentEditable = "true";
		row.appendChild(headerCell);
		
		for (var i = 1; i < table.rows[0].cells.length - 1; i++) { //make input for every cell other than ends
			var inputCell = document.createElement("td");
			inputCell.contentEditable = "true";
			row.appendChild(inputCell);
		}
		
		headerCell = document.createElement("th"); //must create new element to make new object
		headerCell.innerHTML = "Not " + label; //make the not-construct on the right side
		headerCell.contentEditable = "true";
		row.appendChild(headerCell);
		
		rowLabel.value = ""; //clear input
	}
}

function createColumn() {
	var columnLabel = document.getElementById("columnLabel");
	var label = columnLabel.value; //get input
	
	if (label != "") {
		var table = document.getElementById("repGrid");
		var columnNum = table.rows[0].cells.length - 1; //subtract 1 so we know index of last column (arrays start at 0)
		
		var headerCell = document.createElement("th"); //create construct label
		headerCell.innerHTML = label;
		headerCell.contentEditable = "true";
		table.rows[0].insertBefore(headerCell, table.rows[0].cells[columnNum]); //inserts before the last column (last column is ratings/not-constructs)
				
		for (var i = 1; i < table.rows.length; i++) { //make input for eveyr other cell in column
			var inputCell = document.createElement("td");
			inputCell.contentEditable = "true";
			table.rows[i].insertBefore(inputCell, table.rows[i].cells[columnNum]); //again, instert before last column
		}
	}
	
	columnLabel.value = ""; //clear input
}

function removeRow() {
	var table = document.getElementById("repGrid");
	if (table.rows.length > 1) { //make sure at least 2 rows are left
		table.deleteRow(table.rows.length - 1);
	}
}

function removeColumn() {
	var table = document.getElementById("repGrid");
	if (table.rows[0].cells.length > 2) { //make sure at least 2 columns are left
		for (var i = 0; i < table.rows.length; i++) {
			table.rows[i].deleteCell(table.rows[i].cells.length - 2);
		}
	}
}

function exportToXLSX() {
	var instance = new TableExport(document.getElementById("repGrid"), {
		formats: ["xlsx"],
		exportButtons: false
	});
	var exportData = instance.getExportData()["repGrid"]["xlsx"];
	instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
}

function exportToTXT() {
	var table = document.getElementById("repGrid");
	
	numRow = table.rows.length;
	numCol = table.rows[0].cells.length;
	//format range
	var txt = "\r\n";
	txt += `RANGE\r\n${table.rows[0].cells[0].innerHTML} ${table.rows[0].cells[numCol - 1].innerHTML}\r\nEND RANGE\r\n\r\n`;
	//format elements
	txt += "ELEMENTS\r\n"
	for (var col = 1; col < numCol - 1; col++) {
		txt += `${table.rows[0].cells[col].innerHTML}\r\n`;
	}
	txt += "END ELEMENTS\r\n\r\n";
	//format constructs
	txt += "CONSTRUCTS\r\n"
	for (var row = 1; row < numRow; row++) {
		txt += `${table.rows[row].cells[0].innerHTML} : ${table.rows[row].cells[numCol - 1].innerHTML}\r\n`;
	}
	txt += "END CONSTRUCTS\r\n\r\n"
	//format ratings
	txt += "RATINGS\r\n"
	for (var row = 1; row < numRow; row++) {
		for (var col = 1; col < numCol - 1; col++) {
			txt += `${table.rows[row].cells[col].innerHTML}${col < numCol - 2 ? " " : "\r\n"}`; //add ratings and if at not at end of line then space
		}
	}
	txt += "END RATINGS\r\n"
	
	var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "repGrid.txt");
}

function exportToORG() {
	var table = document.getElementById("repGrid");
	
	numRow = table.rows.length;
	numCol = table.rows[0].cells.length;
	
	var cp = new String;
	cp += "args <- list(<br>";
	cp += "name= c(";
	for (var col = 1; col < numCol - 1; col++) {
		cp += `"${table.rows[0].cells[col].innerHTML}"${col < numCol - 2 ? ", " : "),<br>"}`;
	}
	cp += "l.name= c("
	for (var row = 1; row < numRow; row++) {
		cp += `"${table.rows[row].cells[0].innerHTML}"${row < numRow - 1 ? ", " : "),<br>"}`;
	}
	cp += "r.name= c("
	for (var row = 1; row < numRow; row++) {
		cp += `"${table.rows[row].cells[numCol - 1].innerHTML}"${row < numRow - 1 ? ", " : "),<br>"}`;
	}
	cp += "scores=c (";
	for (var row = 1; row < numRow; row++) {
		for (var col = 1; col < numCol - 1; col++) {
			cp += table.rows[row].cells[col].innerHTML;
			if (col < numCol - 2) { //if not end of line, space
				cp += ", ";
			}
			else if (row < numRow - 1) { //if end of line but not last line, break
				cp += ",<br>";
			}
		}
	}
	cp +=`))<br>newGrid <- makeRepgrid(args)<br>newGrid <- setScale(newGrid, ${table.rows[0].cells[0].innerHTML}, ${table.rows[0].cells[numCol - 1].innerHTML})<br>newGrid`;
	document.write(cp);
}