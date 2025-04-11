import React, { useState } from "react";

interface LoginFormProps {
  role: "parent" | "child";
  onSubmit: (identifier: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onSubmit }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(identifier, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center capitalize">{role} Login</h2>

      <input
        type="text"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder={role === "parent" ? "Email or Username" : "Child ID"}
        required
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-4 py-2 mb-4 border rounded-lg"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
