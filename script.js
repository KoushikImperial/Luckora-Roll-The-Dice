
const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");

const rollOneButton = document.getElementById("rollOne");
const rollTwoButton = document.getElementById("rollTwo");
const clearButton = document.getElementById("clearHistory");

const totalDisplay = document.getElementById("total");
const resultLabel = document.getElementById("resultLabel");
const resultMessage = document.getElementById("resultMessage");

const rollCountDisplay = document.getElementById("rollCount");
const statRolls = document.getElementById("statRolls");
const statAverage = document.getElementById("statAverage");
const statHighest = document.getElementById("statHighest");

const historyList = document.getElementById("historyList");

let history = [];
let isRolling = false;

// Generate a random number between 1 and 6.
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Show the number on the die.
function showDie(die, number) {
    die.textContent = number;
    die.setAttribute("aria-label", `Die showing ${number}`);
}

// Update statistics and roll history.
function updateDisplay() {
    const count = history.length;

    rollCountDisplay.textContent =
        `${count} ${count === 1 ? "roll" : "rolls"}`;

    statRolls.textContent = count;

    if (count === 0) {
        statAverage.textContent = "—";
        statHighest.textContent = "—";

        historyList.innerHTML =
            '<p class="empty-state">No rolls yet. Make your first move!</p>';

        return;
    }

    const sum = history.reduce(
        (total, roll) => total + roll.total, 0
    );

    const highest = Math.max(
        ...history.map(roll => roll.total)
    );

    statAverage.textContent = (sum / count).toFixed(2);
    statHighest.textContent = highest;

    // Display the latest 10 rolls.
    historyList.innerHTML = history
        .slice(0, 10)
        .map((roll, index) => `
            <div class="history-item">
                <span>
                    #${count - index} ·
                    ${roll.dice} ${roll.dice === 1 ? "die" : "dice"}
                </span>
                <strong>
                    ${roll.values.join(" + ")} = ${roll.total}
                </strong>
            </div>
        `)
        .join("");
}

// Roll one or two dice.
function rollDice(numberOfDice) {
    if (isRolling) return;

    isRolling = true;

    rollOneButton.disabled = true;
    rollTwoButton.disabled = true;

    die2.classList.toggle("hidden", numberOfDice === 1);

    die1.classList.add("rolling");

    if (numberOfDice === 2) {
        die2.classList.add("rolling");
    }

    totalDisplay.textContent = "...";
    resultLabel.textContent = "ROLLING";
    resultMessage.textContent = "The dice are in motion!";

    // Wait for the animation to finish.
    setTimeout(() => {
        const values = [];

        for (let i = 0; i < numberOfDice; i++) {
            values.push(rollDie());
        }

        showDie(die1, values[0]);

        if (numberOfDice === 2) {
            showDie(die2, values[1]);
        }

        die1.classList.remove("rolling");
        die2.classList.remove("rolling");

        const total = values.reduce(
            (sum, value) => sum + value, 0
        );

        totalDisplay.textContent = total;
        resultLabel.textContent = "YOUR RESULT";

        if (numberOfDice === 2 && values[0] === values[1]) {
            resultMessage.textContent = "Doubles! Nice roll!";
        } else if (total === 6 * numberOfDice) {
            resultMessage.textContent = "Maximum roll! Incredible!";
        } else if (total === numberOfDice) {
            resultMessage.textContent = "The lowest possible roll!";
        } else {
            resultMessage.textContent = "Roll again and see what happens.";
        }

        // Save this roll to history.
        history.unshift({
            dice: numberOfDice,
            values: values,
            total: total
        });

        updateDisplay();

        isRolling = false;
        rollOneButton.disabled = false;
        rollTwoButton.disabled = false;

    }, 600);
}

// Button events.
rollOneButton.addEventListener("click", () => rollDice(1));
rollTwoButton.addEventListener("click", () => rollDice(2));

// Clear all previous rolls.
clearButton.addEventListener("click", () => {
    if (isRolling) return;

    history = [];

    showDie(die1, 1);
    showDie(die2, 1);

    die2.classList.add("hidden");

    totalDisplay.textContent = "—";
    resultLabel.textContent = "YOUR RESULT";
    resultMessage.textContent = "Ready when you are.";

    updateDisplay();
});

// Initialize the page.
updateDisplay();
