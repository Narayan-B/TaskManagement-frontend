import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
export default function Dashboard() {
    const [titles,setTitles]=useState([])
    const {user}=useAuth()
    const navigate = useNavigate(); // Use the useNavigate hook to get the navigation function

    const handleClick = () => {
        navigate('/task'); // Navigate to the "/account" route when the button is clicked
    };
    useEffect(()=>{
        const fetchTaskTitles=async()=>{
            try{
                const response=await axios.get('http://localhost:5666/task',{
                    headers:{
                        authorization:localStorage.getItem('token')
                    }
                })
                setTitles(response.data)
            }catch(err){
                console.log(err)
            }
           
        }
        fetchTaskTitles()

    },[])
    const handleDelete = async (id) => {
        console.log(id)
        try {
                const response = await axios.delete(`http://localhost:5666/task/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                console.log(id)
                console.log(response.data);
                // If the deletion is successful, you can update the task list in your state
                const updatedTitles = titles.filter(ele => ele._id !== id);
                setTitles(updatedTitles);
            }catch (error) {
            console.error('Error deleting task:', error)
            }
        }

    return (
        <div>
            <h1>DashBoard</h1>
            <ul>
                {titles && titles.map((ele)=>{
                    return <li>{ele.taskTitle}
                    <button>Edit</button>
                    <button onClick={()=>{handleDelete(ele._id)}}>Delete</button>
                    </li>
        
                })}
            </ul>
            {user.role==='teamlead' && 
            <button onClick={handleClick}>Create Task</button>
            }
            
            
        </div>
    );
}
