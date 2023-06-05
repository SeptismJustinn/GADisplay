export async function fetchData(endpoint, token, method, body) {
  const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  let returnValue = {};

  if (res.ok) {
    if (data.status === "error") {
      returnValue = { ok: false, data: data.message };
    } else {
      returnValue = { ok: true, data };
    }
  } else {
    if (data?.errors && Array.isArray(data.errors)) {
      const messages = data.errors.map((item) => item.msg);
      returnValue = { ok: false, data: messages };
    } else if (data?.status === "error") {
      returnValue = { ok: false, data: data.message };
    } else {
      console.log(data);
      returnValue = { ok: false, data: "An error has occurred" };
    }
  }
  return returnValue;
}

export function getDaysNum(combistr) {
  const strArr = combistr.match(/../g);
  return strArr.map((item) => {
    switch (item) {
      case "Mo":
        return 1;
      case "Tu":
        return 2;
      case "We":
        return 3;
      case "Th":
        return 4;
      case "Fr":
        return 5;
      case "SO":
        return 6;
      case "SE":
        return 7;
      case "SA":
        return 8;
      case "Su":
        return 0;
    }
  });
}

function getTime(dateObj) {
  if (dateObj.toString() == "Invalid Date") {
    return "";
  }
  // [hh,mm,ss]
  const timeArray = dateObj.toString().split(" ")[4].split(":");
  const hour = Number(timeArray[0]);
  // Returns AM if before 1200 and PM if 2359 and before. Shouldn't have 2400h
  return `${hour % 12 === 0 ? 12 : hour % 12}:${timeArray[1]} ${
    hour / 12 >= 1 ? "PM" : "AM"
  }`;
}
