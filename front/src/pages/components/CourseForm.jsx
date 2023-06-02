import React, { useState } from "react";
import styles from "./css/CourseForm.module.css";
import CourseFormConfirmation from "./CourseFormConfirmation";

function CourseForm(props) {
  // Course specifics
  const [courseCode, setCourseCode] = useState(props.course?.name || "");
  const [courseType, setCourseType] = useState("");
  const [courseRoom, setCourseRoom] = useState("");

  // Days picker
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wed, setWed] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  // Sat odd
  const [sao, setSao] = useState(false);
  // Sat eve
  const [sae, setSae] = useState(false);
  const [sun, setSun] = useState(false);

  // Date-time pickers
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Control opening of confirmation modal
  const [formComplete, setFormComplete] = useState(false);

  function handleChange(event, cb) {
    cb(event.target.value);
  }

  function handleCheck(state, cb) {
    cb(!state);
  }

  function consolidateDays() {
    return [mon, tue, wed, thu, fri, sao, sae, sun];
  }

  return (
    <>
      <form className={styles.form}>
        <div>
          <label>
            Course Code
            <input
              type="text"
              value={courseCode}
              onChange={(e) => handleChange(e, setCourseCode)}
            />
          </label>
          <label>
            Course Type
            <select
              name="course_type"
              value={courseType}
              onChange={(e) => handleChange(e, setCourseType)}
            >
              <option value="" disabled hidden>
                ---
              </option>
              <option value="FT">Full Time</option>
              <option value="Flex">Flex</option>
              <option value="PT">Part Time</option>
            </select>
          </label>
          <label>
            Room
            <select
              name="room"
              value={courseRoom}
              onChange={(e) => handleChange(e, setCourseRoom)}
            >
              <option value="" disabled hidden>
                ---
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>
          <div className={styles.checkbox_container}>
            <div className={styles.checkbox_main_label}>Days on campus:</div>
            <div className={styles.checkbox}>
              <label>
                <input
                  type="checkbox"
                  checked={mon}
                  onChange={() => handleCheck(mon, setMon)}
                />
                Monday
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={tue}
                  onChange={() => handleCheck(tue, setTue)}
                />
                Tuesday
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={wed}
                  onChange={() => handleCheck(wed, setWed)}
                />
                Wednesday
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={thu}
                  onChange={() => handleCheck(thu, setThu)}
                />
                Thursday
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={fri}
                  onChange={() => handleCheck(fri, setFri)}
                />
                Friday
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={sao}
                  onChange={() => handleCheck(sao, setSao)}
                />
                Saturday (Odd)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={sae}
                  onChange={() => handleCheck(sae, setSae)}
                />
                Saturday (Even)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={sun}
                  onChange={() => handleCheck(sun, setSun)}
                />
                Sunday
              </label>
            </div>
          </div>
          <div className={styles.datetime_container}>
            <div className={styles.datetime_grid}>
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                onChange={(e) => handleChange(e, setStartDate)}
              />
              <label htmlFor="start_time">Start Time</label>
              <input
                type="time"
                id="start_time"
                onChange={(e) => handleChange(e, setStartTime)}
              />
            </div>

            <div className={styles.datetime_grid}>
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                onChange={(e) => handleChange(e, setEndDate)}
              />
              <label htmlFor="end_time">End Time</label>
              <input
                type="time"
                id="end_time"
                onChange={(e) => {
                  handleChange(e, setEndTime);
                }}
              />
            </div>
          </div>
        </div>
      </form>
      <div className={styles.buttons_container}>
        <button
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            setFormComplete(true);
          }}
        >
          Add
        </button>
        <button className={styles.button}>Clear</button>
      </div>
      {formComplete && (
        <CourseFormConfirmation setFormComplete={setFormComplete} />
      )}
    </>
  );
}

export default CourseForm;
