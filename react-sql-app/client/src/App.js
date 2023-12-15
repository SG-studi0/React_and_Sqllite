import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleAddUser = () => {
    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers([...users, data]);
        setName("");
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  const handleUpdateUser = (id) => {
    const updatedName = prompt("Enter the new name:");
    if (updatedName !== null) {
      fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === data.id ? data : user))
          );
        })
        .catch((error) => console.error("Error updating user:", error));
    }
  };

  return (
    <main>
      <section>
        <div>
          <h1 className="neon-text">React and SQLite</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name}{" "}
                <button onClick={() => handleUpdateUser(user.id)}>
                  Update
                </button>
              </li>
            ))}
          </ul>
          <div>
            <input
              className="input"
              type="text"
              placeholder ="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleAddUser} className="button">
              Add User
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
