// ========================================
// DOM ELEMENTS
// ========================================
const addPerson = document.querySelector(".addPerson");
const personName = document.querySelector("#peopleNameInput");
const peopleBox = document.querySelector("#peopleBox");
const checkboxesDiv = document.querySelector("#checkboxes");
const dropDownMenu = document.querySelector("#peopleDropdownMenu");
const calculateButton = document.querySelector("#addExpenseButton");
const resetCalculatorButton = document.querySelector("#resetButton");
const expensesBox = document.querySelector(".expenseDetails");
const settlementBox = document.querySelector("#settlementBox");

// ========================================
// GLOBAL VARIABLES
// ========================================
const settlements = [];
let balance = {};

// ========================================
// PEOPLE MANAGEMENT FUNCTIONS
// ========================================

/**
 * Add a new person to the people list display
 * @param {string} name - The name of the person to add
 */
function updatePeopleList(name) {
    console.log("Updating people list with:", name);
    let newPersonDiv = document.createElement("div");
    newPersonDiv.classList.add("personEntry");
    newPersonDiv.textContent = name;
    let cutLogo = document.createElement("i");
    cutLogo.classList.add("fa-solid", "fa-xmark", "cutLogo");
    newPersonDiv.appendChild(cutLogo);
    peopleBox.appendChild(newPersonDiv);
}

/**
 * Add checkboxes for a new person
 * @param {string} name - The name of the person to add checkbox for
 */
function updateCheckboxes(name) {
    console.log("Updating checkboxes with:", name);
    let checkboxLabel = document.createElement("label");
    checkboxLabel.textContent = name;
    let checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.value = name;
    checkboxLabel.prepend(checkboxInput);
    checkboxesDiv.appendChild(checkboxLabel);
    checkboxesDiv.appendChild(document.createElement("br"));
}

/**
 * Add person option to the dropdown menu
 * @param {string} name - The name to add as an option
 */
function addOptionToDropdown(name) {
    console.log("Adding option to dropdown:", name);
    let option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    dropDownMenu.appendChild(option);
}

/**
 * Remove a person from all lists (people, checkboxes, dropdown)
 * @param {Event} event - The click event on remove button
 */
function removePerson(event) {
    if(event.target.classList.contains("cutLogo")) {
        let personDiv = event.target.parentElement;
        let personName = personDiv.firstChild.textContent; 
        personDiv.remove();

        // Remove from checkboxes
        let checkboxes = checkboxesDiv.querySelectorAll("label");
        checkboxes.forEach(label => {
            if(label.textContent.trim() === personName) {
                let nextBr = label.nextElementSibling;
                label.remove();
                if(nextBr && nextBr.tagName === "BR") {
                    nextBr.remove();
                }
            }
        });

        // Remove from dropdown
        let options = dropDownMenu.querySelectorAll("option");
        options.forEach(option => {
            if(option.value === personName) {
                option.remove();
            }
        });
    }
}

// ========================================
// EVENT LISTENERS FOR PEOPLE MANAGEMENT
// ========================================

/**
 * Add person button click event
 */
addPerson.addEventListener("click", function() {
    console.log("Button Clicked");
    if(personName.value.trim() !== "") {
        updatePeopleList(personName.value);
        updateCheckboxes(personName.value);
        addOptionToDropdown(personName.value);
        personName.value = "";
    }
});

/**
 * Remove person button click event
 */
peopleBox.addEventListener("click", removePerson);

// ========================================
// SETTLEMENT & EXPENSE CALCULATION FUNCTIONS
// ========================================

/**
 * Add a settlement record (expense entry)
 * @param {string} payer - Name of the person who paid
 * @param {string} payee - Name of the person who needs to receive
 * @param {number} amount - Amount of money involved
 */
function addSettlement(payer, payee, amount) {
    settlements.push({ "from":payer, "to": payee, "amount": amount });
}

/**
 * Calculate individual balances for each person
 * Positive value = money owed to them, Negative = money they owe
 */
function calculateBalances() {
    balance = {};
    settlements.forEach(settlement => {
        if(!balance[settlement.from]) {
            balance[settlement.from] = 0;
        }
        if(!balance[settlement.to]) {
            balance[settlement.to] = 0;
        }
        balance[settlement.from] += settlement.amount;
        balance[settlement.to] -= settlement.amount;
    });
}

/**
 * Optimize settlements using greedy algorithm
 * Matches creditors with debtors to minimize number of transactions
 * @param {object} balance - Balance object with person names and amounts
 * @returns {array} Array of final settlement instructions
 */
function settleBalances(balance) {
    const finalSettlements = [];
    const creditors = [];
    const debtors = [];

    // Separate creditors and debtors
    for(const person in balance) {
        if(balance[person] > 0) {
            creditors.push({name: person, amount: balance[person]});
        } else if(balance[person] < 0) {
            debtors.push({name: person, amount: -balance[person]});
        }
    }

    // Match debtors with creditors
    let i = 0; 
    let j = 0;
    while(i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const settledAmount = Math.min(debtor.amount, creditor.amount);     
        finalSettlements.push({from: debtor.name, to: creditor.name, amount: settledAmount});
        debtor.amount -= settledAmount;
        creditor.amount -= settledAmount;
        if(debtor.amount === 0) i++;
        if(creditor.amount === 0) j++;
    }

    return finalSettlements;
}

