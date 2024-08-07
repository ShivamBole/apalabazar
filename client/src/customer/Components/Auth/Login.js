import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Register from '../assets/register.png';
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png"
import axiosInstance from "../../../axiosConfig";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode correctly
import { signInWithGooglePopup } from "../../../firebaseConfig.js";


const SignIn = () => {
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
    window.location.href = '/';
    }
    return (
      <div>
          <button onClick={logGoogleUser}>Login In With Google</button>
      </div>
    )
}

const sharedClasses = {
  textZinc: "text-zinc-500",
  hoverTextZinc: "hover:text-zinc-700",
  darkTextZinc: "dark:text-zinc-500",
  darkHoverTextZinc: "dark:hover:text-zinc-100",
  bgZinc: "bg-zinc-300",
  borderZinc: "border-zinc-300",
  darkBgInput: "dark:bg-input",
  darkBorderZinc: "dark:border-zinc-600",
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/login`, { email, password }, { withCredentials: true });
      if (response.data.status) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('role', response.data.data.role);
        toast.success("Login successful");

        if (response.data.data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
      <div className="bg-white dark:bg-card dark:text-white w-full max-w-4xl mx-auto rounded-lg shadow-lg flex flex-col md:flex-row">
        <div className="bg-blue-100 p-8 flex-1 hidden lg:flex items-center flex-col justify-between">
          <div className="text-primary-foreground p-6 rounded-lg max-w-sm">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome Back!</h2>
            <p className="text-muted-foreground text-gray-600">
              Log in to continue shopping with us!
            </p>
          </div>
          <img
            src={Register}
            alt="Illustration of a person logging in"
            className="max-w-full bg-cover h-[300px] w-[400px]"
          />
        </div>
        <div className="p-8 flex-1">
          <div className="flex justify-between items-center mb-5">
            <Link to="/" className="text-blue-500 text-xs hover:text-blue-600">
              Back to Home
            </Link>
          </div>
          <img src={logo} alt="Logo" className="max-w-20 mb-12" />
          <h2 className="text-xl text-black font-bold mb-4">Login</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className={`block ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full p-2 ${sharedClasses.borderZinc} rounded border-gray-600 border-[1px] text-black ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className={`block ${sharedClasses.textZinc} ${sharedClasses.darkTextZinc} mb-2`}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full p-2 ${sharedClasses.borderZinc} text-black rounded border-gray-600 border-[1px] ${sharedClasses.darkBgInput} ${sharedClasses.darkBorderZinc}`}
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 ${sharedClasses.bgZinc} ${sharedClasses.textZinc} rounded ${loading ? "cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
            
              <div class="flex mt-4 items-center w-full justify-center">
                  <div class="px-4 py-2 w-full border flex justify-center gap-2 border-slate-200  rounded-lg text-slate-700  hover:border-slate-400  hover:bg-gray-100 hover:text-slate-900 hover:shadow transition duration-150">
                      <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                      <SignIn />
                  </div>
              </div>
            

          </form>
         
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Login;
