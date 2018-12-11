function generateTable() {
	var elements = document.getElementById("elements").value.split(",");
	var leftConstructs = document.getElementById("constructs").value.split(",");
	var rightConstructs = document.getElementById("not-constructs").value.split(",");	
	var main = document.getElementsByTagName("main")[0];
	
	main.innerHTML = `
		<div id="grid"><button id="xlsx">Export to Excel</button><button id="txt">Export to text file</button><button id="org">Copy to OpenRepGrid</button><button id="analyze">Download Analysis</button><br><br>
		<div id="tableDiv">
			<table id="repGrid"><tbody><tr>
					<td contenteditable="true">${document.getElementById("ratingL").value}</td>
					<td contenteditable="true">${document.getElementById("ratingR").value}</td>
				</tr></tbody></table>
			<button id="addConstruct">+</button></div>
			<button id="addElement">+</button><br></div>
		<div><h3>Interview:</h3><div id="interview"></div><button id="next">Next</button><br><br><br>
		Delete Element/Construct: <input type="text" id="delInput"><button id="del" href="#">Delete</button>`;
	//<input type="text" id="rowLeftInput"><input type="text" id="rowRightInput">  <a id="delConstruct" href="#">Delete Construct</a>
	//<input type="text" id="colInput"> <a id="delElement" href="#">Delete Element</a>
	
	
	//add elements
	if (elements[0] == "") { elements[0] = "Element 1"; } //default element
	for (var i = 0; i < elements.length; i++) {
		addElement(elements[i].trim());
	}
	//add constructs
	if (leftConstructs[0] == "") { leftLabels[0] = "Construct 1"; } //default construct
	for (var i = 0; i < leftConstructs.length; i++) {
		if (rightConstructs[i] == "") { rightConstructs[i] = `Not ${leftConstructs[i]}`; }
		addConstruct(leftConstructs[i].trim(), rightConstructs[i].trim());
	}
	
	onTableLoad();
}

function onTableLoad() {
	document.getElementById("addElement").addEventListener("click", function() {addElement();});
	document.getElementById("addConstruct").addEventListener("click", function() {addConstruct();});
	//document.getElementById("delElement").addEventListener("click", removeElement);
	//document.getElementById("delConstruct").addEventListener("click", removeConstruct);
	document.getElementById("del").addEventListener("click", function() {removeElementConstruct();});
	
	document.getElementById("xlsx").addEventListener("click", exportToXLSX);
	document.getElementById("txt").addEventListener("click", exportToTXT);
	document.getElementById("org").addEventListener("click", exportToORG);
	document.getElementById("analyze").addEventListener("click", downloadAnalysis);
	
	document.getElementById("next").addEventListener("click", generateInterview);
}

function addElement(input = ""/*document.getElementById("colInput")*/) {
	var label = (typeof input != 'string' ? input.value : input); //get input
	
	var table = document.getElementById("repGrid");
	var colNum = table.rows[0].cells.length - 1; //subtract 1 so we know index of last column (arrays start at 0)
	
	var headerCell = `<th contenteditable="true">${label}</th>`;
	table.rows[0].cells[colNum].insertAdjacentHTML('beforebegin', headerCell);		
	
	for (var i = 1; i < table.rows.length; i++) { //make input for every other cell in column
		var cell = `<th contenteditable="true"></th>`;
		table.rows[i].cells[colNum].insertAdjacentHTML('beforebegin', cell); //again, insert before last column
	}
	
	//input.value = ""; //clear input
}

function addConstruct(inputLeft = ""/*document.getElementById("rowLeftInput")*/, inputRight = "" /*document.getElementById("rowRightInput")*/) {
	//var leftLabel = document.getElementById("rowLeftInput");
	//console.log(leftLabel);
	console.log(inputLeft);
	var leftLabel = (typeof inputLeft != 'string' ? inputLeft.value : inputLeft); //get input
	var rightLabel = (typeof inputRight != 'string' ? inputRight.value : inputRight);

	var table = document.getElementById('repGrid').getElementsByTagName('tbody')[0];
	table.insertAdjacentHTML('beforeend', `<tr><th contenteditable="true">${leftLabel}</th>${'<td contenteditable="true"></td>'.repeat(table.rows[0].cells.length-2)}<th contenteditable="true">${rightLabel}</th></tr>`);
	
	//inputLeft.value = "";
	//inputRight.value = "";
}

