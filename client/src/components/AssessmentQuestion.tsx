import React from 'react';
import { Question } from '../types';

interface AssessmentQuestionProps {
  question: Question;
  selectedAnswer?: number;
  onSelectAnswer?: (index: number) => void;
  showCorrect?: boolean;
}

export const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  showCorrect = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium text-gray-900">{question.question}</div>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = question.correctAnswer === index;
          
          let optionClasses = 'border-2 cursor-pointer transition-all duration-200';
          if (showCorrect) {
            if (isCorrect) {
              optionClasses += ' border-accent-500 bg-accent-50';
            } else if (isSelected && !isCorrect) {
              optionClasses += ' border-red-500 bg-red-50';
            } else {
              optionClasses += ' border-gray-100 bg-white opacity-50';
            }
            optionClasses += ' cursor-default';
          } else {
            if (isSelected) {
              optionClasses += ' border-primary-500 bg-primary-50';
            } else {
              optionClasses += ' border-gray-100 bg-white hover:border-primary-200';
            }
          }

          return (
            <div
              key={index}
              onClick={() => !showCorrect && onSelectAnswer && onSelectAnswer(index)}
              className={`p-4 rounded-xl flex items-center ${optionClasses}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                showCorrect 
                  ? (isCorrect ? 'border-accent-500 bg-accent-500' : (isSelected ? 'border-red-500 bg-red-500' : 'border-gray-200'))
                  : (isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-200')
              }`}>
                {(showCorrect && (isCorrect || isSelected)) || (!showCorrect && isSelected) ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : null}
              </div>
              <span className={`text-base ${showCorrect ? (isCorrect || isSelected ? 'text-gray-900' : 'text-gray-500') : 'text-gray-700'}`}>
                {option}
              </span>
            </div>
          );
        })}
      </div>
      {showCorrect && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
          <h4 className="font-semibold mb-1 text-sm uppercase tracking-wider">Explanation</h4>
          <p className="text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
