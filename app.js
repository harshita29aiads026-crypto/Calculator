
var Module = {
    onRuntimeInitialized: function () {
        startCalculator();
    }
};

function startCalculator() {
    const display = document.getElementById("display");
    const status = document.getElementById("status");

    const calculate = Module.cwrap(
        "calculate", "number",
        ["number", "number", "number"]
    );

    const calculateUnary = Module.cwrap(
        "calculateUnary", "number",
        ["number", "number"]
    );

    let current = "0";
    let stored = null;
    let operator = null;
    let fresh = true;
    let error = false;

    function show(value) {
        display.textContent = String(value);
    }

    function fail() {
        current = "Error";
        error = true;
        show(current);
    }

    function format(value) {
        if (!Number.isFinite(value)) {
            fail();
            return;
        }

        current = String(Number(value.toPrecision(12)));
        show(current);
        error = false;
    }

    function clearAll() {
        current = "0";
        stored = null;
        operator = null;
        fresh = true;
        error = false;
        show(current);
    }

    function digit(value) {
        if (error) clearAll();

        if (fresh) {
            current = value === "." ? "0." : value;
            fresh = false;
        } else if (value === "." && current.includes(".")) {
            return;
        } else if (current.replace("-", "").length < 16) {
            current += value;
        }

        show(current);
    }

    function chooseOperator(op) {
        if (error) return;

        if (operator !== null && !fresh) {
            const result = calculate(
                stored, Number(current), operator
            );

            if (!Number.isFinite(result)) {
                fail();
                return;
            }

            current = String(result);
            show(current);
        }

        stored = Number(current);
        operator = op;
        fresh = true;
    }

    function chooseUnary(op) {
        if (error) return;

        stored = Number(current);
        operator = "unary";
        unaryOperation = op;
        fresh = true;
    }

    let unaryOperation = null;

    function equals() {
        if (error || operator === null || fresh) return;

        let result;

        if (operator === "unary") {
            result = calculateUnary(stored, unaryOperation);
        } else {
            result = calculate(
                stored, Number(current), operator
            );
        }

        operator = null;
        stored = null;
        unaryOperation = null;
        fresh = true;

        format(result);
    }

    document.querySelectorAll("[data-digit]").forEach(button => {
        button.addEventListener("click", () => {
            digit(button.dataset.digit);
        });
    });

    document.querySelectorAll("[data-decimal]").forEach(button => {
        button.addEventListener("click", () => digit("."));
    });

    document.querySelectorAll("[data-op]").forEach(button => {
        button.addEventListener("click", () => {
            chooseOperator(Number(button.dataset.op));
        });
    });

    document.querySelectorAll("[data-unary]").forEach(button => {
        button.addEventListener("click", () => {
            chooseUnary(Number(button.dataset.unary));
        });
    });

    document.querySelector("[data-equals]")
        .addEventListener("click", equals);

    document.querySelector('[data-clear="all"]')
        .addEventListener("click", clearAll);

    document.querySelector('[data-clear="entry"]')
        .addEventListener("click", () => {
            current = "0";
            fresh = true;
            error = false;
            show(current);
        });

    status.textContent = "C engine ready";
    clearAll();
}

