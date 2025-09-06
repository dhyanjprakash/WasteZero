import React from "react";

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Register</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" />
          <button className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
