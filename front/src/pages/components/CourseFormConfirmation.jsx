import React from "react";
import ReactDOM from "react-dom";
import modal from "./css/ModalBackdrop.module.css";

function Overlay(props) {
  return (
    <div
      className={modal.backdrop}
      onClick={() => props.setFormComplete(false)}
    >
      <div className={modal.modal} onClick={(e) => e.stopPropagation()}>
        Hello
      </div>
    </div>
  );
}

function CourseFormConfirmation(props) {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay setFormComplete={props.setFormComplete} />,
        document.querySelector("#modal-root")
      )}
    </>
  );
}

export default CourseFormConfirmation;