import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setError,
  loginSuccess,
  registerSuccess,
} from "../utils/authSlice";
import { login as loginApi, register as registerApi } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  
  useEffect(() => {
    if (user && !loading && !error && isLogin) {
      navigate("/");
    }
  }, [user, loading, error, isLogin, navigate]);

  useEffect(() => {
    if (user && !loading && !error && !isLogin) {
      setIsLogin(true);
      setRegisterStep(1);
      setEmail("");
      setUserName("");
      setFullName("");
      setPassword("");
      setAvatar(null);
      setCoverImage(null);
    }
  }, [user, loading, error, isLogin]);

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(setError(""));
    dispatch(setLoading(true));

    try {
      if (registerStep === 1) {
        if (!fullName || !userName || !email || !password) {
          dispatch(setError("Please fill all details."));
          dispatch(setLoading(false));
          return;
        }
        setRegisterStep(2);
        dispatch(setLoading(false));
        return;
      }

      if (!avatar) {
        dispatch(setError("Avatar is required."));
        dispatch(setLoading(false));
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("userName", userName);
      formData.append("fullName", fullName);
      formData.append("password", password);
      formData.append("avatar", avatar);
      if (coverImage) formData.append("coverImage", coverImage);

      const newUser = await registerApi(formData);
      dispatch(registerSuccess(newUser));
    } catch (err) {
      dispatch(setError(err?.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(setError(""));
    dispatch(setLoading(true));
    try {
      const payload = { password };
      if (email.trim()) payload.email = email.trim();
      if (userName.trim()) payload.userName = userName.trim();

      const loggedInUser = await loginApi(payload);
      dispatch(loginSuccess(loggedInUser));
    } catch (err) {
      dispatch(setError(err?.message || "Login failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = (e) => {
    if (isLogin) handleLogin(e);
    else handleRegister(e);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 p-2 bg-zinc-700 text-white rounded-full shadow"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md px-6 py-8 rounded-2xl shadow-lg border ${
          darkMode
            ? "bg-white/10 border-zinc-700"
            : "bg-black/5 border-zinc-300"
        } backdrop-blur-md`}
      >
        <h2 className="text-center text-2xl font-bold mb-2 text-red-500">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && (
          <p className="text-center text-sm text-red-400 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            <>
              {/* Email or Username */}
              <div>
                <label className="text-xs mb-1 block">Email or Username</label>
                <input
                  type="text"
                  value={email || userName}
                  onChange={(e) => {
                    if (e.target.value.includes("@")) {
                      setEmail(e.target.value);
                      setUserName("");
                    } else {
                      setUserName(e.target.value);
                      setEmail("");
                    }
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm bg-zinc-800 text-white"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-sm bg-zinc-800 text-white"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2.5 right-3 cursor-pointer text-zinc-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </>
          ) : registerStep === 1 ? (
            <>
              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm bg-zinc-800 text-white"
                required
              />
              {/* Username */}
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm bg-zinc-800 text-white"
                required
              />
              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm bg-zinc-800 text-white"
                required
              />
              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm bg-zinc-800 text-white"
                required
              />

              <button
                type="submit"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
              >
                Next
              </button>
            </>
          ) : (
            <>
              {/* Avatar Upload */}
              <div>
                <label className="text-xs">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="w-full text-xs text-white"
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-xs">Cover Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full text-xs text-white"
                />
              </div>

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterStep(1)}
                  className="w-1/2 py-2 bg-zinc-600 text-white rounded-md"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Toggle link */}
        <p className="text-xs text-center mt-4 text-zinc-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setRegisterStep(1);
              dispatch(setError(""));
            }}
            className="text-red-400 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
