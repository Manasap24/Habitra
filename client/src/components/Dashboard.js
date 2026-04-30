import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

function Dashboard() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isFirstRender = useRef(true);
  const [darkMode, setDarkMode] = useState(false);
  const [suggestion, setSuggestion] = useState("");



 useEffect(() => {
   if (habits.length === 0) return;

   const today = new Date().toDateString();

   if (lastUpdated === today) return;

   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);

   if (lastUpdated === null) {
     setStreak(1);
   } else if (lastUpdated === yesterday.toDateString()) {
     setStreak((prev) => prev + 1);
   } else {
     setStreak(1);
   }

   setLastUpdated(today);
 }, [habits,lastUpdated]);

 const addHabit = () => {
   if (habit.trim() === "") return;

   setHabits([...habits, { text: habit, completed: false }]);
   setHabit("");
 };

  const deleteHabit = (indexToDelete) => {
    const updatedHabits = habits.filter((_, index) => index !== indexToDelete);
    setHabits(updatedHabits);
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const total = habits.length;

  const score = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  
  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem("habits"));
    console.log("Loaded habits:", savedHabits);

    if (savedHabits !== null) {
      setHabits(savedHabits);
    }
  }, []);

 useEffect(() => {
   if (isFirstRender.current) {
     isFirstRender.current = false;
     return;
   }

   localStorage.setItem("habits", JSON.stringify(habits));
 }, [habits]);

 const toggleHabit = (index) => {
   const updatedHabits = habits.map((h, i) => {
     if (i === index) {
       return { ...h, completed: !h.completed };
     }
     return h;
   });

   setHabits(updatedHabits);
 };
  
  return (
    <>
      <div
        className="container mt-5"
        style={{
          backgroundColor: darkMode ? "#121212" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <div
          className="card p-4 shadow"
          style={{
            backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
          }}
        >
          <button
            className="btn btn-secondary mb-3"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>
          <h2 className="text-center mb-4">Habitra Dashboard</h2>

          <h4 className="text-center mb-2">Productivity Score: {score}%</h4>

          <h5 className="text-center mb-3">🔥 Streak: {streak}</h5>

          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${score}%` }}
            >
              {score}%
            </div>
          </div>

          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a habit"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
            />

            <button className="btn btn-primary" onClick={addHabit}>
              Add
            </button>
          </div>

          <ul className="list-group">
            {habits.map((h, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={h.completed}
                    onChange={() => toggleHabit(index)}
                  />
                  <span
                    style={{
                      textDecoration: h.completed ? "line-through" : "none",
                      color: h.completed ? "gray" : "black",
                    }}
                  >
                    {h.text}
                  </span>
                </div>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteHabit(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
