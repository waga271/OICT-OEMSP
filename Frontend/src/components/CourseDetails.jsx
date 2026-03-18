import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import AddLesson from "./AddLesson";
import QuizView from "./QuizView";
import VideoPlayer from "./VideoPlayer";
import DiscussionBoard from "./DiscussionBoard";
import ReviewSystem from "./ReviewSystem";
import CertificateView from "./CertificateView";
import AddQuiz from "./AddQuiz";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Can be a lesson or quiz
  const [itemType, setItemType] = useState('lesson'); // 'lesson' or 'quiz')
  const [showCertificate, setShowCertificate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
        // Fetch course
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // Fetch lessons
        const lessonsRes = await api.get(`/lessons/${id}`);
        setLessons(lessonsRes.data);
        if (lessonsRes.data.length > 0) {
            setSelectedItem(lessonsRes.data[0]);
            setItemType('lesson');
        }

        // Fetch quizzes
        const quizzesRes = await api.get(`/quizzes/course/${id}`);
        setQuizzes(quizzesRes.data);

      // Fetch progress
      const progressRes = await api.get(`/progress/${id}`);
      setProgress(progressRes.data);
    } catch (err) {
      console.error("Error fetching course details", err);
      if (err.response?.status === 401) {
          showToast("Please enroll in this course to view content.", "info");
          navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [id, user, navigate]);

  const onLessonAdded = (newLesson) => {
    setLessons([...lessons, newLesson]);
    setShowAddLesson(false);
  };

  const fetchCourse = () => {
    fetchData();
  };

  const onMarkComplete = async (lessonId) => {
    try {
        const res = await api.post(`/progress/lesson/${id}/${lessonId}`);
        setProgress(res.data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
        console.error("Error marking lesson complete", err);
    }
  };

  const onQuizComplete = async (score) => {
      try {
          const res = await api.post(`/progress/quiz/${id}/${selectedItem._id}`, { score });
          setProgress(res.data);
          showToast(`Quiz completed! Your score: ${score}%`, "success");
          setSelectedItem(null);
      } catch (err) {
          console.error("Error saving quiz progress", err);
      }
  };

  const calculateProgress = () => {
    if (!lessons.length) return 0;
    const completedCount = progress?.completedLessons?.length || 0;
    return Math.round((completedCount / lessons.length) * 100);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-2xl font-black italic text-[var(--text-h)] bg-[var(--bg)]">Loading Course...</div>;

  const isInstructor = user?._id === course?.instructor?._id;
  const progressPercent = calculateProgress();

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-12 transition-colors duration-300">
      <nav className="bg-[var(--bg)] border-b border-[var(--border)] p-4 mb-8 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-[var(--accent)] hover:underline font-black uppercase tracking-widest text-xs flex items-center">
            ← Dashboard
          </Link>
          <div className="text-right">
            <h1 className="text-sm font-black text-[var(--text-h)] uppercase tracking-tight italic">{course?.title}</h1>
            <p className="text-[10px] text-[var(--text)] opacity-50 font-bold uppercase tracking-widest">Instructor: {course?.instructor?.name}</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg)] rounded-2xl shadow-sm border border-[var(--border)] p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-[var(--text)] opacity-50 uppercase tracking-widest">Mastery progress</span>
                <span className="text-sm font-black text-[var(--accent)]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[var(--social-bg)] rounded-full h-2.5 overflow-hidden shadow-inner">
                <div className="bg-[var(--accent)] h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="border border-[var(--border)] rounded-3xl bg-[var(--bg)] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[var(--border)] bg-[var(--social-bg)]/30 flex justify-between items-center">
                <h2 className="font-black text-[var(--text-h)] uppercase tracking-tight italic">Content</h2>
                {isInstructor && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => { setShowAddLesson(!showAddLesson); setShowAddQuiz(false); }}
                            className="bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[var(--accent-bg)] transition-all active:scale-95"
                        >
                            {showAddLesson ? '✕' : '+ Lesson'}
                        </button>
                        <button
                            onClick={() => { setShowAddQuiz(!showAddQuiz); setShowAddLesson(false); }}
                            className="bg-[var(--text-h)] text-[var(--bg)] px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95"
                        >
                            {showAddQuiz ? '✕' : '+ Quiz'}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {showAddQuiz && isInstructor && (
                    <AddQuiz 
                        courseId={id} 
                        onQuizAdded={(newQuiz) => {
                            setQuizzes([...quizzes, newQuiz]);
                            setShowAddQuiz(false);
                        }}
                        onCancel={() => setShowAddQuiz(false)}
                    />
                )}
                    {/* Completion Reward */}
                    {calculateProgress() === 100 && (
                        <button 
                            onClick={() => { setSelectedItem(null); setShowCertificate(true); }}
                            className={`w-full p-6 rounded-2xl border-2 flex items-center space-x-4 transition-all transform ${
                                showCertificate 
                                    ? 'bg-[var(--text-h)] border-[var(--text-h)] text-[var(--bg)] shadow-xl scale-102' 
                                    : 'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white group/claim shadow-md'
                            }`}
                        >
                            <span className="text-3xl filter drop-shadow">🏆</span>
                            <div className="text-left font-black uppercase tracking-tight italic">
                                <p className="text-[9px] opacity-60">Status: Complete</p>
                                <p className="text-lg">Claim Certificate</p>
                            </div>
                        </button>
                    )}

                {lessons.map((lesson, index) => (
                <button
                    key={lesson._id}
                    onClick={() => { setSelectedItem(lesson); setItemType('lesson'); setShowCertificate(false); }}
                    className={`w-full text-left p-4 flex items-center rounded-2xl transition-all ${
                    selectedItem?._id === lesson._id && itemType === 'lesson'
                        ? 'bg-[var(--accent-bg)] text-[var(--accent)] shadow-inner' 
                        : 'hover:bg-[var(--social-bg)]/20 text-[var(--text)] italic font-medium'
                    }`}
                >
                    <div className="flex-shrink-0 mr-3">
                        {progress?.completedLessons?.some(l => l.lesson === lesson._id) ? (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ) : (
                            <span className="w-5 h-5 flex items-center justify-center text-[10px] text-[var(--text)] opacity-40 font-black border border-[var(--border)] rounded-full">{index + 1}</span>
                        )}
                    </div>
                    <span className="truncate">{lesson.title}</span>
                </button>
                ))}

                {quizzes.map((quiz) => (
                <button
                    key={quiz._id}
                    onClick={() => { setSelectedItem(quiz); setItemType('quiz'); setShowCertificate(false); }}
                    className={`w-full text-left p-4 flex items-center rounded-2xl transition-all ${
                    selectedItem?._id === quiz._id && itemType === 'quiz'
                        ? 'bg-[var(--text-h)] text-[var(--bg)] shadow-lg' 
                        : 'hover:bg-[var(--social-bg)]/20 text-[var(--text)] italic font-medium'
                    }`}
                >
                    <div className="flex-shrink-0 mr-3">
                        <svg className={`w-5 h-5 ${selectedItem?._id === quiz._id ? 'text-[var(--bg)]' : 'text-[var(--accent)] opacity-40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="font-black uppercase tracking-tight text-xs">Quiz: {quiz.title}</span>
                </button>
                ))}
            </div>
          </div>
          
          {showAddLesson && isInstructor && (
            <div className="mt-4">
                <AddLesson 
                    courseId={id} 
                    onLessonAdded={onLessonAdded} 
                    onCancel={() => setShowAddLesson(false)} 
                />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {showCertificate ? (
            <div className="bg-[var(--bg)] rounded-3xl p-8 shadow-sm border border-[var(--border)] animate-in zoom-in-95 duration-700">
                <CertificateView 
                    studentName={user?.name} 
                    courseName={course?.title} 
                    completionDate={new Date().toLocaleDateString()}
                />
            </div>
          ) : selectedItem ? (
            itemType === 'lesson' ? (
                <div className="bg-[var(--bg)] rounded-3xl shadow-sm overflow-hidden border border-[var(--border)] pb-8">
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative">
                            {showSuccess && (
                                <div className="absolute top-[-40px] left-0 right-0 flex justify-center animate-in slide-in-from-top-4 duration-500 pointer-events-none">
                                    <div className="bg-green-500 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center space-x-2">
                                        <span>🌟 +50 XP</span>
                                        <span>LESSON MASTERED</span>
                                    </div>
                                </div>
                            )}
                            <h2 className="text-3xl font-black text-[var(--text-h)] uppercase tracking-tight italic">{selectedItem.title}</h2>
                            {user?.role === 'student' && (
                                <button
                                    onClick={() => onMarkComplete(selectedItem._id)}
                                    disabled={progress?.completedLessons?.some(l => l.lesson === selectedItem._id)}
                                    className={`flex items-center px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all transform active:scale-95 ${
                                        progress?.completedLessons?.some(l => l.lesson === selectedItem._id)
                                            ? 'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)] opacity-80 cursor-default'
                                            : 'bg-[var(--accent)] text-white hover:shadow-[var(--accent-bg)]'
                                    }`}
                                >
                                    {progress?.completedLessons?.some(l => l.lesson === selectedItem._id) 
                                        ? '✓ Finished' 
                                        : 'Mark Finished'}
                                </button>
                            )}
                        </div>
                        
                        {selectedItem.videoUrl && (
                            <div className="mb-8">
                                <VideoPlayer url={selectedItem.videoUrl} />
                            </div>
                        )}

                        <div className="prose prose-blue max-w-none text-[var(--text)] whitespace-pre-wrap leading-relaxed font-medium mb-12 opacity-80">
                            {selectedItem.content}
                        </div>

                        {/* Discussion Board */}
                        <DiscussionBoard lessonId={selectedItem._id} user={user} />
                    </div>
                    
                    <div className="bg-[var(--social-bg)]/30 px-10 py-4 border-t border-[var(--border)] flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--text)] opacity-40">
                        <span>Unit: {selectedItem.title}</span>
                        <span>Instructor: {course?.instructor?.name}</span>
                    </div>
                </div>
            ) : (
                <QuizView quiz={selectedItem} onComplete={onQuizComplete} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg)] text-[var(--text)] opacity-40">
                <svg className="w-24 h-24 mb-6 opacity-10 transform scale-150 rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <p className="text-xs font-black uppercase tracking-widest text-center">Select a lesson or quiz to start your journey.</p>
            </div>
          )}

          {/* Global Review System */}
          <ReviewSystem courseId={id} user={user} onReviewAdded={fetchCourse} />
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
