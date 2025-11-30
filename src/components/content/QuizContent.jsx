import { useState } from 'react'

export default function QuizContent({ entry, dayNumber }) {
  const title = entry?.title || `Dag ${dayNumber}`
  const questions = Array.isArray(entry?.questions)
    ? entry.questions
    : [
        {
          question: 'Hva heter nissen?',
          options: ['Nissen', 'Grinchen', 'Snøfnugg'],
          correct: 0,
        },
      ]
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  const submitQuiz = () => {
    let correct = 0
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct += 1
    })
    setQuizResult({ correct, total: questions.length })
  }

  return (
    <>
      <h2>{title}</h2>
      <div className="quiz-list">
        {questions.map((q, idx) => (
          <div key={idx} className="quiz-question">
            <p>{q.question}</p>
            <div className="quiz-options">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="quiz-option">
                  <input
                    type="radio"
                    name={`quiz-${idx}`}
                    checked={quizAnswers[idx] === optIdx}
                    onChange={() => setQuizAnswers({ ...quizAnswers, [idx]: optIdx })}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {questions.length > 0 && (
          <button type="button" className="primary-button" onClick={submitQuiz}>
            Sjekk svar
          </button>
        )}
        {quizResult && (
          <p className="quiz-result">
            Du fikk {quizResult.correct} av {quizResult.total} riktig.
          </p>
        )}
      </div>
    </>
  )
}