/**
 * Display expense entries in the expenses section
 * @param {array} settlements - Array of settlement objects
 */
function addExpensesInfo(settlements) {
    for(let settlement of settlements) {
        let expenseDiv = document.createElement("div");
        expenseDiv.classList.add("expenseEntry");
        expenseDiv.innerHTML = `<b>${settlement.from}</b> pays <b>${settlement.to}</b> : Rupees <b>${settlement.amount.toFixed(2)}</b>`;
        expensesBox.appendChild(expenseDiv);
    }
}

/**
 * Display final settlement instructions in the settlement box
 * @param {array} finalSettlements - Array of final settlement objects
 */
function addSettlementInfo(finalSettlements) {
    settlementBox.innerHTML = "";
    for(let settlement of finalSettlements) {
        let settlementDiv = document.createElement("div");
        settlementDiv.classList.add("settlementEntry");
        settlementDiv.innerHTML = `<b>${settlement.from}</b> ows <b>${settlement.to}</b> : Rupees <b>${settlement.amount.toFixed(2)}</b>`;
        settlementBox.appendChild(settlementDiv);
    }
}

// ========================================
// RESET FUNCTIONS
// ========================================

/**
 * Uncheck all checkboxes
 */
function resetCheckBoxes() {
    let involvedCheckboxes = document.querySelectorAll("#checkboxes input[type='checkbox']");
    involvedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

/**
 * Reset dropdown to default selection
 */
function resetDropdown() {
    dropDownMenu.value = "Select Person...";
}

/**
 * Clear all data from the calculator
 */
function removePeople() {
    checkboxesDiv.innerHTML = "";
    dropDownMenu.innerHTML = '<option value="Select Person">Select Person...</option>';
    const elements = document.querySelectorAll('#peopleBox .personEntry');
    elements.forEach(element => element.remove());
    settlements.length = 0; 
    const expenseEntries = document.querySelectorAll(".expenseEntry");
    expenseEntries.forEach(entry => entry.remove());
    settlementBox.innerHTML = "<p>Add people and expenses to see the result.</p>";
    balance = {};
    document.querySelector("#expenseAmountInput").value = "";
}

// ========================================
// EVENT LISTENERS FOR EXPENSE CALCULATION
// ========================================

/**
 * Add Expense button click event
 * Validates input and calculates settlements
 */
calculateButton.addEventListener("click", function() {
    let payer = dropDownMenu.value;
    let amount = parseFloat(document.querySelector("#expenseAmountInput").value);
    let involvedCheckboxes = document.querySelectorAll("#checkboxes input[type='checkbox']:checked");
    let involvedPeople = Array.from(involvedCheckboxes).map(checkbox => checkbox.value);
    
    // Validate: payer selected, at least 2 people involved, amount entered
    if(payer !== "Select Person..." && involvedPeople.length > 1 && !isNaN(amount)) {
        console.log("Calculating Settlements");
        
        // Add settlement for each person involved
        for(let person of involvedPeople) {
            if(person === payer) continue; 
            let share = amount / involvedPeople.length;
            addSettlement(payer, person, share);
        }
        
        // Display and save results
        addExpensesInfo(settlements);
        calculateBalances();
        let finalSettlements = settleBalances(balance);
        console.log("Final Settlements:", finalSettlements);
        addSettlementInfo(finalSettlements);
        saveSettlements();
    }
    
    // Reset form
    resetCheckBoxes();
    resetDropdown();
    document.querySelector("#expenseAmountInput").value = "";
});

/**
 * Reset Calculator button click event
 */
resetCalculatorButton.addEventListener("click", function() {
    removePeople();
    saveSettlements();
});

// ========================================
// STORAGE MANAGEMENT FUNCTIONS
// ========================================

/**
 * Save settlements to localStorage
 */
function saveSettlements() {
    localStorage.setItem("settlementsData", JSON.stringify(settlements));
}

/**
 * Load settlements from localStorage
 */
function loadSettlements() {
    const data = localStorage.getItem("settlementsData");
    if(data) {
        settlements.push(...JSON.parse(data));
        if(settlements.length !== 0) {
            calculateBalances();
            let finalSettlements = settleBalances(balance);
            addSettlementInfo(finalSettlements);
            addExpensesInfo(settlements);
            loadNames();
        }
    }
}

/**
 * Load and display people from settlements
 * Extracts unique names and adds them to UI
 */
function loadNames() {
    let Names = [];

    // Extract unique names from settlements
    for(let settlement of settlements) {
        if(!Names.includes(settlement.from)) {
            Names.push(settlement.from);
        }
        if(!Names.includes(settlement.to)) {
            Names.push(settlement.to);
        }
    }

    console.log(Names);
    
    // Add names to all lists
    for(let name of Names) {
        if(name !== "") {
            updatePeopleList(name);
            updateCheckboxes(name);
            addOptionToDropdown(name);
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Load data when page loads
 */
window.addEventListener("DOMContentLoaded", function() {
    loadSettlements();
});