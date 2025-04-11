import React, { useState } from 'react';
import axios from 'axios';

const ParentSignup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup/parent', formData);
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br ">
      <div className="bg-white  /10 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md border border-black/20 ">
        <h2 className="text-2xl font-bold text-black text-center mb-6">Parent Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-black placeholder-black/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>
        {message && <p className="text-center text-white mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default ParentSignup;
