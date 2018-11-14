function generateTable() {
	var tableDiv = document.getElementById("tableDiv");
	var buttonDiv = document.getElementById("buttonDiv");
	//buttonDiv.innerHTML = `<button onclick="exportToXLSX">Export to Excel</button><button onclick="exportToTXT">Export to text file</button><button onclick="exportToORG">Copy to OpenRepGrid</button>`;
	tableDiv.innerHTML = `
		<table id="repGrid"><tbody>
			<tr>
				<td contenteditable="true">${document.getElementById("ratingL").value}</td>
				<td contenteditable="true">${document.getElementById("ratingR").value}</td>
			</tr>
		</tbody></table>`;
		//<input type="text" id="rowLeftInput"><input type="text" id="rowRightInput"><button id="addConstruct");">+</button>
		//<a onclick="removeRow();" href="">Delete Construct</a>`;
	//tableDiv.insertAdjacentHTML("afterend", `<input type="text" id="colInput"><button id="addElement");">+</button>
	//<a onclick="removeColumn();" href="">Delete Element</a>`);
	//create rest of table
	var colLabels = document.getElementById("elements").value.split(",");
	if (colLabels[0] == "") { colLabels[0] = "Element1"; } //default element
	for (var i = 0; i < colLabels.length; i++) {
		createColumn(colLabels[i].trim());
	}
	
	var leftLabels = document.getElementById("constructs").value.split(",");
	if (leftLabels[0] == "") { leftLabels[0] = "Construct1"; } //default construct
	var rightLabels = document.getElementById("not-constructs").value.split(",");
	for (var i = 0; i < leftLabels.length; i++) {
		if (rightLabels[i] == "") { rightLabels[i] = `Not ${leftLabels[i]}`; }
		createRow(leftLabels[i].trim(), rightLabels[i].trim());
	}
	
	createButtonsAndInputs();
	//document.getElementById("buttonDiv").removeChild(document.getElementById("generate"));
	document.body.removeChild(document.getElementById("input"));
}

function createRow(inputLeft, inputRight) {
	var leftLabel = inputLeft; //get input
	if (typeof leftLabel != 'string') {
		leftLabel = leftLabel.value;
	}
	var rightLabel = inputRight;
	if (typeof rightLabel != 'string') {
		rightLabel = rightLabel.value;
	}
	
	if (leftLabel != "") {
		var table = document.getElementById("repGrid");
		var row = table.insertRow(-1);
		
		var headerCell = document.createElement("th"); //create left side
		headerCell.innerHTML = leftLabel;
		headerCell.contentEditable = "true";
		row.appendChild(headerCell);
		
		for (var i = 1; i < table.rows[0].cells.length - 1; i++) { //make input for every cell other than ends
			var inputCell = document.createElement("td");
			inputCell.contentEditable = "true";
			inputCell.onkeypress = "return testCharacter(event);"
			row.appendChild(inputCell);
		}
		
		headerCell = document.createElement("th"); //create right side
		headerCell.innerHTML = rightLabel;
		headerCell.contentEditable = "true";
		row.appendChild(headerCell);
		
		inputLeft.value = ""; //clear input
		inputRight.value = "";
	}
}

function createColumn(input) {
	//console.log(input);
	if (document.getElementById("colInput")) {
		input = document.getElementById("colInput");
		console.log(document.getElementById("colInput").value);//input = document.getElementById("colInput").value;
		}
	//var columnLabel = document.getElementById("columnLabel");
	var label = input; //get input
	if (typeof label != 'string') {
		console.log("test");
		label = label.value;
	}
		
	if (label != "") {
		var table = document.getElementById("repGrid");
		var colNum = table.rows[0].cells.length - 1; //subtract 1 so we know index of last column (arrays start at 0)
		
		var headerCell = document.createElement("th"); //create construct label
		headerCell.innerHTML = label;
		headerCell.contentEditable = "true";
		table.rows[0].insertBefore(headerCell, table.rows[0].cells[colNum]); //inserts before the last column (last column is ratings/not-constructs)
				
		for (var i = 1; i < table.rows.length; i++) { //make input for eveyr other cell in column
			var inputCell = document.createElement("td");
			inputCell.contentEditable = "true";
			inputCell.onkeypress = "return testCharacter(event);"
			table.rows[i].insertBefore(inputCell, table.rows[i].cells[colNum]); //again, instert before last column
		}
	}
	
	input.value = ""; //clear input
}

