import { useState } from 'react';

function QuizView({ quiz, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    const finalScore = (selectedOption === quiz.questions[currentQuestion].correctAnswer ? score + 1 : score);
    const percentage = Math.round((finalScore / quiz.questions.length) * 100);
    
    return (
      <div className="bg-[var(--bg)] p-12 rounded-3xl shadow-sm border border-[var(--border)] text-center animate-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg transform rotate-6">
            <span className="text-4xl">🎯</span>
        </div>
        <h3 className="text-3xl font-black text-[var(--text-h)] mb-4 uppercase tracking-tight italic">Quiz Finished!</h3>
        <div className="text-6xl font-black text-[var(--accent)] mb-6 drop-shadow-sm">{percentage}%</div>
        <p className="text-[var(--text)] font-medium mb-10 opacity-60">
          You conquered {finalScore} out of {quiz.questions.length} challenges.
        </p>
        <button
          onClick={() => onComplete(percentage)}
          className="bg-[var(--accent)] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-[var(--accent-bg)] transition-all active:scale-95 shadow-md"
        >
          Finish & Save
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="bg-[var(--bg)] p-10 rounded-3xl shadow-sm border border-[var(--border)] transition-colors duration-300">
      <div className="flex justify-between items-center mb-10">
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-1">Active Quiz</span>
            <h3 className="text-xl font-black text-[var(--text-h)] uppercase tracking-tight italic">{quiz.title}</h3>
        </div>
        <span className="text-[10px] font-black text-[var(--text)] opacity-40 px-4 py-2 bg-[var(--social-bg)]/30 rounded-full uppercase tracking-widest border border-[var(--border)]">
          Gap {currentQuestion + 1} / {quiz.questions.length}
        </span>
      </div>

      <div className="mb-10">
        <h4 className="text-2xl font-black text-[var(--text-h)] mb-8 leading-tight italic">"{question.questionText}"</h4>
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all group relative overflow-hidden ${
                selectedOption === index
                  ? 'border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]'
                  : 'border-[var(--border)] hover:border-[var(--accent-border)] text-[var(--text)] italic font-medium'
              }`}
            >
              <div className="flex items-center relative z-10">
                <div className={`w-6 h-6 rounded-lg border-2 mr-4 flex items-center justify-center transition-all ${
                  selectedOption === index ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--border)]'
                }`}>
                  {selectedOption === index && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-lg">{option}</span>
              </div>
              {selectedOption === index && <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/5 to-transparent pointer-events-none"></div>}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        className="w-full bg-[var(--text-h)] text-[var(--bg)] py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-102 transition-all active:scale-95 disabled:opacity-20 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {currentQuestion + 1 === quiz.questions.length ? 'Submit Quiz' : 'Finalize Answer'}
      </button>
    </div>
  );
}

export default QuizView;
