"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  onClick: () => void;
}

const BackdropElement = ({ onClick }: Props) => {
  useEffect(() => {
    if (document) {
      document.body.classList.add("overflow-hidden");
    }
    return () => {
      if (document) {
        document.body.classList.remove("overflow-hidden");
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className="background-light700_dark400 fixed inset-0 z-10 opacity-50"
    />
  );
};

export default function Backdrop({ onClick }: Props) {
  return createPortal(<BackdropElement onClick={onClick} />, document.body);
}