function testCharacter(event) {
	if ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 13) {
		return true;
	} else {
		return false;
	}
}

function createButtonsAndInputs() {
	var tableDiv = document.getElementById("tableDiv");
	
	//construct input
	var rowLeftInput = document.createElement("input");
	rowLeftInput.type = "text";
	rowLeftInput.id = "rowLeftInput";
	tableDiv.appendChild(rowLeftInput);
	var rowRightInput = document.createElement("input");
	rowRightInput.type = "text";
	rowRightInput.id = "rowRightInput";
	tableDiv.appendChild(rowRightInput);
	var newRowButton = document.createElement("button");
	newRowButton.innerHTML = "+";
	newRowButton.onclick = function() {createRow(rowLeftInput, rowRightInput);};
	tableDiv.appendChild(newRowButton);
	var delRowLink = document.createElement("a");
	delRowLink.innerHTML = "Delete Construct";
	delRowLink.href = "";
	delRowLink.onclick = function() {removeRow();};
	tableDiv.appendChild(delRowLink);
	
	//element input
	var colInput = document.createElement("input");
	colInput.type = "text";
	colInput.id = "colInput";
	document.body.appendChild(colInput);
	var newColButton = document.createElement("button");
	newColButton.innerHTML = "+";
	newColButton.addEventListener("click", createColumn);
	//newColButton.onclick = function() {createColumn(colInput);};
	document.body.appendChild(newColButton);
	var delColLink = document.createElement("a");
	delColLink.innerHTML = "Delete Element";
	delColLink.href = "";
	delColLink.onclick = function() {removeColumn();};
	document.body.appendChild(delColLink);

	//generate export buttons
	var buttonDiv = document.getElementById("buttonDiv"); //replace Generate Table button with these
	//excel
	var exportToXLSXButton = document.createElement("button");
	exportToXLSXButton.innerHTML = "Export to Excel";
	exportToXLSXButton.addEventListener("click", exportToXLSX);
	buttonDiv.appendChild(exportToXLSXButton);
	//txt
	var exportToTXTButton = document.createElement("button");
	exportToTXTButton.innerHTML = "Export to text file";
	exportToTXTButton.addEventListener("click", exportToTXT);
	buttonDiv.appendChild(exportToTXTButton);
	//OpenRepGrid
	var exportToORGButton = document.createElement("button");
	exportToORGButton.innerHTML = "Copy to OpenRepGrid";
	exportToORGButton.addEventListener("click", exportToORG);
	buttonDiv.appendChild(exportToORGButton);
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
	
	var numRow = table.rows.length;
	var numCol = table.rows[0].cells.length;
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
	
	var numRow = table.rows.length;
	var numCol = table.rows[0].cells.length;
	
	var cp = new String;
	cp += `args <- list(<br>`;
	cp += `name= c(`;
	for (var i = 1; i < numCol - 1; i++) {
		cp += `'${table.rows[0].cells[i].innerHTML}'${i < numCol - 2 ? ", " : "),<br>"}`;
	}
	cp += `l.name= c(`
	for (var i = 1; i < numRow; i++) {
		cp += `'${table.rows[i].cells[0].innerHTML}'${i < numRow - 1 ? ", " : "),<br>"}`;
	}
	cp += `r.name= c(`
	for (var i = 1; i < numRow; i++) {
		cp += `'${table.rows[i].cells[numCol - 1].innerHTML}'${i < numRow - 1 ? ", " : "),<br>"}`;
	}
	cp += `scores=c (`;
	for (var i = 1; i < numRow; i++) {
		for (var j = 1; j < numCol - 1; j++) {
			cp += table.rows[i].cells[j].innerHTML;
			if (j < numCol - 2) { //if not end of line, space
				cp += `, `;
			}
			else if (i < numRow - 1) { //if end of line but not last line, break
				cp += `,<br>`;
			}
		}
	}
	cp +=`))<br>newGrid <- makeRepgrid(args)<br>newGrid <- setScale(newGrid, ${table.rows[0].cells[0].innerHTML}, ${table.rows[0].cells[numCol - 1].innerHTML})<br>newGrid`;
	document.write(cp);
}

function importFromXLSX() {
	var table = document.getElementById("repGrid");
}