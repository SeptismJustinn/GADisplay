import React from "react";
import styles from "./css/WeekalendarRow.module.css";

function WeekalendarRow(props) {
  function getTimeString(date) {
    const meridiem = date.getHours() > 11 ? "PM" : "AM"
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")} ${meridiem}`
  }
  function extractNames(col) {
    // Check if multiples events conflict
    const output = col.map((item, idx) => {
      // If adhoc, show purpose in dashboard instead of event name
      // Different from display
      return (
        <div key={idx}>
          {item.schedule ? item.name : item.purpose}
          <br />
          {`(${getTimeString(item.starts)}-${getTimeString(item.ends)})`}
        </div>
      );
    });
    return output;
    // }
  }

  return (
    <div className={props.id % 2 == 0 ? styles.alt_row : styles.row}>
      <div className={styles.room}>{props.id}</div>
      <div
        className={`${props.sunday === 0 ? styles.sunday : ""} ${props.columns[0].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[0])}
      </div>
      <div
        className={`${props.sunday === 1 ? styles.sunday : ""} ${props.columns[1].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[1])}
      </div>
      <div
        className={`${props.sunday === 2 ? styles.sunday : ""} ${props.columns[2].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[2])}
      </div>
      <div
        className={`${props.sunday === 3 ? styles.sunday : ""} ${props.columns[3].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[3])}
      </div>
      <div
        className={`${props.sunday === 4 ? styles.sunday : ""} ${props.columns[4].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[4])}
      </div>
      <div
        className={`${props.sunday === 5 ? styles.sunday : ""} ${props.columns[5].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[5])}
      </div>
      <div
        className={`${props.sunday === 6 ? styles.sunday : ""} ${props.columns[6].length > 1 ? styles.overload_text : ""
          }`}
      >
        {extractNames(props.columns[6])}
      </div>
    </div>
  );
}

export default WeekalendarRow;
