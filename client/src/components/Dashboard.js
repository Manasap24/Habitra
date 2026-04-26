import { useState } from "react";

function Dashboard() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);

  const addHabit = () => {
    if (habit.trim() === "") return;

    setHabits([...habits, habit]);
    setHabit("");
  };

  const deleteHabit = (indexToDelete) => {
    const updatedHabits = habits.filter((_, index) => index !== indexToDelete);
    setHabits(updatedHabits);
  };

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-4">Dashboard</h2>

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
            {h}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteHabit(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Dashboard;
