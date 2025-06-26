import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, loginSuccess, registerSuccess } from "../features/authSlice";
import { login as loginApi, register as registerApi } from "../api";

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
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const user = useSelector(state => state.auth.user);

  // Show alert when logged in
  useEffect(() => {
    if (user && !loading && !error) {
      alert("Logged in!");
    }
  }, [user, loading, error]);

  // show alert on register success
  useEffect(() => { 
    if (user && !loading && !error && !isLogin) {
      alert("Registration successful! Please log in."); 
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
        // Validate details before moving to next step
        if (
          !fullName.trim() ||
          !userName.trim() ||
          !email.trim() ||
          !password.trim()
        ) {
          dispatch(setError("Please fill all details."));
          dispatch(setLoading(false));
          return;
        }
        setRegisterStep(2);
        dispatch(setLoading(false));
        return;
      }
      // Step 2: Upload avatar and cover image
      if (!avatar) {
        dispatch(setError("Avatar is required"));
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

      const user = await registerApi(formData);
      dispatch(registerSuccess(user));
      setIsLogin(true);
      setRegisterStep(1);
      // Optionally reset fields here
    } catch (err) {
      dispatch(setError(err?.message || "Something went wrong"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e) => {
    if (isLogin) {
      e.preventDefault();
      dispatch(setError(""));
      dispatch(setLoading(true));
      try {
        const payload = { password };
        if (email.trim()) payload.email = email.trim();
        if (userName.trim()) payload.userName = userName.trim();
        const user = await loginApi(payload);
        dispatch(loginSuccess(user));
        // Optionally redirect or reset form
      } catch (err) {
        dispatch(setError(err?.message || "Something went wrong"));
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      handleRegister(e);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div
      className={`${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      } min-h-screen relative flex items-center justify-center px-2 sm:px-4 transition-colors duration-500`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full shadow-lg transition"
        title="Toggle theme"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Diagonal Checkered Background */}
      <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 grid-rows-6 sm:grid-rows-12 gap-0 z-0 opacity-20 pointer-events-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 sm:w-16 sm:h-16 ${
              (Math.floor(i / 6) + (i % 6)) % 2 === 0
                ? darkMode
                  ? "bg-zinc-900"
                  : "bg-zinc-200"
                : "bg-transparent"
            } border ${darkMode ? "border-zinc-800" : "border-zinc-300"}`}
            style={{
              transform: `rotate(-45deg)`,
              position: "absolute",
              top: `${Math.floor(i / 6) * 16}%`,
              left: `${(i % 6) * 16}%`,
            }}
          />
        ))}
        {Array.from({ length: 108 }).map((_, i) => (
          <div
            key={i + 36}
            className="hidden sm:block w-16 h-16"
            style={{
              position: "absolute",
              top: `${Math.floor(i / 12) * 8}%`,
              left: `${(i % 12) * 8}%`,
              background:
                (Math.floor(i / 12) + (i % 12)) % 2 === 0
                  ? darkMode
                    ? "#18181b"
                    : "#e4e4e7"
                  : "transparent",
              border: `1px solid ${darkMode ? "#27272a" : "#d4d4d8"}`,
              transform: "rotate(-45deg)",
            }}
          />
        ))}
      </div>

      {/* Login/Register Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl border backdrop-blur-md ${
          darkMode ? "bg-white/10 border-zinc-700" : "bg-black/5 border-zinc-200"
        }`}
      >
        <h1
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 ${
            darkMode ? "text-red-500" : "text-red-600"
          }`}
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p
          className={`text-xs sm:text-sm text-center mb-4 ${
            darkMode ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {isLogin
            ? "Please sign in to your account"
            : "Register a new account"}
        </p>

        {error && (
          <div className="mb-3 text-center text-red-500 text-xs sm:text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {isLogin ? (
            <>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Username or Email
                </label>
                <input
                  type="text"
                  value={userName || email}
                  onChange={(e) => {
                    // Simple logic: if contains @, treat as email, else username
                    if (e.target.value.includes("@")) {
                      setEmail(e.target.value);
                      setUserName("");
                    } else {
                      setUserName(e.target.value);
                      setEmail("");
                    }
                  }}
                  placeholder="Enter your username or email"
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-2 text-xs sm:text-sm ${
                    darkMode
                      ? "bg-zinc-900 text-white border-zinc-700 focus:ring-red-500"
                      : "bg-zinc-100 text-black border-zinc-300 focus:ring-red-600"
                  }`}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 text-xs sm:text-sm ${
                      darkMode
                        ? "bg-zinc-900 text-white border-zinc-700 focus:ring-red-500"
                        : "bg-zinc-100 text-black border-zinc-300 focus:ring-red-600"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-zinc-400"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 font-semibold rounded-md transition duration-200 ${
                  darkMode
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </>
          ) : (
            <>
              {registerStep === 1 ? (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 text-xs sm:text-sm ${
                        darkMode
                          ? "bg-zinc-900 text-white border-zinc-700 focus:ring-red-500"
                          : "bg-zinc-100 text-black border-zinc-300 focus:ring-red-600"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Username"
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 text-xs sm:text-sm ${
                        darkMode
                          ? "bg-zinc-900 text-white border-zinc-700 focus:ring-red-500"
                          : "bg-zinc-100 text-black border-zinc-300 focus:ring-red-600"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-3 py-2 rounded-lg border focus:ring-2 text-xs sm:text-sm ${
                        darkMode
                          ? "bg-zinc-900 text-white border-zinc-700 focus:ring-red-500"
                          : "bg-zinc-100 text-black border-zinc-300 focus:ring-red-600"
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 text-xs sm:text-sm ${
                          darkMode
                            ? "bg-zinc-900 text-white border-zinc-700 focus:ring-red-500"
                            : "bg-zinc-100 text-black border-zinc-300 focus:ring-red-600"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2 text-zinc-400"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2 font-semibold rounded-md transition duration-200 mt-2 ${
                      darkMode
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <label className="block text-xs font-medium mb-1">
                      Avatar <span className="text-red-400">*</span>
                    </label>
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-600 mb-2">
                      {avatar ? (
                        <img
                          src={URL.createObjectURL(avatar)}
                          alt="Avatar Preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-zinc-400 text-xs">No Image</span>
                      )}
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) setAvatar(e.target.files[0]);
                      }}
                      className="hidden"
                      required
                    />
                    <div className="flex gap-2">
                      <label
                        htmlFor="avatar-upload"
                        className="px-3 py-1 bg-zinc-700 text-white rounded cursor-pointer text-xs hover:bg-zinc-600 transition"
                      >
                        {avatar ? "Change" : "Upload"}
                      </label>
                      {avatar && (
                        <button
                          type="button"
                          onClick={() => setAvatar(null)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-4">
                    <label className="block text-xs font-medium mb-1">Cover Image</label>
                    <div className="w-32 h-16 rounded-md bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-600 mb-2">
                      {coverImage ? (
                        <img
                          src={URL.createObjectURL(coverImage)}
                          alt="Cover Preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-zinc-400 text-xs">No Image</span>
                      )}
                    </div>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) setCoverImage(e.target.files[0]);
                      }}
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <label
                        htmlFor="cover-upload"
                        className="px-3 py-1 bg-zinc-700 text-white rounded cursor-pointer text-xs hover:bg-zinc-600 transition"
                      >
                        {coverImage ? "Change" : "Upload"}
                      </label>
                      {coverImage && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(null)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="w-1/2 py-2 font-semibold rounded-md transition duration-200 bg-zinc-500 hover:bg-zinc-600 text-white"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-1/2 py-2 font-semibold rounded-md transition duration-200 ${
                        darkMode
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </form>

        <p
          className={`text-xs sm:text-sm text-center mt-4 ${
            darkMode ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              dispatch(setError(""));
              setRegisterStep(1);
            }}
            className={`hover:underline ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
