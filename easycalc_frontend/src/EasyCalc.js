import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * EasyCalc - A compact, styled calculator component supporting +, -, ×, ÷, C, = and digit buttons.
 */
function EasyCalc() {
  // Internal state
  const [display, setDisplay] = useState("0"); // for the current (right) operand
  const [pendingOperator, setPendingOperator] = useState(null);
  const [operand, setOperand] = useState(null); // left operand as number
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState(false);
  const [inputSequence, setInputSequence] = useState(""); // Tracks user input sequence for display

  // Color scheme from requirements
  const colors = {
    primary: "#ffffff",
    secondary: "#222222",
    accent: "#007bff",
  };

  // Button grid
  const buttons = [
    { label: "7", type: "digit" }, { label: "8", type: "digit" }, { label: "9", type: "digit" }, { label: "÷", type: "operator" },
    { label: "4", type: "digit" }, { label: "5", type: "digit" }, { label: "6", type: "digit" }, { label: "×", type: "operator" },
    { label: "1", type: "digit" }, { label: "2", type: "digit" }, { label: "3", type: "digit" }, { label: "-", type: "operator" },
    { label: "C", type: "clear" }, { label: "0", type: "digit" }, { label: "=", type: "equal" }, { label: "+", type: "operator" },
  ];

  // Utility functions
  const isOperator = (ch) => ["+", "-", "×", "÷"].includes(ch);

  // Main input handler
  const handleButtonClick = (btn) => {
    if (error && btn.type !== "clear") {
      return; // Only allow 'C' after error
    }
    switch (btn.type) {
      case "digit":
        handleDigit(btn.label);
        break;
      case "operator":
        handleOperator(btn.label);
        break;
      case "equal":
        handleEqual();
        break;
      case "clear":
        handleClear();
        break;
      default:
        break;
    }
  };

  // Handles digit input
  const handleDigit = (digit) => {
    if (waitingForOperand || display === "0" || error) {
      setDisplay(digit);
      setWaitingForOperand(false);
      setError(false);

      // If starting a new operand after an operator, append operator + digit, else clear previous input (e.g., after equals)
      setInputSequence(seq => {
        // If just set waitingForOperand, inputSequence ends with an operator
        if (pendingOperator && waitingForOperand && operand !== null && !error) {
          // Already handled by operator logic previously
          return (operand !== null ? operand : "") + (pendingOperator ? " " + pendingOperator + " " : "") + digit;
        }
        // Reset input sequence if after error or after equals
        if (error || (!pendingOperator && operand === null)) {
          return digit;
        }
        return seq + digit;
      });

    } else {
      setDisplay(display.length < 12 ? display + digit : display);
      setInputSequence(seq => seq.length < 32 ? seq + digit : seq);
    }
  };

  // Handles clear/reset
  const handleClear = () => {
    setDisplay("0");
    setPendingOperator(null);
    setOperand(null);
    setWaitingForOperand(false);
    setError(false);
    setInputSequence("");
  };

  // Handles arithmetic operator
  const handleOperator = (op) => {
    if (pendingOperator && !waitingForOperand) {
      // Chained operation: evaluate previous first
      const result = safeEvaluate(operand, display, pendingOperator);
      if (result.err) {
        setDisplay(result.err);
        setError(true);
        setOperand(null);
        setPendingOperator(null);
        setInputSequence(seq => seq + " " + op);
        return;
      }
      setOperand(result.val);
      setDisplay(String(result.val));
      setInputSequence(seq => {
        // Update sequence to show the result then operator
        return String(result.val) + " " + op + " ";
      });
    } else {
      setOperand(parseFloat(display));
      setInputSequence(seq => {
        // If just entered operator (avoid stacking operators)
        if (/\s[+\-×÷]\s$/.test(seq)) {
          return seq.slice(0, -3) + " " + op + " ";
        }
        // Append with space: "12 + "
        return (seq || display) + " " + op + " ";
      });
    }
    setPendingOperator(op);
    setWaitingForOperand(true);
  };

  // Handles equals (=)
  const handleEqual = () => {
    if (pendingOperator && operand !== null && !waitingForOperand) {
      const result = safeEvaluate(operand, display, pendingOperator);
      if (result.err) {
        setDisplay(result.err);
        setError(true);
        setInputSequence(seq => seq + " =");
      } else {
        setDisplay(String(result.val));
        setInputSequence(seq =>
          (operand !== null && pendingOperator
            ? operand.toString() + " " + pendingOperator + " " + display + " ="
            : display + " ="
          )
        );
      }
      setOperand(null);
      setPendingOperator(null);
      setWaitingForOperand(true);
    }
  };

  // PUBLIC_INTERFACE
  // Safely evaluate the arithmetic
  function safeEvaluate(left, rightStr, op) {
    let right = parseFloat(rightStr);
    switch (op) {
      case "+":
        return { val: round2(left + right) };
      case "-":
        return { val: round2(left - right) };
      case "×":
        return { val: round2(left * right) };
      case "÷":
        if (right === 0) {
          return { err: "Error" };
        }
        return { val: round2(left / right) };
      default:
        return { val: right };
    }
  }

  // Round to fit display
  const round2 = (v) =>
    Number.isFinite(v)
      ? parseFloat(Number(v).toPrecision(10)).toString().slice(0, 12)
      : "Error";

  // Styling (inline for component-scoped, inspired by provided color scheme)
  const styles = {
    calculator: {
      width: "min(100vw, 340px)",
      margin: "48px auto",
      background: colors.primary,
      borderRadius: "14px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      border: `1px solid ${colors.secondary}33`,
    },
    // Display area for calculation/result (true calculator screen)
    displayContainer: {
      background: "#222222",
      borderRadius: "10px",
      minHeight: "76px",
      marginBottom: "18px",
      border: `1px solid #191919`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      boxSizing: "border-box",
      overflow: "hidden"
    },
    displayCalculation: {
      color: "#eeeeeecc",
      fontSize: "1.04rem",
      fontFamily: "monospace",
      textAlign: "right",
      padding: "12px 14px 1px 10px",
      minHeight: "22px",
      letterSpacing: "1px",
      wordBreak: "break-all",
      userSelect: "all",
      borderRadius: "7px 7px 0 0",
      background: "transparent",
      opacity: error ? 0.50 : 0.80,
      fontWeight: 400,
    },
    displayOutput: {
      color: error ? "#d32f2f" : "#fff",
      fontSize: "2.14rem",
      fontWeight: 700,
      fontFamily: "monospace",
      textAlign: "right",
      padding: "2px 14px 9px 10px",
      minHeight: "38px",
      letterSpacing: "1px",
      wordBreak: "break-all",
      userSelect: "all",
      background: "transparent",
    },
    buttonGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "12px"
    },
    button: {
      border: "none",
      borderRadius: "6px",
      fontSize: "1.15rem",
      fontWeight: 500,
      padding: "16px 0",
      cursor: "pointer",
      background: colors.secondary,
      color: colors.primary,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "background 0.1s, color 0.1s"
    },
    buttonAccent: {
      background: colors.accent,
      color: "#fff"
    },
    buttonDanger: {
      background: "#dc3545",
      color: "#fff"
    },
    buttonEqual: {
      background: "#16a34a",
      color: "#fff"
    }
  };

  // Button coloring by type/role
  const getButtonStyle = (btn) => {
    if (btn.type === "operator") return { ...styles.button, ...styles.buttonAccent };
    if (btn.type === "clear") return { ...styles.button, ...styles.buttonDanger };
    if (btn.type === "equal") return { ...styles.button, ...styles.buttonEqual };
    // default
    return styles.button;
  };

  return (
    <section style={styles.calculator} aria-label="EasyCalc Calculator">
      {/* Combined display area with both calculation sequence and current output */}
      <div style={styles.displayContainer} data-testid="dual-display">
        <div
          style={styles.displayCalculation}
          data-testid="sequence-display"
          aria-label="Calculation Sequence"
        >
          {inputSequence}
        </div>
        <div
          style={styles.displayOutput}
          data-testid="display"
          aria-live="polite"
        >
          {display}
        </div>
      </div>
      <div style={styles.buttonGrid}>
        {buttons.map((btn, i) => (
          <button
            key={btn.label}
            style={getButtonStyle(btn)}
            onClick={() => handleButtonClick(btn)}
            aria-label={btn.label}
            data-testid={"btn-" + btn.label}
            disabled={error && btn.type !== "clear"}
            tabIndex={0}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default EasyCalc;
