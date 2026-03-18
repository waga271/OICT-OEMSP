import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder";

function Dashboard() {
  const { user, loadUser, logout: authLogout } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get("search") || "");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search") || "";
    setSearchQuery(query);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch courses with filter
        const coursesRes = await api.get(`/courses?search=${searchQuery}&category=${category}`);
        setCourses(coursesRes.data);

        // Fetch progress for each course the user is enrolled in
        if (user?.role === 'student') {
            const enrolledCourses = coursesRes.data.filter(c => 
                c.students.some(s => s.user === user._id)
            );
            
            const progressData = {};
            for (const course of enrolledCourses) {
                try {
                    const pRes = await api.get(`/progress/${course._id}`);
                    const lessonsRes = await api.get(`/lessons/${course._id}`);
                    const total = lessonsRes.data.length;
                    const completed = pRes.data.completedLessons?.length || 0;
                    progressData[course._id] = total > 0 ? Math.round((completed / total) * 100) : 0;
                } catch (pErr) {
                    console.error("Error fetching progress for course", course._id);
                }
            }
            setUserProgress(progressData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchData();
    }
  }, [searchQuery, category, user]); // Re-fetch when filters or user changes

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("payment") === "success") {
        showToast("Payment successful! Welcome to the course.", "success");
        // Clear query params
        window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [showToast]);

  const onEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { "x-auth-token": token } };
      
      const course = courses.find(c => c._id === courseId);
      
      if (course.price > 0) {
          // Paid course - redirect to Stripe
          const res = await axios.post(`${API_URL}/api/payments/create-checkout-session/${courseId}`, {}, config);
          const { id } = res.data;
          
          const stripe = await loadStripe(STRIPE_PK);
          await stripe.redirectToCheckout({ sessionId: id });
          return;
      }

      // Free course - direct enrollment
      // Re-fetch all data to update UI (user, courses, progress)
      // This will trigger the main useEffect
      const coursesRes = await api.get('/courses');
      setCourses(coursesRes.data);
      showToast("Enrolled successfully! Enjoy the course.", "success");
    } catch (err) {
      console.error("Enrollment error", err);
      // api utility handled the toast
    }
  };

  const onCourseAdded = async () => {
    setShowAddCourse(false);
    const res = await api.get('/courses');
    setCourses(res.data);
    showToast("Course published successfully! Science rules.", "success");
  };

  const logout = () => {
    authLogout();
    window.location.href = "/";
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-300">

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-3xl font-bold text-[var(--text-h)]">
                {showAnalytics ? "Instructor Insights" : "Explore Knowledge"}
              </h2>
              <span className="bg-[var(--accent-bg)] text-[var(--accent)] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-[var(--accent-border)]">
                {user?.role}
              </span>
            </div>
            <p className="text-[var(--text)] font-medium">
              Hello, {user?.name}. {showAnalytics ? "Data-driven results for your courses." : "Find the perfect course to advance your career."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            {!showAnalytics && (
                <>
                    <div className="relative w-full sm:w-64">
                        <input 
                            type="text" 
                            placeholder="Search courses..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none bg-[var(--bg)] text-[var(--text)] transition-all"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>

                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full sm:w-40 px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none bg-[var(--bg)] text-[var(--text)] cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </>
            )}

            {user?.role === 'instructor' && (
                <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className={`px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all border shadow-sm ${
                            showAnalytics 
                                ? 'bg-[var(--accent)] text-white border-[var(--accent)]' 
                                : 'bg-[var(--bg)] text-[var(--accent)] border-[var(--accent-border)] hover:bg-[var(--accent-bg)]'
                        }`}
                    >
                        {showAnalytics ? 'View Courses' : 'Analytics'}
                    </button>
                    {!showAnalytics && (
                        <button
                            onClick={() => setShowAddCourse(!showAddCourse)}
                            className="flex-grow sm:flex-grow-0 bg-[var(--text-h)] text-[var(--bg)] px-6 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
                        >
                            {showAddCourse ? '✕' : '+ New Course'}
                        </button>
                    )}
                </div>
            )}
          </div>
        </header>

        {showAnalytics && user?.role === 'instructor' ? (
            <InstructorAnalytics />
        ) : (
            <>
                {showAddCourse && <AddCourse onCourseAdded={onCourseAdded} onCancel={() => setShowAddCourse(false)} />}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <>
                <SkeletonLoader type="card" />
                <SkeletonLoader type="card" />
                <SkeletonLoader type="card" />
             </>
          ) : courses.length > 0 ? (
            courses.map(course => {
              const isEnrolled = course.students?.some(s => s.user === user?._id);
              return (
                <div key={course._id} className="flex flex-col animate-in zoom-in-95 duration-500">
                  <CourseCard 
                    course={course} 
                    userRole={user?.role}
                    onEnroll={onEnroll}
                    isEnrolled={isEnrolled}
                    progress={userProgress[course._id]}
                  />
                  {user?.role === 'student' && isEnrolled && (
                    <div className="mt-4 px-1">
                      <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-[var(--text)] opacity-40">
                        <span>Course Mastery</span>
                        <span className="text-[var(--accent)]">{userProgress[course._id] || 0}%</span>
                      </div>
                      <div className="w-full bg-[var(--social-bg)] rounded-full h-2 shadow-inner overflow-hidden">
                        <div 
                          className="bg-[var(--accent)] h-full transition-all duration-1000 ease-out rounded-full shadow-sm" 
                          style={{ width: `${userProgress[course._id] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-24 bg-[var(--social-bg)]/10 rounded-3xl border-2 border-dashed border-[var(--border)]">
                <div className="w-20 h-20 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg className="w-10 h-10 text-[var(--accent)] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              <p className="text-[var(--text)] opacity-40 text-xs font-black uppercase tracking-widest">No intelligence found in this sector.</p>
              <button 
                onClick={() => { setSearchQuery(""); setCategory("All"); }}
                className="mt-6 text-[var(--accent)] font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                Reset Exploration Filters
              </button>
            </div>
          )}
                </div>
            </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
