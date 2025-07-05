'use client';

import { useState, useEffect } from 'react';
import { testQuestions } from '@/lib/testQuestions';
import { shareCastIntent } from '@/lib/frame';
import styles from './Quiz.module.css';

export function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const shuffled = [...testQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      } else {
        handleSubmit();
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const quizData = {
      questions: questions.map((q, i) => ({
        question: q.question,
        acceptable_answers: q.answer,
        user_answer: answers[i] || ''
      }))
    };

    const response = await fetch('/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    });
    const result = await response.json();
    setScore(result);

    setIsLoading(false);
  };

  const handleShare = async () => {
    const passed = score.score >= 6;
    const castText = passed
      ? `I passed the US Citizenship Test with a score of ${score.score}/10! HU-RAH! 🦅🦅🦅`
      : `I failed the US Citizenship Test with a score of ${score.score}/10. I need to study America more...`;

    const response = await fetch('/api/create-share-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: score.score, results: score.results }),
    });
    const { shareablePageUrl } = await response.json();
    shareCastIntent(castText, shareablePageUrl);
  };

  const handleRetry = () => {
    // Reset all quiz state
    const shuffled = [...testQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(null);
    setIsLoading(false);
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  if (score) {
    const passed = score.score >= 6;
    const resultsMessage = passed
      ? "Congratulations! See you at the oath ceremony! 🦅"
      : "You failed. Are you even trying to be an American? Hit the books and try again.";

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{score.score} / {questions.length}</h1>
          <h2 className={`${styles.resultsMessage} ${passed ? styles.pass : styles.fail}`}>{resultsMessage}</h2>
          <button className={styles.shareButton} onClick={handleShare}>Share Results</button>
          <div className={styles.results}>
            {score.results.map((result, index) => (
              <div key={index} className={`${styles.result} ${result.correct ? styles.correct : styles.incorrect}`}>
                <p><strong>Question:</strong> {result.question}</p>
                <p><strong>Your Answer:</strong> {result.user_answer}</p>
                <p><strong>Correct Answer:</strong> {result.acceptable_answers.join(' or ')}</p>
              </div>
            ))}
          </div>
          <button className={styles.shareButton} onClick={handleRetry} style={{ marginTop: '40px' }}>Try Again</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Citizenship Test</h1>
        <div className={styles.questionContainer}>
          <p className={styles.questionNumber}>Question {currentQuestionIndex + 1} of {questions.length}</p>
          <p className={styles.question}>{currentQuestion.question}</p>
          <textarea
            className={styles.answerTextarea}
            value={answers[currentQuestionIndex] || ''}
            onChange={handleAnswerChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
          />
        </div>
        <div className={styles.navigation}>
          <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
          {currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNextQuestion}>Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Scoring...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}