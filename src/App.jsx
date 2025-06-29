import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from '../src/pages/Login'
import Home from './pages/Home'
import VideoDetail from './pages/videoDetails'
import TweetDetail from './pages/TweetDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/videos/:id" element={<VideoDetail />} />
        <Route path="/tweets/:id" element={<TweetDetail />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
