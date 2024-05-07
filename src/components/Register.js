import React, { useState } from "react";
import axios from 'axios'
import * as Yup from 'yup'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const navigate=useNavigate()

    const [form, setForm] = useState({
        username:'',
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
        username: Yup.string().required('User Name is required'),
        email: Yup.string()
            .email('email should be in email format')
            .required('Email name is required'),
        password: Yup.string().required('password is required'),
        role:Yup.string().required('Role is required')
    });
    const displayError = (fieldName) => {
        if (form.clientErrors && form.clientErrors[fieldName]) {
            return <span>{form.clientErrors[fieldName]}</span>;
        }
    
        if (form.serverErrors) {
            const errors = form.serverErrors.filter(error => error.path === fieldName);
            if (errors.length === 0) return null;
    
            return (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error.msg}</li>
                    ))}
                </ul>
            );
        }
    
        return null;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            username: form.username,
            email: form.email,
            password: form.password,
            role:form.role
        };
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            const response = await axios.post('http://localhost:5666/register', formData);
            console.log(response.data);
            toast.success('Registration successful!');
            navigate('/login')

            setForm({
                username: '',
                email: '',
                password: '',
                role:"",
                serverErrors: null,
                clientErrors: null
            });
        } catch (err) {
            console.log(err)
            // Handle client-side validation errors
            if (err.inner) {
                const newError = {};
                err.inner.forEach(ele => {
                    newError[ele.path] = ele.message;
                });
                setForm({ ...form, clientErrors: newError });
            } else {
                // Handle server-side errors
                console.error(err);
                setForm({ ...form, serverErrors: err.response.data.errors });
            }
        }
    };
    
    return (
        <div>
            <h2>Register Form</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">User Name</label><br/>
                <input
                    type="text"
                    id="username"
                    value={form.username}
                    name='username'
                    onChange={handleChange}
                    
                /><br/>
                {displayError('username')}<br/>
                
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
                <input
            type='radio'
            id='employee'
            value='employee'
            checked={form.role==='employee'}
            onChange={()=>{setForm({...form,role:'employee'})}}
            name='employee'
            />
            <label htmlFor='employee'>Employee</label>
            <input
            type='radio'
            id='teamlead'
            value='teamlead'
            checked={form.role==='teamlead'}
            onChange={()=>{setForm({...form,role:'teamlead'})}}
            name='teamlead'
            />
            <label htmlFor='teamlead'>Teamlead</label><br/>

            {displayError('role')}<br/>
             <input type='submit'/>
               

            </form>
        </div>
    );
}
