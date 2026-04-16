"use client";
import { useEffect, useState } from "react";

export type Question = {
  _id?: string;
  questions: string[];
  explanation: string;
  pattern: string;
  type: string;
};
type Props = {
  data: Question[]; // 👈 now it's an array
};

export default function QuizQuestion({ data }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = data[currentIndex];

  // reset when changing question
  useEffect(() => {
    setSelected(null);
    setShowResult(false);
  }, [currentIndex]);

  const correctIndex = currentQuestion.questions.findIndex((q) =>
    q.toLowerCase().includes(currentQuestion.pattern.toLowerCase()),
  );

  function handleSelect(index: number) {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
  }

  function handleNext() {
    if (currentIndex < data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-xl shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">
        Choose the correct expression:
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {currentQuestion.questions.map((option, index) => {
          const isCorrect = index === correctIndex;
          const isSelected = selected === index;

          let stateStyle = "border-gray-300";

          if (showResult) {
            if (isCorrect) stateStyle = "border-green-500 bg-green-50";
            else if (isSelected) stateStyle = "border-red-500 bg-red-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`flex items-center justify-between p-3 border rounded-lg transition ${stateStyle}`}
            >
              <span>{option}</span>

              {showResult && isCorrect && (
                <span className="text-green-600 font-bold">✔</span>
              )}

              {showResult && isSelected && !isCorrect && (
                <span className="text-red-600 font-bold">✖</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
          <strong>Explanation:</strong> {currentQuestion.explanation}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === data.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Progress */}
      <p className="text-sm text-gray-500 mt-2 text-center">
        {currentIndex + 1} / {data.length}
      </p>
    </div>
  );
}