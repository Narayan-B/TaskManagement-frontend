import { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from 'yup';

export default function Task() {
    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5666/users", {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const validateSchema = Yup.object().shape({
        taskTitle: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        priority: Yup.string().required('Priority is required'),
        status: Yup.string().required('Status is required'),
        dueDate: Yup.date()
            .required('Due date is required')
            .min(new Date(), 'Due date must be before today'),
        selectedUser: Yup.string().required('User assignment is required')
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validateSchema.validate({
                taskTitle,
                description,
                priority,
                status,
                dueDate: dueDate || undefined,
                selectedUser
            }, { abortEarly: false });
            
            // If validation passes, clear any previous errors
            setErrors({});
            
            const taskData = {
                taskTitle,
                description,
                priority,
                status,
                dueDate,
                userAssignments: [selectedUser]
            };
    
            const response = await axios.post('http://localhost:5666/task', taskData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
    
            console.log(response.data);
            // Reset form input values after submission
            setTaskTitle('');
            setDescription('');
            setPriority('');
            setStatus('');
            setDueDate('');
            setSelectedUser('');
        } catch (err) {
            console.error('Error creating task:', err);
            if (err instanceof Yup.ValidationError) {
                // If there are client-side validation errors, set them to state to display to the user
                const newErrors = {};
                err.inner.forEach(error => {
                    newErrors[error.path] = error.message;
                });
                setErrors(newErrors);
            } else if (err.response && err.response.data && err.response.data.errors) {
                // If there are validation errors from the server, set them to state to display to the user
                setErrors(err.response.data.errors);
            }
        }
    };
    
    return (
        <div>
            <h2>Create Task</h2>
            <form onSubmit={handleSubmit}>
        
                    <label htmlFor="taskTitle">Task Title</label><br/>
                    <input
                        type="text"
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                    /><br/>
                    {errors.taskTitle && <span className="error">{errors.taskTitle}</span>}<br/>
                    <label htmlFor="description">Description</label><br/>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    /><br/>
                    {errors.description && <span className="error">{errors.description}</span>}<br/>
                
                    <label htmlFor="priority">Priority</label><br/>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="">Select Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select><br/>
                    {errors.priority && <span className="error">{errors.priority}</span>}<br/>
                
                    <label htmlFor="status">Status</label><br/>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        <option value="inProgress">In Progress</option>
                        <option value="open">Open</option>
                        <option value="completed">Completed</option>
                    </select><br/>
                    {errors.status && <span className="error">{errors.status}</span>}<br/>
               
                    <label htmlFor="dueDate">Due Date</label><br/>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    /><br/>
                    {errors.dueDate && <span className="error">{errors.dueDate}</span>}<br/>
                
                <label htmlFor="userAssignment">Assign To</label><br/>
                <select id="userAssignment" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                </select><br/>
                {errors.selectedUser && <span className="error">{errors.selectedUser}</span>}<br/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
