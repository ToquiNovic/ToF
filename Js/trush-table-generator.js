/*---[TRUTH TABLE GENERATOR]---*/
var formula = document.getElementById('formula');
var remove = document.getElementById('remove');
var create = document.getElementById('create');
var download = document.getElementById('download');

var types = [['1', '0'], ['V', 'F']];

remove.addEventListener('click', function() {
	formula.value = '';
});

create.addEventListener('click', createTruthTable);

function createTruthTable() {
	//var genesisFormula = '((((p⇒(q∧r))∧(s⇒(¬r)))∧(s∨t))∧p)⇒t';
	//var genesisFormula = '(((p⇒q)∧(q⇒¬r))∧p)⇒¬r'
	var genesisFormula = '(' + formula.value + ')'; // Add parentheses to capture all the set
    genesisFormula = genesisFormula.replace(/\s+/g, ''); // Remove spaces
    
    // Get premises
    var premises = genesisFormula;
    var premiseArray = [];
    
    // Get maximum depth
    var depth = getMaxDepth(premises);
    
    var premiseColumns = [];
    for (var i = depth; i > 0; i--) {
    	var actualMaximum = 0;

    	// Get container number in each depth level
    	var containerNum = getContainerNum(i);
    	var containerLevelInitialized = false; // It'will be true when the character ( it has the depth level of that moment
    	var containerContents = '';

    	for (var e = 0; e < premises.length; e++) {
    		var char = premises.charAt(e);

    		// Get actual maximum
    		if (char == '(') {
    			actualMaximum++;
    		} else if (char == ')') {
    			if (actualMaximum > 0) {
    				actualMaximum--;
    			}
    		}

            // Create container
            if (char == '(' && actualMaximum == i && containerLevelInitialized == false) {
            	containerLevelInitialized = true;
            }

		    // If the the actual maximum is equal or bigger than depth, we take it
		    if (containerNum != 0 && actualMaximum >= i && containerLevelInitialized == true) {
		    	containerContents = containerContents + char;
		    }

		    // Toggle containerLevelInitialized to false for next iteration & add containerContents as a premise column
		    if (char == ')' && actualMaximum == i - 1 && containerLevelInitialized == true) {
		    	containerLevelInitialized = false;
		    	containerContents = containerContents.substr(1);
		    	premiseColumns.push(containerContents);
			    containerContents = ''; // Empty variable for new containers
			}
		}
	}

    // Check which letters are included & how many columns we need to create
    var letters = ['p','q','r','s','t'];
    var includedLetters = [];
    for (var l = 0; l < letters.length; l++) {
    	if (premises.includes(letters[l])) {
    		includedLetters.push(letters[l]);
    	}
    }
    var rowNum = Math.pow(2, includedLetters.length);

    // Build cells of initial variables (variables = letters)
    var reversedIncludedLetters = includedLetters.reverse(); // We reverse it to execute the loop for v
    var initalValueTable = []; // Seed table with the cells of initial variables
    for (var v = includedLetters.length - 1; v >= 0; v--) { // Loop to calculate the values of each letter column
    	var letterValues = [];
    	var boolean = true;
    	var interval = Math.pow(2, v);
    	var sectionNumber = rowNum / interval; // Section numbers are power of 2

    	letterValues.push(reversedIncludedLetters[v]);

	    for (var s = 0; s < sectionNumber; s++) { // Loop for sections
		    if (s % 2 == 0) { // Even sections are true & odd ones are false
		    	boolean = true;
		    } else {
		    	boolean = false;
		    }

		    for (var i = 0; i < interval; i++) { // Loop for section intervals
		    	letterValues.push(boolean);
		    }
		}

		initalValueTable.push(letterValues);
	}

	premiseArray = includedLetters.reverse().concat(premiseColumns);
	var table = initalValueTable;

    // Add premises to table
    for (var t = 0; t < premiseColumns.length; t++) {
	    // Add empty cells (?) to premise column
	    var premise = [];
	    premise.push(premiseColumns[t]);
	    for (var i = 0; i < rowNum; i++) {
	    	premise.push('?');
	    }

	    // Add premise column to the table
	    table.push(premise);
	}

    // Calculate values for each cell
    for (var c = includedLetters.length; c < table.length; c++) { //Loop which processes column by column
	    calculateColumn(c);
    }

    createHtmlTable(table); // Create HTML table

    function getContainerNum(depth) {
	    var actualMaximum = 0;
	    var containerNum = 0;

	    for (var e = 0; e < genesisFormula.length; e++) {
		    var char = genesisFormula.charAt(e);

		    // Get actual maximum
		    if (char == '(') {
			    actualMaximum++;
		    } else if (char == ')') {
			    if (actualMaximum > 0) {
				    actualMaximum--;
			    }
		    }

		    if (char == '(' && actualMaximum == depth) {
			    containerNum++;
		    }
	    }

	    return containerNum;
    }

    function getMaxDepth(string) {
	    var actualMaximum = 0;
	    var max = 0;

	    for (var i = 0; i < string.length; i++) {
		    var char = string.charAt(i);
		    if (char == '(') {
			    actualMaximum++;

			    if (actualMaximum > max) {
				    max = actualMaximum;
			    }
		    } else if (char == ')') {
			    if (actualMaximum > 0) {
				    actualMaximum--;
			    } else {
				    return -1;
			    }
		    }
	    }

	    if (actualMaximum != 0) {
		    return -1;
	    } else {
		    return max;
	    }
    }

    function calculateColumn(col) {
	    columnPremise = table[col][0];

	    for (var row = 1; row <= rowNum; row++) {
		    var cellPremise = columnPremise; // Create this variable to avoid ruin columnPremise

            // Replace letters by already found values in previous columns (-1 in var c to skip current column)
            for (var c = col - 1; c >= 0; c--) {
        	    if (cellPremise.includes(premiseArray[c])) {
        		    var boolean = table[c][row];

        		    if (boolean) {
				        boolean = '1'; // 1 if it's true
				    } else {
				        boolean = '0'; // 0 if it's false
				    }

				    cellPremise = cellPremise.replace(premiseArray[c], boolean);
			    }
		    }

	        cellPremise = cellPremise.replace(/¬/g, '!'); //NOT
            cellPremise = cellPremise.replace(/∧/g, '&&'); //AND
            cellPremise = cellPremise.replace(/∨/g, '||'); //OR
            cellPremise = cellPremise.replace(/⊕/g, '!='); //XOR
            cellPremise = cellPremise.replace(/⇔/g, '=='); //Biconditional

            if (cellPremise.includes('⇒')) { // Material conditional
        	    cellPremise = '!(' + cellPremise.replace('⇒', '&&!') + ')';
            }

		    // Replace 1 & 0 by true & false
		    cellPremise = cellPremise.replace(/1/g, 'true');
		    cellPremise = cellPremise.replace(/0/g, 'false');

            // Add cell value to table
            table[col][row] = eval(cellPremise);
        }
    }
};

