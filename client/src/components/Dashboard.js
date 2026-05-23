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
  const [aiSuggestion, setAiSuggestion] = useState("");
 





 


 const getAISuggestion = async () => {
   try {
     const completedHabits = habits
       .filter((h) => h.completed)
       .map((h) => h.text);

     const pendingHabits = habits
       .filter((h) => !h.completed)
       .map((h) => h.text);

     const response = await fetch("http://localhost:5000/api/ai", {
       method: "POST",

       headers: {
         "Content-Type": "application/json",
       },

       body: JSON.stringify({
         completedHabits,
         pendingHabits,
       }),
     });

     const data = await response.json();

     setAiSuggestion(data.suggestion);
   } catch (error) {
     console.error(error);

     setAiSuggestion("Error getting AI suggestion");
   }
 };

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
        className="container-fluid py-5"
        style={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(to bottom right, #1f1b2e, #2b223d)"
            : "linear-gradient(to bottom right, #f9f7ff, #e8f0ff)",

          color: darkMode ? "#f5f5f5" : "#333",
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="card border-0 shadow-lg p-4 mx-auto"
          style={{
            backgroundColor: darkMode
              ? "rgba(35, 30, 55, 0.95)"
              : "rgba(255,255,255,0.85)",

            backdropFilter: "blur(10px)",

            color: darkMode ? "#f5f5f5" : "#333",

            borderRadius: "28px",

            maxWidth: "850px",

            transition: "all 0.3s ease",
          }}
        >
          <div className="d-flex justify-content-end gap-3 mb-4">
            <button
              onClick={getAISuggestion}
              style={{
                border: "none",
                padding: "10px 18px",
                borderRadius: "14px",
                background: darkMode ? "#3b315c" : "#efe7ff",

                color: darkMode ? "#f3eaff" : "#6b5ca5",

                fontWeight: "600",

                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",

                transition: "0.3s",
              }}
            >
              🤖 AI Suggestion
            </button>
            {aiSuggestion && (
              <div className="alert alert-info text-center">{aiSuggestion}</div>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                border: "none",
                padding: "10px 18px",
                borderRadius: "14px",

                background: darkMode ? "#2d2645" : "#ffe9f3",

                color: darkMode ? "#ffd6ea" : "#c45c8b",

                fontWeight: "600",

                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",

                transition: "0.3s",
              }}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
          <h2
            className="text-center mb-3 fw-bold"
            style={{
              fontSize: "2.7rem",
              color: darkMode ? "#ffffff" : "#5b4b8a",
              letterSpacing: "1px",
            }}
          >
            Habitra
          </h2>

          <h4
            className="text-center mb-2"
            style={{
              color: darkMode ? "#d6cfff" : "#6c63ff",
              fontWeight: "600",
            }}
          >
            Productivity Score: {score}%
          </h4>

          <h5
            className="text-center mb-4"
            style={{
              color: darkMode ? "#ffcf91" : "#ff8c42",
              fontWeight: "600",
            }}
          >
            🔥 Streak: {streak}
          </h5>

          <div
            className="progress mb-4"
            style={{
              height: "16px",
              borderRadius: "20px",
              backgroundColor: darkMode ? "#3a3155" : "#ebe7ff",
            }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${score}%`,
                background: "linear-gradient(to right, #a18cd1, #fbc2eb)",
                borderRadius: "20px",
                transition: "width 0.4s ease",
              }}
            >
              {score}%
            </div>
          </div>

          <div className="d-flex gap-3 mb-4">
            <input
              style={{
                borderRadius: "16px",

                border: darkMode ? "1px solid #4d3f73" : "1px solid #ddd6ff",

                padding: "14px",

                background: darkMode ? "#241d38" : "#fcfbff",

                color: darkMode ? "#fff" : "#333",

                boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
              }}
              type="text"
              className="form-control"
              placeholder="Enter a habit"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
            />

            <button
              style={{
                background: "linear-gradient(to right, #a18cd1, #fbc2eb)",

                border: "none",

                borderRadius: "16px",

                padding: "0 24px",

                color: "#fff",

                fontWeight: "600",

                boxShadow: "0 4px 12px rgba(161,140,209,0.3)",
              }}
              onClick={addHabit}
            >
              Add
            </button>
          </div>

          <ul
            className="list-group border-0"
            style={{
              gap: "14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {habits.map((h, index) => (
              <li
                key={index}
                className="d-flex justify-content-between align-items-center"
                style={{
                  background: darkMode ? "#2d2645" : "#f8f4ff",

                  borderRadius: "18px",

                  padding: "18px 20px",

                  border: darkMode ? "1px solid #45376a" : "1px solid #ece3ff",

                  transition: "0.3s ease",

                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
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
                  style={{
                    background: "#ff8fab",

                    border: "none",

                    borderRadius: "12px",

                    padding: "8px 16px",

                    color: "white",

                    fontWeight: "600",

                    boxShadow: "0 3px 10px rgba(255,143,171,0.3)",
                  }}
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
