/* =========================================================
   EXPENSEFLOW
   Expense Tracker Application
========================================================= */


/* ================= DOM ELEMENTS ================= */

const transactionForm =
    document.getElementById("transactionForm");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const descriptionInput =
    document.getElementById("description");

const transactionList =
    document.getElementById("transactionList");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const balance =
    document.getElementById("balance");

const transactionCount =
    document.getElementById("transactionCount");

const submitButton =
    document.getElementById("submitButton");

const cancelEdit =
    document.getElementById("cancelEdit");

const formTitle =
    document.getElementById("formTitle");

const formError =
    document.getElementById("formError");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const currentDate =
    document.getElementById("currentDate");

const monthlyIncome =
    document.getElementById("monthlyIncome");

const monthlyExpense =
    document.getElementById("monthlyExpense");

const monthlySavings =
    document.getElementById("monthlySavings");

const selectedMonth =
    document.getElementById("selectedMonth");

const expensePercentage =
    document.getElementById("expensePercentage");

const expenseProgress =
    document.getElementById("expenseProgress");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const expenseChart =
    document.getElementById("expenseChart");

const chartEmpty =
    document.getElementById("chartEmpty");


/* ================= STATE ================= */

const STORAGE_KEY = "expenseFlowTransactions";

let transactions =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];

let editingId = null;


/*
    Selected month for analytics.
    Initially set to current month.
*/

let selectedDate = new Date();


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {

    setCurrentDate();

    setDefaultDate();

    populateCategoryFilter();

    renderEverything();

});


/* ================= CURRENT DATE ================= */

function setCurrentDate() {

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });

}


/* ================= DEFAULT FORM DATE ================= */

function setDefaultDate() {

    const today = new Date();

    dateInput.value =
        formatDateForInput(today);

}


/* ================= DATE FORMAT ================= */

function formatDateForInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* ================= CURRENCY ================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    ).format(amount);

}


/* ================= SAVE DATA ================= */

function saveTransactions() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

}


/* ================= FORM SUBMIT ================= */

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        clearError();


        const type =
            document.querySelector(
                'input[name="type"]:checked'
            ).value;

        const amount =
            Number(amountInput.value);

        const category =
            categoryInput.value;

        const date =
            dateInput.value;

        const description =
            descriptionInput.value.trim();


        /* ================= VALIDATION ================= */

        if (!amount || amount <= 0) {

            showError(
                "Please enter a valid amount greater than ₹0."
            );

            amountInput.focus();

            return;

        }


        if (!category) {

            showError(
                "Please select a category."
            );

            categoryInput.focus();

            return;

        }


        if (!date) {

            showError(
                "Please select a date."
            );

            dateInput.focus();

            return;

        }


        if (!description) {

            showError(
                "Please enter a description."
            );

            descriptionInput.focus();

            return;

        }


        /* ================= EDIT ================= */

        if (editingId !== null) {

            const index =
                transactions.findIndex(
                    transaction =>
                        transaction.id === editingId
                );


            if (index !== -1) {

                transactions[index] = {

                    ...transactions[index],

                    type,
                    amount,
                    category,
                    date,
                    description

                };

                showToast(
                    "Transaction updated successfully."
                );

            }

            editingId = null;

            resetForm();

        }


        /* ================= ADD ================= */

        else {

            const newTransaction = {

                id: Date.now(),

                type,

                amount,

                category,

                date,

                description,

                createdAt:
                    new Date().toISOString()

            };


            transactions.unshift(
                newTransaction
            );


            showToast(
                "Transaction added successfully."
            );

            resetForm();

        }


        saveTransactions();

        renderEverything();

    }
);


/* ================= RESET FORM ================= */

function resetForm() {

    transactionForm.reset();

    setDefaultDate();

    document.querySelector(
        'input[name="type"][value="income"]'
    ).checked = true;

    editingId = null;

    formTitle.textContent =
        "Add Transaction";

    submitButton.innerHTML =
        '<i class="fa-solid fa-plus"></i> Add Transaction';

    cancelEdit.classList.add("hidden");

    clearError();

}


/* ================= ERROR ================= */

function showError(message) {

    formError.textContent = message;

    formError.style.display = "block";

}


function clearError() {

    formError.textContent = "";

    formError.style.display = "none";

}


/* ================= TOAST ================= */

let toastTimeout;


function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

}


/* ================= RENDER EVERYTHING ================= */

function renderEverything() {

    updateSummary();

    populateCategoryFilter();

    renderTransactions();

    updateMonthlySummary();

    drawChart();

}


/* ================= SUMMARY ================= */

function updateSummary() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (transaction.type === "income") {

                income += transaction.amount;

            } else {

                expense += transaction.amount;

            }

        }
    );


    const currentBalance =
        income - expense;


    totalIncome.textContent =
        formatCurrency(income);

    totalExpense.textContent =
        formatCurrency(expense);

    balance.textContent =
        formatCurrency(currentBalance);

}


