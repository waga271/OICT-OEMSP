import { useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function AddQuiz({ courseId, lessonId, onQuizAdded, onCancel }) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/quizzes/${courseId}`, { title, questions });
      onQuizAdded(res.data);
      showToast("Quiz published successfully!", "success");
      onCancel();
    } catch (err) {
      // API interceptor handles the error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 mb-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-purple-900 italic">Create New Assessment</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">✕</button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl border-none ring-1 ring-purple-100 focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-gray-300"
            placeholder="e.g., Module 1 Final Exam"
            required
          />
        </div>

        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="p-6 bg-purple-50/30 rounded-2xl border border-purple-50 relative group">
              <button 
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
              
              <div className="mb-4">
                <label className="block text-xs font-black text-purple-400 mb-2 uppercase italic">Question {qIndex + 1}</label>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  className="w-full p-3 rounded-lg border-none ring-1 ring-purple-100 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Ask something..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="flex-1 p-2 rounded-lg border-none ring-1 ring-purple-50 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 space-y-4 sm:space-y-0">
          <button
            type="button"
            onClick={addQuestion}
            className="text-purple-600 font-bold hover:underline flex items-center"
          >
            <span className="text-xl mr-1">+</span> Add Question
          </button>
          
          <div className="flex space-x-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 flex-grow sm:flex-grow-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-10 py-3 rounded-xl font-black shadow-lg shadow-purple-100 hover:bg-purple-700 transition disabled:opacity-50 flex-grow sm:flex-grow-0"
            >
              {loading ? 'Publishing...' : 'Save & Publish Quiz'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddQuiz;
