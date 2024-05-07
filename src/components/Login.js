
import React, { useState } from "react";
import axios from 'axios'
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate=useNavigate()
    const {handleLogin}=useAuth()

    const [form, setForm] = useState({
        email:'',
        password:'',
        serverErrors:'',
        clientErrors:""
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setForm({
            ...form,
            [name]: value,
            serverErrors: null,
            clientErrors: null // Reset both clientErrors and serverErrors
        });
    };
    

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('email should be in email format')
            .required('Email name is required'),
        password: Yup.string().required('password is required')
    });
    
    const displayError = (fieldName) => {
        if (form.clientErrors && form.clientErrors[fieldName]) {
            return <span>{form.clientErrors[fieldName]}</span>;
        }
    
        if (Array.isArray(form.serverErrors)) {
            const errors = form.serverErrors.filter(error => error.path === fieldName);
            if (errors.length === 0) return null;
    
            return (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error.msg}</li>
                    ))}
                </ul>
            );
        } else if (form.serverErrors) {
            return <span>{form.serverErrors}</span>;
        }
    
        return null;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email: form.email,
            password: form.password
        };
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            const response = await axios.post('http://localhost:5666/login', formData);
            console.log(response.data);
            toast.success('Login successful!');
            
            const token = response.data.token; // Extract token from response
            localStorage.setItem('token', token); // Store token in local storage
            
            // Retrieve user info
            const userResponse = await axios.get('http://localhost:5666/account', {
                headers: {
                    Authorization: token // Set token in authorization header
                }
            });
            //console.log('User info:', userResponse.data);
            
            // Update user state and navigate to home page
            handleLogin(userResponse.data);
            navigate('/');
            
            setForm({
                email: '',
                password: '',
                serverErrors: null,
                clientErrors: null
            });
        } catch (err) {
            console.log(err);
            // Handle client-side validation errors
            if (err.inner) {
                const newError = {};
                err.inner.forEach(ele => {
                    newError[ele.path] = ele.message;
                });
                setForm({ ...form, clientErrors: newError });
            } else {
                // Handle server-side errors
                console.error('Server error:', err);
                setForm({ ...form, serverErrors: 'An unexpected error occurred' });
            }
        }
    };
    
    return (
        <div>
            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label><br/>
                <input
                    type="email"
                    id="email"
                    value={form.email}
                    name='email'
                    onChange={handleChange}
                    
                /><br/>
                {displayError('email')}<br/>
                
                
                <label htmlFor="password">Password</label><br/>
                <input
                    type="password"
                    id="password"
                    value={form.password}
                    name='password'
                    onChange={handleChange}
                    
                /><br/>
                {displayError('password')}<br/>
                
                <input type='submit'/>
            </form>
        </div>
    );
}