/* ================= CATEGORY FILTER ================= */

function populateCategoryFilter() {

    const currentValue =
        categoryFilter.value;


    const categories =
        [
            ...new Set(
                transactions.map(
                    transaction =>
                        transaction.category
                )
            )
        ].sort();


    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });


    if (
        categories.includes(currentValue)
    ) {

        categoryFilter.value =
            currentValue;

    }

}


/* ================= RENDER TRANSACTIONS ================= */

function renderTransactions() {

    const selectedType =
        typeFilter.value;

    const selectedCategory =
        categoryFilter.value;


    const filteredTransactions =
        transactions.filter(
            transaction => {

                const matchesType =
                    selectedType === "all" ||
                    transaction.type === selectedType;


                const matchesCategory =
                    selectedCategory === "all" ||
                    transaction.category === selectedCategory;


                return (
                    matchesType &&
                    matchesCategory
                );

            }
        );


    transactionCount.textContent =
        `${filteredTransactions.length} ${
            filteredTransactions.length === 1
                ? "transaction"
                : "transactions"
        }`;


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-receipt"></i>

                </div>

                <h3>No transactions found</h3>

                <p>
                    Try changing your filters or add a new transaction.
                </p>

            </div>

        `;

        return;

    }


    transactionList.innerHTML =
        filteredTransactions
            .map(createTransactionHTML)
            .join("");

}


/* ================= TRANSACTION HTML ================= */

function createTransactionHTML(transaction) {

    const isIncome =
        transaction.type === "income";


    const icon =
        getCategoryIcon(
            transaction.category
        );


    const formattedDate =
        new Date(
            transaction.date + "T00:00:00"
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );


    return `

        <div
            class="transaction-item"
            data-id="${transaction.id}"
        >

            <div class="transaction-left">

                <div
                    class="transaction-icon ${
                        isIncome
                            ? "income"
                            : "expense"
                    }"
                >

                    <i class="${icon}"></i>

                </div>


                <div class="transaction-info">

                    <h4>
                        ${escapeHTML(transaction.description)}
                    </h4>

                    <p>
                        ${escapeHTML(transaction.category)}
                        •
                        ${formattedDate}
                    </p>

                </div>

            </div>


            <div class="transaction-right">

                <div
                    class="transaction-amount ${
                        isIncome
                            ? "income"
                            : "expense"
                    }"
                >

                    ${
                        isIncome
                            ? "+"
                            : "-"
                    }

                    ${formatCurrency(transaction.amount)}

                </div>


                <div class="transaction-actions">

                    <button
                        class="action-btn"
                        title="Edit transaction"
                        onclick="editTransaction(${transaction.id})"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="action-btn delete"
                        title="Delete transaction"
                        onclick="deleteTransaction(${transaction.id})"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </div>

    `;

}


/* ================= CATEGORY ICON ================= */

function getCategoryIcon(category) {

    const icons = {

        Food:
            "fa-solid fa-utensils",

        Transport:
            "fa-solid fa-car",

        Shopping:
            "fa-solid fa-bag-shopping",

        Bills:
            "fa-solid fa-file-invoice",

        Entertainment:
            "fa-solid fa-film",

        Health:
            "fa-solid fa-heart-pulse",

        Education:
            "fa-solid fa-graduation-cap",

        Salary:
            "fa-solid fa-briefcase",

        Freelance:
            "fa-solid fa-laptop",

        Investment:
            "fa-solid fa-chart-line",

        Other:
            "fa-solid fa-wallet"

    };


    return (
        icons[category] ||
        icons.Other
    );

}


/* ================= EDIT ================= */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) return;


    editingId = id;


    document.querySelector(
        `input[name="type"][value="${transaction.type}"]`
    ).checked = true;


    amountInput.value =
        transaction.amount;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;

    descriptionInput.value =
        transaction.description;


    formTitle.textContent =
        "Edit Transaction";


    submitButton.innerHTML =
        '<i class="fa-solid fa-check"></i> Update Transaction';


    cancelEdit.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    amountInput.focus();

}


/* ================= CANCEL EDIT ================= */

cancelEdit.addEventListener(
    "click",
    resetForm
);


/* ================= DELETE ================= */

function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) return;


    const confirmed =
        confirm(
            `Delete "${transaction.description}"?`
        );


    if (!confirmed) return;


    transactions =
        transactions.filter(
            item => item.id !== id
        );


    saveTransactions();

    renderEverything();

    showToast(
        "Transaction deleted successfully."
    );

}


/* ================= FILTER EVENTS ================= */

typeFilter.addEventListener(
    "change",
    renderTransactions
);


categoryFilter.addEventListener(
    "change",
    renderTransactions
);


/* ================= MONTHLY SUMMARY ================= */

function updateMonthlySummary() {

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();


    const monthName =
        selectedDate.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    selectedMonth.textContent =
        monthName;


    const monthlyTransactions =
        transactions.filter(
            transaction => {

                const transactionDate =
                    new Date(
                        transaction.date + "T00:00:00"
                    );

                return (
                    transactionDate.getFullYear() === year &&
                    transactionDate.getMonth() === month
                );

            }
        );


    let income = 0;

    let expense = 0;


    monthlyTransactions.forEach(
        transaction => {

            if (
                transaction.type === "income"
            ) {

                income += transaction.amount;

            } else {

                expense += transaction.amount;

            }

        }
    );


    const savings =
        income - expense;


    monthlyIncome.textContent =
        formatCurrency(income);

    monthlyExpense.textContent =
        formatCurrency(expense);

    monthlySavings.textContent =
        formatCurrency(savings);


    const percentage =
        income > 0
            ? Math.min(
                (expense / income) * 100,
                100
            )
            : 0;


    expensePercentage.textContent =
        `${percentage.toFixed(0)}%`;


    expenseProgress.style.width =
        `${percentage}%`;

}


/* ================= MONTH NAVIGATION ================= */

previousMonth.addEventListener(
    "click",
    () => {

        selectedDate.setMonth(
            selectedDate.getMonth() - 1
        );

        updateMonthlySummary();

        drawChart();

    }
);


nextMonth.addEventListener(
    "click",
    () => {

        selectedDate.setMonth(
            selectedDate.getMonth() + 1
        );

        updateMonthlySummary();

        drawChart();

    }
);


/* ================= CHART ================= */

function drawChart() {

    const canvas =
        expenseChart;

    const context =
        canvas.getContext("2d");


    const rect =
        canvas.getBoundingClientRect();


    const devicePixelRatio =
        window.devicePixelRatio || 1;


    canvas.width =
        rect.width * devicePixelRatio;

    canvas.height =
        rect.height * devicePixelRatio;


    context.scale(
        devicePixelRatio,
        devicePixelRatio
    );


    const width =
        rect.width;

    const height =
        rect.height;


    context.clearRect(
        0,
        0,
        width,
        height
    );


    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();


    const expensesByCategory = {};


    transactions
        .filter(transaction => {

            const date =
                new Date(
                    transaction.date + "T00:00:00"
                );

            return (
                transaction.type === "expense" &&
                date.getFullYear() === year &&
                date.getMonth() === month
            );

        })
        .forEach(transaction => {

            if (
                !expensesByCategory[
                    transaction.category
                ]
            ) {

                expensesByCategory[
                    transaction.category
                ] = 0;

            }


            expensesByCategory[
                transaction.category
            ] += transaction.amount;

        });


    const entries =
        Object.entries(
            expensesByCategory
        );


    if (entries.length === 0) {

        chartEmpty.style.display =
            "flex";

        return;

    }


    chartEmpty.style.display =
        "none";


    const total =
        entries.reduce(
            (sum, [, value]) =>
                sum + value,
            0
        );


    const centerX =
        width / 2;

    const centerY =
        height / 2;

    const radius =
        Math.min(width, height) *
        0.34;


    const colors = [
        "#6759e8",
        "#e85d75",
        "#16a673",
        "#f0a34b",
        "#4d9de0",
        "#9b72cf",
        "#42b883",
        "#e07a5f",
        "#7c8db5",
        "#d45087",
        "#5eaaa8"
    ];


    let startAngle =
        -Math.PI / 2;


    entries.forEach(
        ([category, value], index) => {

            const slice =
                (value / total) *
                Math.PI *
                2;


            context.beginPath();

            context.moveTo(
                centerX,
                centerY
            );

            context.arc(
                centerX,
                centerY,
                radius,
                startAngle,
                startAngle + slice
            );

            context.closePath();

            context.fillStyle =
                colors[
                    index % colors.length
                ];

            context.fill();


            startAngle += slice;

        }
    );


    /* Inner circle */

    context.beginPath();

    context.arc(
        centerX,
        centerY,
        radius * 0.58,
        0,
        Math.PI * 2
    );

    context.fillStyle =
        "#ffffff";

    context.fill();


    /* Center text */

    context.fillStyle =
        "#171a24";

    context.textAlign =
        "center";

    context.textBaseline =
        "middle";


    context.font =
        "700 15px DM Sans";

    context.fillText(
        formatCurrency(total),
        centerX,
        centerY - 7
    );


    context.font =
        "11px DM Sans";

    context.fillStyle =
        "#8d91a0";

    context.fillText(
        "Total expenses",
        centerX,
        centerY + 13
    );

}


/* ================= WINDOW RESIZE ================= */

window.addEventListener(
    "resize",
    drawChart
);


/* ================= ESCAPE HTML ================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}