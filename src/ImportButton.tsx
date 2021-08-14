import React from "react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";

export enum ButtonStates {
  BASE,
  LOADING,
  LOADED,
  FAILED,
}
function ImportButton(props: {
  buttonState: ButtonStates;
  importBook: () => void;
  resetButton: () => void;
}) {
  const { buttonState, importBook, resetButton } = props;
  switch (buttonState) {
    default:
    case ButtonStates.BASE:
      return (
        <button
          type="button"
          className="inline-flex items-center p-2 px-3 border border-transparent rounded-full shadow-sm text-white text-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={importBook}
        >
          Import
        </button>
      );
    case ButtonStates.LOADING:
      return (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    case ButtonStates.LOADED:
      return (
        <button
          type="button"
          title="Import successful"
          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={resetButton}
        >
          <CheckIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      );
    case ButtonStates.FAILED:
      return (
        <button
          type="button"
          onClick={resetButton}
          title="Import failed. Contact support at hey@tedis.me"
          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      );
  }
}

export default ImportButton;