function insert(val) {
	var startPosition = formula.selectionStart;
    var endPosition = formula.selectionEnd;
        
    // Check if text is selected
    if(startPosition == endPosition){
        formula.value = [formula.value.slice(0, startPosition), val, formula.value.slice(startPosition)].join('');
    }else{
    	formula.value = [formula.value.slice(0, startPosition), val, formula.value.slice(endPosition)].join('');
    }
}

function createHtmlTable(matrix) {
	var columnNum = matrix.length;
	var rowNum = matrix[0].length;

	var table = document.getElementById('truthTable');

	var selectedType = document.querySelector('input[name="tipo"]:checked').value;

	table.innerHTML = '';

	for (var r = 0; r < rowNum; r++) {
		var row = document.createElement('tr');
		for (var c = 0; c < columnNum; c++) {
			var cell = document.createElement('td');
			var value = matrix[c][r].toString();
			if (r != 0) { // Change to true or false except premises (which are in first row)
				if (value == 'true') {
				    value = types[selectedType][0];
			    }else{
				    value = types[selectedType][1];
			    }
			}
			cell.appendChild(document.createTextNode(value));
            row.appendChild(cell);
		}
		table.appendChild(row);
	}

	// Create png image & download link
    html2canvas(document.getElementById('truthTable')).then(canvas => {
        download.download = 'truth_table.png';
        // Convert image to Base64
        download.href = canvas.toDataURL();

        download.style.display = 'inline';
    });
}