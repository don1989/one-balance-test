import React, { JSX } from "react";

interface Props {
  text: string | JSX.Element;
  type: "submit" | "reset" | "button";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ text, type, disabled, onClick }: Props) {
  return (
    <button
      className="border rounded-md p-2 mt-4 hover:bg-orange-500 min-w-16"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
