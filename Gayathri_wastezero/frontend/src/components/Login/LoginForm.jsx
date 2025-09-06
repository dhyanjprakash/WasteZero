import { useState } from "react"
import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu"
import { toast } from "react-toastify"
import { useAuthContext } from "@/context/AuthContext"
import { Urls } from "@/utils/Urls"
import { useNavigate } from "react-router-dom"

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthUser } = useAuthContext()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(Urls.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthUser(data.user || data);
        localStorage.setItem("user", JSON.stringify(data.user || data));
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-primary">
          Email
        </label>
        <div className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 focus-within:border-emerald-600">
          <LuMail className="size-4 text-neutral-500" aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-primary">
          Password
        </label>
        <div className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 focus-within:border-emerald-600">
          <LuLock className="size-4 text-neutral-500" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="p-1 text-neutral-500 hover:text-neutral-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex select-none items-center gap-2 text-sm text-primary">
          <input 
            type="checkbox" 
            name="rememberMe" 
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="size-4 rounded border-neutral-300 text-primary focus:ring-emerald-500" 
          />
          Remember me
        </label>
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7fb53f] focus:outline-none focus:ring-2 focus:ring-[#8DC548]/60 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Login"}
      </button>
    </form>
  )
}
export default LoginForm