function generateInterview() {
	var table = document.getElementById("repGrid");
	var numCol = table.rows[0].cells.length - 2;
	var interview = document.getElementById("interview");
	interview.innerHTML += `${table.rows[0].cells[parseInt(numCol * Math.random(), 10) + 1].innerHTML}, ${table.rows[0].cells[parseInt(numCol * Math.random(), 10) + 1].innerHTML}, ${table.rows[0].cells[parseInt(numCol * Math.random(), 10) + 1].innerHTML}<br>`;
}

function removeElement() {
	var table = document.getElementById("repGrid");
	if (table.rows[0].cells.length > 2) { //make sure at least 2 columns are left
		for (var i = 0; i < table.rows.length; i++) {
			table.rows[i].deleteCell(table.rows[i].cells.length - 2);
		}
	}
}

function removeConstruct() {
	var table = document.getElementById("repGrid");
	if (table.rows.length > 1) { //make sure at least 2 rows are left
		table.deleteRow(table.rows.length - 1);
	}
}

function removeElementConstruct() {
	var table = document.getElementById("repGrid");
	label = document.getElementById("delInput").value;
	console.log(label);
	for (var i = 0; i < table.rows[0].cells.length; i++) {
		console.log(table.rows[0].cells[i].value === label);
		if (i > 0 && i < table.rows[0].cells.length && table.rows[0].cells[i].innerHTML == label) {
			for (var j = 0; j < table.rows.length; j++) {
				table.rows[j].deleteCell(i);
			}
		}
	}
	
	for (var i = 0; i < table.rows.length; i++) {
		if (i > 0 && table.rows[i].cells[0].innerHTML == label) {
			table.deleteRow(i);
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

function downloadAnalysis() {
	var table = document.getElementById("repGrid");	
	var numRow = table.rows.length;
	var numCol = table.rows[0].cells.length;
	var elements = new Array();
	for (var i = 1; i < numCol - 1; i++) {
		elements.push(table.rows[0].cells[i].innerHTML);
	}
	var constructs = new Array();
	for (var i = 1; i < numRow; i++) {
		constructs.push(table.rows[i].cells[0].innerHTML);
	}
	var notconstructs = new Array();
	for (var i = 1; i < numRow; i++) {
		notconstructs.push(table.rows[i].cells[numCol - 1].innerHTML);
	}
	var scores = new Array();
	for (var i = 1; i < numRow; i++) {
		for (var j = 1; j < numCol - 1; j++) {
			scores.push(table.rows[i].cells[j].innerHTML);
		}
	}
	var ratingL = table.rows[0].cells[0].innerHTML;
	var ratingR = table.rows[0].cells[numCol - 1].innerHTML;
	makeRequest("plotscript.php", elements, constructs, notconstructs, scores, ratingL, ratingR);
	
	function makeRequest(url, elements, constructs, notconstructs, scores, ratingL, ratingR)	{
		var oReq = new XMLHttpRequest();
		
		oReq.open("POST", url, true);
		oReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		var data = JSON.stringify({elements: elements, constructs: constructs, notconstructs: notconstructs, scores: scores, ratingL: ratingL, ratingR: ratingR});
		console.log(data);
		oReq.send(data);
		
		oReq.onreadystatechange = function() {		
			if (oReq.readyState === 4) {
				if (oReq.status === 200) {
					//console.log("AJAX success");
					//console.log(oReq.responseText);
					window.open(oReq.responseText);
				}
				else {
					console.log("AJAX err");
				}
			}
		};
	}	
}