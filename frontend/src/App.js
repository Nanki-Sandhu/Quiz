import logo from './logo.svg';
import './App.css';
import QuizPage from './pages/quiz.jsx';
import{Route, Routes,BrowserRouter as Router} from "react-router-dom";
import React from 'react';
function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<QuizPage/>}></Route>
    </Routes>
   </Router>
  );
}

export default App;
