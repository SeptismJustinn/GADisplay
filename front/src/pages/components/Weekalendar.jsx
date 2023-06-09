import React, { useRef } from "react";
import styles from "./css/Weekalendar.module.css";
import WeekalendarRow from "./WeekalendarRow";

function Weekalendar(props) {
  // Get today's date at 12AM GMT +8
  const today =
    props.date.getTime() + props.date.getTimezoneOffset() * 60 * 1000;
  const week_dates = [
    today,
    today + 86400000,
    today + 86400000 * 2,
    today + 86400000 * 3,
    today + 86400000 * 4,
    today + 86400000 * 5,
    today + 86400000 * 6,
  ].map((item) => {
    return new Date(item);
  });
  // Idx of Sunday column
  const sunday = useRef(0);

  function resolveClassesToDates(arr) {
    if (!arr || arr.length < 1) {
      // To handle pre-fetch
      return [];
    }
    // Arrays ordered by (Cohorts: room > start) > (Adhocs: room > start)
    const room1 = groupClassesByRooms(arr.filter((item) => item.room === 1));
    const room2 = groupClassesByRooms(arr.filter((item) => item.room === 2));
    const room3 = groupClassesByRooms(arr.filter((item) => item.room === 3));
    const room4 = groupClassesByRooms(arr.filter((item) => item.room === 4));
    const room5 = groupClassesByRooms(arr.filter((item) => item.room === 5));
    const room6 = groupClassesByRooms(arr.filter((item) => item.room === 6));
    return [room1, room2, room3, room4, room5, room6];
  }

  function groupClassesByRooms(filteredArr) {
    const room = [[], [], [], [], [], [], []];
    // filteredArr may include courses or ad-hocs
    for (const item of filteredArr) {
      for (let i = 0; i < week_dates.length; i++) {
        const date = week_dates[i];
        if (item.ends - date < 0) {
          // If end_date - date < 0, course has already ended.
          break;
        }
        const start_diff = item.starts - date;
        if (start_diff >= 604800000) {
          // If the course starts next week+, skip this week.
          break;
        } else if (start_diff >= 86400000) {
          // If start_diff >= 24hrs, course has yet to start, skip this day.
          continue;
        } else {
          const day = date.getDay();
          if (day < 6) {
            if (item.days.includes(day)) {
              room[i].push(item);
            } else if (date.toDateString() == item.ends.toDateString()) {
              room[i].push(item);
            } else if (date.toDateString() == item.starts.toDateString()) {
              room[i].push(item);
            }
          } else {
            //Check if item scheduled on a saturday.
            const saturday = item.days.find((ele) => ele >= 6);
            if (saturday) {
              // Assumes courses with sat lessons always starts on sat
              if (
                saturday === 8 &&
                Math.floor((item.starts - date) / 604800000) % 2 === 0
              ) {
                // Odd Saturdays
                room[i].push(item);
              } else if (
                saturday === 7 &&
                Math.floor((item.starts - date) / 604800000) % 2 !== 0
              ) {
                // Even Saturdays
                room[i].push(item);
              } else if (saturday === 6) {
                // All Saturdays, same as Date.getDay()
                room[i].push(item);
              }
            }
          }
        }
      }
    }
    return room;
  }

  return (
    <div className={styles.weekalendar_container}>
      <div className={styles.weekalendar}>
        <div className={`${styles.header} ${styles.room}`}>Room</div>
        {week_dates.map((item, idx) => {
          // [Day, Mmm, DD, YYYY]
          const dateArr = item.toDateString().split(" ");
          if (dateArr[0] == "Sun") {
            sunday.current = idx;
          }
          return (
            <div key={idx} className={styles.header}>
              <div>{`${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`}</div>
              <div>{dateArr[0]}</div>
            </div>
          );
        })}
      </div>
      {resolveClassesToDates(props.events).map((item, idx) => {
        return (
          <WeekalendarRow
            key={idx}
            id={idx + 1}
            columns={item}
            sunday={sunday.current}
          />
        );
      })}
      <h6 className={styles.bottom_text}>
        *Displayed are cohorts' names and adhocs' purposes
      </h6>
    </div>
  );
}

export default Weekalendar;
