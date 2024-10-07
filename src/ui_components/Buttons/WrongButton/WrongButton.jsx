import React from "react";
import "./WrongButton.css";

export default function WrongButton() {
  return (
    <button class="red-check-button">
      <span class="checkmark">
        <i class="fa-solid fa-xmark"></i>
      </span>
    </button>
  );
}
