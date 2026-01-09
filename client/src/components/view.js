import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md'; // Import delete icon
import { IoCheckmarkDoneCircle } from "react-icons/io5"; // Import mark as done icon
import './view.css'; // Import the CSS for styling

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://task-management-system-jt8w.onrender.com/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const sortedTasks = response.data.sort((a, b) => new Date(a.time) - new Date(b.time));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Toggle the task description display
  const toggleTaskDescription = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null); // Collapse if already expanded
    } else {
      setExpandedTaskId(taskId); // Expand the clicked task
    }
  };

  // Delete a task
  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://task-management-system-jt8w.onrender.com/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTasks(); // Re-fetch tasks to update the view
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  // Mark task as done
  const handleMarkAsDone = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://task-management-system-jt8w.onrender.com/api/tasks/${taskId}/done`, { isDone: true }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchTasks(); // Re-fetch tasks to update the view
      alert("Task marked as done");
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'Task is already marked as done') {
        alert("Task is already marked as done");
      } else {
        alert("Failed to mark task as done");
        console.error('Failed to mark task as done', error);
      }
    }
  };

  return (
    <div className="view-tasks">
      <h2>View Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className={`task-item ${task.isDone ? 'done' : ''}`}>
              <div className="task-time">
                <span>{new Date(task.time).toLocaleDateString()}</span>
                <strong>{new Date(task.time).toLocaleTimeString()}</strong>
              </div>
              <div className="task-name" onClick={() => toggleTaskDescription(task._id)}>
                {task.taskName}
              </div>
              <div className="task-actions">
                <IoCheckmarkDoneCircle onClick={() => handleMarkAsDone(task._id)} className='done-btn'/>
                <MdDelete onClick={() => handleDelete(task._id)} className='delete-btn'/>
              </div>
              {expandedTaskId === task._id && (
                <div className="task-description">{task.taskDescription}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewTasks;
