import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function DiscussionBoard({ lessonId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${lessonId}`);
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments', err);
      }
    };
    fetchComments();
  }, [lessonId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/comments/${lessonId}`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
      showToast("Comment posted!", "success");
    } catch (err) {
      console.error('Error posting comment', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
        await api.delete(`/comments/${id}`);
        setComments(comments.filter(c => c._id !== id));
        showToast("Comment deleted", "info");
    } catch (err) {
        console.error('Error deleting comment', err);
    }
  };

  return (
    <div className="mt-12 bg-[var(--bg)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden transition-colors duration-300">
      <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--social-bg)]/30">
        <h3 className="text-xl font-black text-[var(--text-h)] uppercase tracking-tight italic">Lesson Discussion</h3>
        <span className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">{comments.length} Comments</span>
      </div>

      <div className="p-6">
        <form onSubmit={onSubmit} className="mb-10 group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            className="w-full p-5 border border-[var(--border)] rounded-2xl bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent)] outline-none resize-none transition-all group-focus-within:border-[var(--accent-border)] shadow-inner"
            rows="3"
            required
          ></textarea>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--accent)] text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-[var(--accent-bg)] transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-shrink-0 pt-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg transform rotate-3 ${
                    comment.user?.role === 'instructor' ? 'bg-[var(--accent)] scale-110 -rotate-3' : 'bg-gray-400 opacity-80'
                }`}>
                  {comment.user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-grow">
                <div className="bg-[var(--social-bg)] p-5 rounded-3xl rounded-tl-none border border-[var(--border)] relative group/comment">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-black uppercase tracking-wider ${
                        comment.user?.role === 'instructor' ? 'text-[var(--accent)]' : 'text-[var(--text-h)]'
                    }`}>
                        {comment.user?.name} {comment.user?.role === 'instructor' && <span className="text-[9px] ml-2 bg-[var(--accent-bg)] border border-[var(--accent-border)] text-[var(--accent)] px-2 py-0.5 rounded-full">Pro Instructor</span>}
                    </span>
                    <span className="text-[10px] text-[var(--text)] opacity-40 font-bold uppercase tracking-widest">
                        {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[var(--text)] text-sm leading-relaxed font-medium">{comment.text}</p>
                  
                  {comment.user?._id === user?._id && (
                    <button 
                        onClick={() => deleteComment(comment._id)}
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] hover:text-red-500 hover:border-red-200 shadow-sm flex items-center justify-center opacity-0 group-hover/comment:opacity-100 transition-all transform hover:scale-110"
                        title="Delete Comment"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-20 bg-[var(--social-bg)]/10 rounded-3xl border border-dashed border-[var(--border)]">
              <div className="w-20 h-20 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-10 h-10 text-[var(--accent)] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p className="text-[var(--text)] opacity-40 font-black uppercase tracking-widest text-xs">No discussions yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscussionBoard;
