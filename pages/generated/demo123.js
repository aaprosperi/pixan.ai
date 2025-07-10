// Generated App: Demo Calculator
// Created: 2025-07-10T00:30:00.000Z
// Description: Calculadora simple para demostrar el sistema

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

export default function DemoCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  return (
    <>
      <Head>
        <title>Demo Calculator - Pixan.ai</title>
        <meta name="description" content="Calculadora generada como demo del sistema" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Calculator Demo</h1>
            <p className="text-gray-600 text-sm">Generado automáticamente por Pixan.ai</p>
          </div>

          {/* Display */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="text-right text-white text-3xl font-mono overflow-hidden">
              {display}
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={clearDisplay}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => inputOperation('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              ÷
            </button>
            <button
              onClick={() => inputOperation('*')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              ×
            </button>

            <button
              onClick={() => inputNumber(7)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              7
            </button>
            <button
              onClick={() => inputNumber(8)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              8
            </button>
            <button
              onClick={() => inputNumber(9)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              9
            </button>
            <button
              onClick={() => inputOperation('-')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              -
            </button>

            <button
              onClick={() => inputNumber(4)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              4
            </button>
            <button
              onClick={() => inputNumber(5)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              5
            </button>
            <button
              onClick={() => inputNumber(6)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              6
            </button>
            <button
              onClick={() => inputOperation('+')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              +
            </button>

            <button
              onClick={() => inputNumber(1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              1
            </button>
            <button
              onClick={() => inputNumber(2)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              2
            </button>
            <button
              onClick={() => inputNumber(3)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              3
            </button>
            <button
              onClick={performCalculation}
              className="row-span-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-lg font-semibold transition-colors"
            >
              =
            </button>

            <button
              onClick={() => inputNumber(0)}
              className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              0
            </button>
            <button
              onClick={() => inputNumber('.')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-4 text-lg font-semibold transition-colors"
            >
              .
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ✨ App generada por IA - Pixan.ai Generator
            </p>
          </div>
        </div>
      </div>
    </>
  );
}