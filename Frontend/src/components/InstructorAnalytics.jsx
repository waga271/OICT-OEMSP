import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function InstructorAnalytics() {
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/courses/instructor/analytics`);
        setAnalytics(res.data);
      } catch (err) {
        // API interceptor handles the error toast
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-12 text-center font-black uppercase tracking-widest text-[var(--text)] opacity-40 italic animate-pulse">Scanning Intelligence...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[var(--bg)] p-8 rounded-3xl shadow-sm border border-[var(--border)] border-l-8 border-l-[var(--accent)] transform hover:scale-102 transition-all">
            <p className="text-[var(--text)] opacity-50 text-[10px] font-black uppercase tracking-widest mb-2">Total Graduates</p>
            <h3 className="text-5xl font-black text-[var(--text-h)] italic tracking-tighter">
                {analytics.reduce((acc, curr) => acc + curr.studentCount, 0)}
            </h3>
        </div>
        <div className="bg-[var(--bg)] p-8 rounded-3xl shadow-sm border border-[var(--border)] border-l-8 border-l-[var(--text-h)] transform hover:scale-102 transition-all">
            <p className="text-[var(--text)] opacity-50 text-[10px] font-black uppercase tracking-widest mb-2">Active Modules</p>
            <h3 className="text-5xl font-black text-[var(--text-h)] italic tracking-tighter">{analytics.length}</h3>
        </div>
        <div className="bg-[var(--bg)] p-8 rounded-3xl shadow-sm border border-[var(--border)] border-l-8 border-l-[var(--accent-border)] transform hover:scale-102 transition-all">
            <p className="text-[var(--text)] opacity-50 text-[10px] font-black uppercase tracking-widest mb-2">Engage Rate</p>
            <h3 className="text-5xl font-black text-[var(--text-h)] italic tracking-tighter">
                {analytics.length > 0 
                  ? Math.round(analytics.reduce((acc, curr) => acc + curr.avgProgress, 0) / analytics.length) 
                  : 0}%
            </h3>
        </div>
      </div>

      <div className="bg-[var(--bg)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden transition-colors duration-300">
        <div className="p-8 border-b border-[var(--border)] bg-[var(--social-bg)]/30 flex justify-between items-center">
            <h3 className="text-xl font-black text-[var(--text-h)] uppercase tracking-tight italic">Performance Intelligence</h3>
            <span className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">Real-time engagement tracking</span>
        </div>

        <div className="p-8">
            {/* Visual Chart Section */}
            <div className="mb-12">
                <div className="flex justify-between items-end h-64 space-x-4 mb-8">
                    {analytics.map((course, idx) => (
                        <div key={course.courseId} className="flex-1 flex flex-col items-center group relative">
                            {/* Value Bubble */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[var(--text-h)] text-[var(--bg)] px-3 py-1 rounded-lg text-[10px] font-black tracking-widest pointer-events-none whitespace-nowrap z-10">
                                {course.avgProgress}% Engagement
                            </div>
                            
                            {/* Bar */}
                            <div className="w-full relative flex flex-col justify-end h-full">
                                <div 
                                    className="w-full bg-[var(--accent)] rounded-t-xl group-hover:bg-[var(--text-h)] transition-all duration-700 ease-out shadow-lg opacity-80 group-hover:opacity-100"
                                    style={{ height: `${course.avgProgress || 5}%`, animationDelay: `${idx * 150}ms` }}
                                >
                                    <div className="absolute inset-x-0 top-0 h-1/4 bg-white/10 rounded-t-xl"></div>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-[var(--text)] opacity-40 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all transform group-hover:scale-105 origin-top text-center truncate w-full">
                                {course.title}
                            </div>
                        </div>
                    ))}
                    {analytics.length === 0 && (
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-[var(--border)] rounded-3xl opacity-20">
                            <span className="text-xs font-black uppercase tracking-widest">Awaiting sector data...</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto -mx-8">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[var(--text)] opacity-40 text-[10px] font-black uppercase tracking-widest border-b border-[var(--border)]">
                            <th className="px-8 py-5">Intel Sector (Course)</th>
                            <th className="px-8 py-5 text-center">Units</th>
                            <th className="px-8 py-5">Mastery Avg</th>
                            <th className="px-8 py-5">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {analytics.map((course) => (
                            <tr key={course.courseId} className="hover:bg-[var(--social-bg)]/20 transition-all group">
                                <td className="px-8 py-6">
                                    <p className="font-black text-[var(--text-h)] uppercase tracking-tight italic group-hover:text-[var(--accent)] transition-colors">{course.title}</p>
                                </td>
                                <td className="px-8 py-6 text-center font-black text-[var(--text)] opacity-60 italic">{course.studentCount}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-32 bg-[var(--social-bg)] h-2 rounded-full overflow-hidden shadow-inner">
                                            <div className="bg-[var(--accent)] h-full transition-all duration-1000" style={{ width: `${course.avgProgress}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-black text-[var(--accent)]">{course.avgProgress}%</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                        course.studentCount > 0 
                                        ? 'bg-[var(--accent-bg)] text-[var(--accent)] border-[var(--accent-border)]' 
                                        : 'bg-[var(--social-bg)] text-[var(--text)] border-[var(--border)] opacity-30 shadow-inner'
                                    }`}>
                                        {course.studentCount > 0 ? 'Operational' : 'Idle'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorAnalytics;
