import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CertificateView from './CertificateView';

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        // 1. Get user info
        const userRes = await api.get(`/auth`);
        const user = userRes.data;

        // 2. Get course info
        const courseRes = await api.get(`/courses/${courseId}`);
        const course = courseRes.data;

        // 3. Get progress/completion date
        const progressRes = await api.get(`/progress/${courseId}`);
        const progress = progressRes.data;

        // Determine completion date (last lesson completed or now as fallback)
        let completionDate = "Recently";
        if (progress.completedLessons && progress.completedLessons.length > 0) {
            const lastDate = new Date(progress.completedLessons[progress.completedLessons.length - 1].date);
            completionDate = lastDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }

        setData({
          studentName: user.name,
          courseName: course.title,
          completionDate: completionDate
        });
      } catch (err) {
        console.error("Error fetching certificate data", err);
        setError("Could not generate certificate. Ensure course is completed.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-black uppercase tracking-widest text-[var(--accent)] animate-pulse">Forging Your Identity...</p>
        </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] p-8">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
            <h2 className="text-2xl font-black text-red-500 mb-4 uppercase italic">Access Denied</h2>
            <p className="text-[var(--text)] opacity-60 mb-8 font-medium">{error}</p>
            <button 
                onClick={() => navigate('/dashboard')}
                className="bg-[var(--text-h)] text-[var(--bg)] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
            >
                Return to Base
            </button>
        </div>
    </div>
  );

  return (
    <div className="bg-[var(--bg)] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
            <button 
                onClick={() => navigate('/dashboard')}
                className="mb-8 text-[var(--text)] opacity-40 hover:opacity-100 hover:text-[var(--accent)] font-black uppercase tracking-[0.3em] text-[10px] flex items-center transition-all group"
            >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Return to Dashboard
            </button>
            <CertificateView 
                studentName={data.studentName} 
                courseName={data.courseName} 
                completionDate={data.completionDate} 
            />
        </div>
    </div>
  );
};

export default CertificatePage;
