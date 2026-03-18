import { useRef } from 'react';

function CertificateView({ studentName, courseName, completionDate }) {
  const certRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-12 animate-in zoom-in-95 duration-1000">
      <div 
        ref={certRef}
        className="relative bg-[var(--bg)] border-[20px] border-double border-[var(--text-h)] p-6 md:p-16 text-center shadow-2xl overflow-hidden group transition-colors duration-500"
        style={{ minHeight: '700px' }}
      >
        {/* Cinematic background elements */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[var(--accent)] rounded-full opacity-[0.05] blur-[100px] group-hover:opacity-[0.08] transition-opacity"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500 rounded-full opacity-[0.05] blur-[100px] group-hover:opacity-[0.08] transition-opacity"></div>
        
        <div className="relative z-10 border-2 border-[var(--border)] p-6 md:p-12 h-full flex flex-col justify-between">
            <div className="mb-8">
                <div className="inline-flex items-center space-x-3 mb-4">
                    <div className="w-12 h-1 bg-[var(--accent)]"></div>
                    <h1 className="text-[var(--text-h)] text-3xl font-black uppercase tracking-widest italic">EduMERN</h1>
                    <div className="w-12 h-1 bg-[var(--accent)]"></div>
                </div>
                <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] opacity-80">Global Certification of Intelligence</p>
            </div>

            <div className="space-y-4">
                <p className="text-lg text-[var(--text)] italic opacity-40 font-medium tracking-wide">This specialized credential is awarded to</p>
                
                <h2 className="text-5xl md:text-7xl font-black text-[var(--text-h)] py-4 tracking-tighter italic uppercase underline decoration-[var(--accent)] decoration-[12px] underline-offset-[12px]">
                    {studentName}
                </h2>

                <p className="text-lg text-[var(--text)] italic opacity-40 font-medium tracking-wide pt-6">for the successful mastery and deployment of</p>
                
                <h3 className="text-3xl md:text-5xl font-black text-[var(--text-h)] uppercase tracking-tight italic leading-none">
                    {courseName}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end mt-20 px-4 md:px-12">
                <div className="text-center order-2 md:order-1">
                    <div className="w-full border-b-2 border-[var(--text-h)] mb-3 opacity-20"></div>
                    <p className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">Instructor Authority</p>
                </div>
                
                <div className="flex justify-center order-1 md:order-2">
                    <div className="relative w-32 h-32 bg-[var(--text-h)] text-[var(--bg)] rounded-full flex items-center justify-center border-[12px] border-[var(--border)] shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute inset-0 border-4 border-[var(--bg)]/20 rounded-full m-2"></div>
                        <span className="font-black text-xl italic tracking-tighter">VERIFIED</span>
                    </div>
                </div>

                <div className="text-center order-3">
                    <p className="text-sm font-black text-[var(--text-h)] italic mb-2 tracking-widest">{completionDate}</p>
                    <div className="w-full border-b-2 border-[var(--text-h)] mb-3 opacity-20"></div>
                    <p className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">Temporal Log (Date)</p>
                </div>
            </div>

            <div className="mt-12 opacity-10">
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--text)]">Certificate ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 animate-in slide-in-from-bottom-6 duration-1000">
        <button 
            onClick={handlePrint}
            className="w-full md:w-auto bg-[var(--text-h)] text-[var(--bg)] px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
            <span className="mr-3 text-xl">💾</span> EXPORT IDENTITY (PDF)
        </button>
        <p className="text-[10px] font-black text-[var(--text)] opacity-30 uppercase tracking-widest italic">Physical print enabled via system dialog</p>
      </div>
    </div>
  );
}

export default CertificateView;
