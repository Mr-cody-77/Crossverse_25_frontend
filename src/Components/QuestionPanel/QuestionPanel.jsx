"use client"

import { useState } from "react"
import "./QuestionPanel.css"

function QuestionPanel({ question, onAnswerSelected }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return

    setSelectedOption(optionIndex)
    setIsAnswered(true)

    const isCorrect = optionIndex === question.correctAnswer

    // Delay moving to next question to show feedback
    setTimeout(() => {
      onAnswerSelected(optionIndex, isCorrect)
      setSelectedOption(null)
      setIsAnswered(false)
    }, 1000)
  }

  const getOptionClassName = (index) => {
    if (!isAnswered || selectedOption !== index) {
      return "option"
    }

    return index === question.correctAnswer ? "option select" : "option select"
  }

  return (
    <div className="question-panel">
      <h2 className="question-text  ">Q: {question.text}</h2>

      <div className="options-container">
        {question.options.map((option, index) => (
          <div key={index} className={getOptionClassName(index)} onClick={() => handleOptionClick(index)}>
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionPanel

