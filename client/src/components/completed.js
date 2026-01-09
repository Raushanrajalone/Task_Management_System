import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './completed.css'; // CSS for styling completed tasks

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://task-management-system-jt8w.onrender.com/api/tasks/completed', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCompletedTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch completed tasks', error);
      }
    };
  
    fetchCompletedTasks();
  }, []);
  

  return (
    <div className="completed-tasks">
      <h2> Your Completed tasks</h2>
      {completedTasks.length === 0 ? (
        <p>No any completed tasks available</p>
      ) : (
        <ul className="task-list">
          {completedTasks.map((task) => (
            <li key={task._id} className="task-item">
              <div className="task-time">
                <span>{new Date(task.time).toLocaleDateString()}</span>
                <strong>{new Date(task.time).toLocaleTimeString()}</strong>
              </div>
              <div className="task-name">
                {task.taskName}
              </div>
              <div className="task-description">{task.taskDescription}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;
