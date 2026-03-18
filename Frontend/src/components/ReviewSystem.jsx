import { useState, useEffect } from 'react';
import api from '../utils/api';

function ReviewSystem({ courseId, user, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${courseId}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Error fetching reviews', err);
      }
    };
    fetchReviews();
  }, [courseId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post(`/reviews/${courseId}`, { rating, text });
      
      // Update local state
      const existingIdx = reviews.findIndex(r => r.user?._id === user?._id || r.user === user?._id);
      if (existingIdx > -1) {
          const updated = [...reviews];
          updated[existingIdx] = { ...res.data, user: { name: user.name } };
          setReviews(updated);
      } else {
          setReviews([{ ...res.data, user: { name: user.name } }, ...reviews]);
      }
      
      setText('');
      setShowForm(false);
      if (onReviewAdded) onReviewAdded();
      showToast('Review submitted! Thank you for your feedback.', 'success');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 bg-[var(--bg)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden transition-colors duration-300">
      <div className="p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--social-bg)]/30">
        <div>
            <h3 className="text-2xl font-black text-[var(--text-h)] uppercase tracking-tight italic">Student Reviews</h3>
            <p className="text-[var(--text)] opacity-40 text-xs font-bold uppercase tracking-widest mt-1">Hear from others who took this course.</p>
        </div>
        <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-[var(--accent)] text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-[var(--accent-bg)] transition-all active:scale-95"
        >
            {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      <div className="p-8">
        {showForm && (
            <form onSubmit={onSubmit} className="mb-12 bg-[var(--accent-bg)] p-8 rounded-3xl border border-[var(--accent-border)] animate-in slide-in-from-top-6 duration-700 shadow-inner">
                <div className="mb-6">
                    <label className="block text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-3">How would you rate this course?</label>
                    <div className="flex space-x-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-4xl transition-all transform hover:scale-125 active:scale-90 ${
                                    star <= rating ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-gray-300 opacity-30'
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-3">Share your experience</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What did you learn? How was the instructor?"
                        className="w-full p-5 rounded-2xl bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none shadow-inner font-medium"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[var(--accent)] text-white px-10 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-[var(--accent-bg)] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Publish Review'}
                    </button>
                </div>
            </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
                <div key={review._id} className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--social-bg)]/20 hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)]/5 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center font-black text-white shadow-md transform -rotate-6">
                                {review.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-black text-[var(--text-h)] uppercase tracking-tight text-sm">{review.user?.name}</p>
                                <div className="flex text-yellow-400 text-[10px]">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="mr-0.5">{i < review.rating ? '★' : '☆'}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-[9px] text-[var(--text)] opacity-40 font-black uppercase tracking-widest">
                            {new Date(review.date).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-[var(--text)] text-sm font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{review.text}"</p>
                </div>
            ))}
        </div>

        {reviews.length === 0 && !showForm && (
            <div className="text-center py-20 bg-[var(--social-bg)]/10 rounded-3xl border border-dashed border-[var(--border)]">
                <div className="w-16 h-16 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <span className="text-2xl">✨</span>
                </div>
                <p className="text-[var(--text)] opacity-40 font-black uppercase tracking-widest text-[10px]">No reviews yet. Be the first to rate this course!</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default ReviewSystem;
