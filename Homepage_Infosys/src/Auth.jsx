import React from "react";
import {
  FaUsers,
  FaTrashAlt,
  FaClipboardList,
  FaComments,
  FaTachometerAlt,
} from "react-icons/fa";
import { MdOutlineTrackChanges, MdWorkOutline } from "react-icons/md";
import { Link } from "react-router-dom"; // 👈 for navigation

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      {/* ✅ Sticky Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-8 py-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/8044/8044429.png"
          alt="Recycle Earth"
          className="mt-8 md:mt-0 rounded-2xl shadow-lg w-30 h-10 object-cover"
        />
          {/* <h1 className="text-2xl font-bold text-green-700 ">ZeroWaste</h1> */}
        <div className="flex gap-6">
          <a href="#hero" className="hover:text-green-600">Home</a>
          <a href="#about" className="hover:text-green-600">About</a>
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#contact" className="hover:text-green-600">Contact</a>
          {/* 👇 Login/Register buttons */}
          <Link to="/login">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-100">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="flex flex-col md:flex-row items-center justify-between p-12 bg-green-100 pt-32"
      >
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Welcome to ZeroWaste ♻
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Smart Waste Pickup & Recycling Platform – making cities cleaner,
            smarter, and greener.
          </p>
          <Link to="/register">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700">
              Get Started
            </button>
          </Link>
        </div>

        <img
          src="https://www.dcw.co.uk/wp-content/uploads/2022/07/iStock-1362580060-scaled-1-1024x592.jpg"
          alt="Recycle Earth"
          className="mt-8 md:mt-0 rounded-2xl shadow-lg w-96 h-64 object-cover"
        />
      </section>

      {/* About Section */}
      <section
        id="about"
        className="p-12 bg-white flex flex-col md:flex-row items-center gap-10"
      >
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-green-700 mb-6">About Us</h2>
          <p className="text-gray-700 text-lg">
            ZeroWaste is a mission-driven platform to reduce landfill waste and
            promote recycling. We provide smart scheduling, efficient waste
            collection, and tracking systems that empower both individuals and
            organizations.
          </p>
        </div>
        <img
          src="https://tse4.mm.bing.net/th/id/OIP.81HC6Xca5YnIvz1cNxuCDQHaEU?pid=Api&P=0&h=180"
          alt="Community Recycling"
          className="md:w-1/2 rounded-2xl shadow-lg object-cover h-72"
        />
      </section>

      {/* Features Section */}
      <section id="features" className="p-12 bg-green-100">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Our Main Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <FaUsers className="text-green-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">User Management</h3>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <FaTrashAlt className="text-green-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">Waste Scheduling</h3>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <FaClipboardList className="text-red-500 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">Smart Matching</h3>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <FaComments className="text-blue-500 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">Communication Tools</h3>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <MdOutlineTrackChanges className="text-purple-500 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">Tracking & Analytics</h3>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <MdWorkOutline className="text-orange-500 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">Opportunity Management</h3>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition md:col-span-3">
            <FaTachometerAlt className="text-gray-600 text-3xl mb-3" />
            <h3 className="font-semibold text-lg">Admin Dashboard</h3>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="p-12 bg-white flex flex-col md:flex-row gap-10 items-center"
      >
        <form className="md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Contact Us</h2>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Send Message
          </button>
        </form>

        <img
          src="https://tse1.mm.bing.net/th/id/OIP.pIM7Hn1-AMdg_30PlkvFawHaEK?pid=Api&P=0&h=180"
          alt="Recycling Map"
          className="md:w-1/2 rounded-2xl shadow-lg object-cover h-80"
        />
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white p-6 mt-auto text-center">
        <p>📞 +91XXXXXXXXXX | ✉ teamc@gmail.com</p>
        <p className="text-sm mt-2">© 2025 ZeroWaste. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
