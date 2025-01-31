import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Fetch quiz data from the API
    axios.get('http://localhost:3001/api/quiz')
      .then((response) => {
        setQuizData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching quiz data');
        setLoading(false);
      });
  }, []);

  // Function to handle the selection of an answer
  const handleAnswerSelect = (questionId, optionId) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionId] = optionId;
    setSelectedAnswers(updatedAnswers);
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If it's the last question, calculate score
      calculateScore();
      setShowResults(true);
    }
  };

  // Function to calculate score
  const calculateScore = () => {
    let totalScore = 0;
    quizData.questions.forEach((question, index) => {
      const selectedOption = question.options.find(option => option.id === selectedAnswers[index]);
      if (selectedOption && selectedOption.is_correct) {
        totalScore += parseFloat(quizData.correct_answer_marks);
      }
      // No need to deduct points for incorrect answers anymore
    });
    setScore(totalScore);
  };

  // Start quiz when button is clicked
  const startQuiz = () => {
    setQuizStarted(true);
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quizData.questions.length).fill(null));
  };

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>{error}</div>;
  }

  // Display quiz data
  return (
    <div className="container">
      <h1>{quizData.title}</h1>
      <p>{quizData.topic}</p>

      {!quizStarted ? (
        // Show "Start Quiz" button when the quiz is not started
        <button onClick={startQuiz}>Start Quiz</button>
      ) : showResults ? (
        // Show results after the quiz ends
        <div className="results-container">
          <h2>Quiz Finished!</h2>
          <p>Your score: {score}</p>
          <button className="restart-button" onClick={startQuiz}>Restart Quiz</button>
        </div>
      ) : (
        // Show the current question once the quiz is started
        <div className="question-container">
          <h3 className="question-description">{quizData.questions[currentQuestionIndex].description}</h3>
          <ul className="options-list">
            {quizData.questions[currentQuestionIndex].options.map((option) => (
              <li key={option.id}>
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option.id}
                    checked={selectedAnswers[currentQuestionIndex] === option.id}
                    onChange={() => handleAnswerSelect(currentQuestionIndex, option.id)}
                  />
                  {option.description}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      )}
    </div>

  );
};

export default App;
