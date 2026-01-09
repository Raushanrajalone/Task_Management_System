import React, { useState } from 'react';
import axios from 'axios';
import './create.css'; // Import the CSS file

const CreateTask = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newTask = {
      taskName,
      taskDescription,
      time,
      isDone: false, // Default when creating a new task
    };

    try {
      const token = localStorage.getItem('token');
      // Send POST request to the backend with auth token
      await axios.post('https://task-management-system-jt8w.onrender.com/api/tasks', newTask, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Task created successfully!');
      // Clear form
      setTaskName('');
      setTaskDescription('');
      setTime('');
    } catch (error) {
      console.error('There was an error creating the task!', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Create a new task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Task Description:</label>
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Time (MM-DD-YYYY HH:MM):</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create task</button>
      </form>
    </div>
  );
};

export default CreateTask;

