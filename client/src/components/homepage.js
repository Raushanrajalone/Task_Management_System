// src/components/Homepage.js
import React from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import CreateTask from './create';
import ViewTasks from './view';
import CompletedTasks from './completed';
import './homepage.css';  // Import the CSS file

const Homepage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <div>
      <header className="header">
        <h1>Task Management System</h1>
        <div className="header-right">
          <span className="user-name">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <nav className="navbar">
        <ul className="navList">
          <li className="navItem">
            <Link to="/create" className="navLink">Create your Task</Link>
          </li>
          <li className="navItem">
            <Link to="/view" className="navLink">View Tasks</Link>
          </li>
          <li className="navItem">
            <Link to="/completed" className="navLink">Your Completed Tasks</Link>
          </li>
        </ul>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/create" element={<CreateTask />} />
          <Route path="/view" element={<ViewTasks />} />
          <Route path="/completed" element={<CompletedTasks />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; August 2025 Created by | Raushan kumar | All right reserved</p>
      </footer>
    </div>
  );
};

export default Homepage;
