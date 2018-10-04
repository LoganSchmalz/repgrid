function createRow() {
	var rowLabel = document.getElementById("rowLabel");
	var label = rowLabel.value; //get input
	
	if (label != "") {
		var table = document.getElementById("repGrid"); //get table and add row
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
		headerCell.innerHTML = "Not " + label; //makin the not-construct on the right side
		headerCell.contentEditable = "true";
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
	if (table.rows.length > 1) {
		table.deleteRow(table.rows.length - 1);
	}
}

function removeColumn() {
	var table = document.getElementById("repGrid");
	if (table.rows[0].cells.length > 2) {
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
	
	var txt = new String;
	txt += "RANGE\n" + table.rows[0].cells[0].innerHTML + " " + table.rows[0].cells[table.rows[0].cells.length - 1].innerHTML + "\nEND RANGE\n";
	
	txt += "ELEMENTS\n"
	for (var col = 1; col < numCol - 1; col++) {
		txt += table.rows[0].cells[col].innerHTML + "\n";
	}
	txt += "END ELEMENTS\n";
	
	txt += "CONSTUCTS\n"
	for (var row = 1; row < numRow; row++) {
		txt += table.rows[row].cells[0].innerHTML + " : " + table.rows[row].cells[table.rows[row].cells.length - 1].innerHTML + "\n";
	}
	txt += "END CONSTRUCTS\n"
	
	txt += "RATINGS\n"
	for (var row = 1; row < numRow; row++) {
		for (var col = 1; col < numCol - 1; col++) {
			txt += table.rows[row].cells[col].innerHTML;
			txt += col < numCol - 2 ? " " : "";
		}
		txt += "\n";
	}
	txt += "END RATINGS\n"
	
	var FileSaver = require("file-saverjs");
	var blob = new Blob([txt], {type: "text/plain;charset=utf-8});
	FileSaver.saveAs(blob, "repGrid.txt");
	
	console.log(txt);
}