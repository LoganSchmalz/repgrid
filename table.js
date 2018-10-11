function generateTable() {
	var tableDiv = document.getElementById("tableDiv");
	var table = document.createElement("table");
	table.id = "repGrid";
	tableDiv.appendChild(table);
	
	var ratingL = document.getElementById("ratingL").value;
	var ratingR = document.getElementById("ratingR").value;
	var row = table.insertRow(-1);
	var ratingCell = document.createElement("td");
	ratingCell.innerHTML = ratingL;
	ratingCell.contentEditable = true;
	row.appendChild(ratingCell);
	ratingCell = document.createElement("td");
	ratingCell.innerHTML = ratingR;
	ratingCell.contentEditable = true;
	row.appendChild(ratingCell);

	createColumn("test", table);
}

function createRow(rowLabel, notRowLabel, table) {
	//var rowLabel = document.getElementById("rowLabel");
	var label = rowLabel.value; //get input
	
	if (label != "") {
		//var table = document.getElementById("repGrid");
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
		if (notRowLabel) {
			headerCell.innerHTML = notRowLabel.value;
		}
		else {
		headerCell.innerHTML = "Not " + label; //make the not-construct on the right side
		}
		headerCell.contentEditable = "true";
		row.appendChild(headerCell);
		
		rowLabel.value = ""; //clear input
	}
}

function createColumn(columnLabel, table) {
	//var columnLabel = document.getElementById("columnLabel");
	var label = columnLabel.value; //get input
	
	if (label != "a") {
		//var table = document.getElementById("repGrid");
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
	for (var i = 1; i < numCol - 1; i++) {
		txt += `${table.rows[0].cells[i].innerHTML}\r\n`;
	}
	txt += "END ELEMENTS\r\n\r\n";
	//format constructs
	txt += "CONSTRUCTS\r\n"
	for (var i = 1; i < numRow; i++) {
		txt += `${table.rows[i].cells[0].innerHTML} : ${table.rows[i].cells[numCol - 1].innerHTML}\r\n`;
	}
	txt += "END CONSTRUCTS\r\n\r\n"
	//format ratings
	txt += "RATINGS\r\n"
	for (var i = 1; i < numRow; i++) {
		for (var j = 1; j < numCol - 1; j++) {
			txt += `${table.rows[i].cells[j].innerHTML}${j < numCol - 2 ? " " : "\r\n"}`; //add ratings and if at not at end of line then space
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
	for (var i = 1; i < numCol - 1; i++) {
		cp += `"${table.rows[0].cells[i].innerHTML}"${i < numCol - 2 ? ", " : "),<br>"}`;
	}
	cp += "l.name= c("
	for (var i = 1; i < numRow; i++) {
		cp += `"${table.rows[i].cells[0].innerHTML}"${i < numRow - 1 ? ", " : "),<br>"}`;
	}
	cp += "r.name= c("
	for (var i = 1; i < numRow; i++) {
		cp += `"${table.rows[i].cells[numCol - 1].innerHTML}"${i < numRow - 1 ? ", " : "),<br>"}`;
	}
	cp += "scores=c (";
	for (var i = 1; i < numRow; i++) {
		for (var j = 1; j < numCol - 1; j++) {
			cp += table.rows[i].cells[j].innerHTML;
			if (j < numCol - 2) { //if not end of line, space
				cp += ", ";
			}
			else if (i < numRow - 1) { //if end of line but not last line, break
				cp += ",<br>";
			}
		}
	}
	cp +=`))<br>newGrid <- makeRepgrid(args)<br>newGrid <- setScale(newGrid, ${table.rows[0].cells[0].innerHTML}, ${table.rows[0].cells[numCol - 1].innerHTML})<br>newGrid`;
	document.write(cp);
}