import { useNavigate } from "react-router-dom";

function CourseCard({ course, onEnroll, isEnrolled, userRole, progress }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--bg)] p-6 rounded-2xl shadow-sm border border-[var(--border)] flex flex-col justify-between hover:shadow-xl hover:shadow-[var(--accent-bg)] transition-all duration-500 overflow-hidden relative group">
      {/* Achievement Badge */}
      {progress === 100 && (
          <div className="absolute top-4 right-[-35px] bg-yellow-400 text-yellow-900 text-[10px] font-black py-1 px-10 rotate-45 shadow-sm uppercase tracking-widest z-10">
              Graduated
          </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-[var(--accent-bg)] text-[var(--accent)] rounded-full text-[10px] font-black uppercase tracking-wider border border-[var(--accent-border)]">
                {course.category || 'Course'}
            </span>
            {course.averageRating > 0 && (
                <div className="flex items-center space-x-1 text-yellow-500 font-bold text-xs">
                    <span>★</span>
                    <span>{course.averageRating}</span>
                    <span className="text-[var(--text)] opacity-40 font-normal">({course.totalReviews})</span>
                </div>
            )}
        </div>

        <h3 className="text-xl font-black mb-2 text-[var(--text-h)] leading-tight group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight italic">
            {course.title}
        </h3>
        <p className="text-[var(--text)] opacity-70 mb-6 line-clamp-2 text-sm leading-relaxed">{course.description}</p>
        
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--border)]">
          <span className="text-2xl font-black text-[var(--text-h)]">${course.price}</span>
          <div className="text-right">
              <p className="text-[10px] text-[var(--text)] opacity-50 font-bold uppercase tracking-widest">Instructor</p>
              <p className="text-xs font-bold text-[var(--accent)]">{course.instructor?.name || 'Pro Educator'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto space-y-3">
        {userRole === 'student' && !isEnrolled && (
            <button
            onClick={() => onEnroll(course._id)}
            className="w-full py-4 rounded-xl font-black bg-[var(--accent)] text-white hover:shadow-lg hover:shadow-[var(--accent-bg)] transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
            Enroll Now
            </button>
        )}

        {(isEnrolled || userRole === 'instructor') && (
            <button
            onClick={() => {
                if (isEnrolled && progress === 100) {
                    navigate(`/certificate/${course._id}`);
                } else {
                    navigate(`/course/${course._id}`);
                }
            }}
            className="w-full py-4 rounded-xl font-black bg-[var(--text-h)] text-[var(--bg)] hover:shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs"
            >
            {isEnrolled && progress === 100 ? 'View Certificate' : 'Go to Course'}
            </button>
        )}
      </div>
    </div>
  );
}

export default CourseCard;
