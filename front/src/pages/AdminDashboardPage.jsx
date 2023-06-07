import React, { useState, useEffect, useContext } from "react";
import styles from "./pages_css/AdminDashboardPage.module.css";
import Weekalendar from "./components/Weekalendar";
import UserContext from "../context/user";
import { fetchData, getDaysNum } from "../helpers/common";

function AdminDashboardPage() {
  const userCtx = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  function handleDateChange(event) {
    setDate(event.target.value);
  }

  async function getEvents() {
    try {
      const { ok, data } = await fetchData("/display/", userCtx.accessToken);
      if (ok) {
        console.log(data);
        data.cohort.map((item) => {
          item.starts = new Date(item.starts);
          item.ends = new Date(item.ends);
        });
        setCourses(data.cohort);
      } else {
        throw new Error(data);
      }
    } catch (error) {
      console.log(error);
      alert("Error getting courses");
    }
  }

  function thisWeek(courseArr) {
    return courseArr
      .map((item) => {
        item.starts = new Date(item.starts);
        item.ends = new Date(item.ends);
        item.days = getDaysNum(item.schedule);
        return item;
      })
      .filter((item) => {
        if (!item.starts) {
          return false;
        }
        return item.starts - new Date(date) < 86400000 * 7;
      });
  }

  useEffect(() => {
    if (userCtx.accessToken != "") {
      getEvents();
    }
  }, [userCtx.accessToken]);

  return (
    <div className={styles.container}>
      <div className={styles.datepicker}>
        <label htmlFor="date_picker">What's happening this week from:</label>
        <input
          type="date"
          id="date_picker"
          value={date}
          onChange={handleDateChange}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <Weekalendar date={new Date(date)} courses={thisWeek(courses)} />
    </div>
  );
}

export default AdminDashboardPage;
