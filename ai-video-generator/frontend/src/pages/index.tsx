import React, { useState } from 'react';
import Head from 'next/head';
import ArticleInput from '../components/ArticleInput';
import VideoPlayer from '../components/VideoPlayer';
import ScenePreview from '../components/ScenePreview';
import { processArticle, processUrl, getJobStatus, JobStatus, Scene } from '../services/api';
import { Sparkles, Loader2, Play, ChevronRight } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await getJobStatus(jobId);
        setJobStatus(status);
        
        if (status.status === 'completed' || status.status.startsWith('error')) {
          clearInterval(interval);
          setIsLoading(false);
          if (status.status.startsWith('error')) {
            setError(status.status);
          }
        }
      } catch (err) {
        clearInterval(interval);
        setIsLoading(false);
        setError("Lost connection to server while tracking job.");
      }
    }, 2000);
  };

  const handleProcess = async (title: string, content: string, voiceId: string) => {
    setIsLoading(true);
    setError(null);
    setJobStatus(null);
    try {
      const { job_id } = await processArticle(title, content, voiceId);
      pollJobStatus(job_id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleProcessUrl = async (url: string, voiceId: string) => {
    setIsLoading(true);
    setError(null);
    setJobStatus(null);
    try {
      const { job_id } = await processUrl(url, voiceId);
      pollJobStatus(job_id);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An unexpected error occurred while fetching the URL.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 overflow-hidden">
      <Head>
        <title>VidioAI | AI-Powered Cinematic Video Generator</title>
        <meta name="description" content="Transform any article or URL into a stunning vertical cinematic video with AI-powered narration and automated scene generation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-3s' }} />

      <main className="relative z-10 max-w-xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-indigo-300 px-5 py-2 rounded-full mb-8 font-semibold tracking-wide text-xs uppercase animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Empowering Content Creators
          </div>
          
          <h1 className="text-7xl font-extrabold mb-6 gradient-text tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            Vidio<span className="text-indigo-500 text-glow">AI</span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-xl max-w-md mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4">
            Create professional-grade <span className="text-white font-semibold">cinematic mobile videos</span> from any article in seconds.
          </p>
        </header>

        {error && (
          <div className="glass-panel border-red-500/30 bg-red-500/5 p-8 mb-10 text-center animate-in zoom-in duration-500">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h4 className="text-red-400 font-bold mb-2">Processing Error</h4>
            <p className="text-red-300/70 text-sm mb-6 leading-relaxed">{error}</p>
            <div className="p-4 bg-slate-950/40 rounded-xl border border-red-500/10 text-xs text-red-300/60 leading-relaxed italic">
              Tip: Some news sites block automated access. Try copying the text manually!
            </div>
          </div>
        )}

        {isLoading && jobStatus && jobStatus.status !== 'completed' && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-12 text-center relative">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-cyan-400 to-indigo-600 bg-[length:200%_auto] animate-shimmer transition-all duration-1000 ease-out"
                  style={{ width: `${jobStatus.progress}%` }}
                />
              </div>
              
              <div className="relative z-10">
                <div className="relative inline-flex items-center justify-center mb-8">
                  <div className="absolute inset-0 blur-3xl bg-indigo-500/30 animate-pulse scale-150" />
                  <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center shadow-2xl relative z-10">
                    <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-3 capitalize tracking-tight text-white font-display">
                  {jobStatus.status}
                </h3>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                   <div className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-xl font-bold">
                     {jobStatus.progress}%
                   </div>
                   <div className="w-1 h-1 rounded-full bg-slate-700" />
                   <span className="text-slate-400 text-sm font-medium tracking-wide">Orchestrating AI Assets</span>
                </div>
                
                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Generating narration, selecting cinematic clips, and rendering your vertical masterpiece.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!jobStatus || jobStatus.status !== 'completed' ? (
          !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <ArticleInput 
                onProcess={handleProcess} 
                onProcessUrl={handleProcessUrl} 
                isLoading={isLoading} 
              />
            </div>
          )
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="glass-panel overflow-hidden shadow-indigo-500/20 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
              <VideoPlayer videoUrl={jobStatus.video_url || ""} />
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">READY FOR PUBLISH</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
               <button 
                onClick={() => { setJobStatus(null); setIsLoading(false); }}
                className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-500"
               >
                 <span className="text-slate-400 group-hover:text-white font-bold transition-colors">Generate New Video</span>
                 <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
               </button>
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-3 mb-8 ml-2">
                <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                <h2 className="text-2xl font-bold font-display">Scene Breakdown</h2>
              </div>
              <ScenePreview scenes={jobStatus.scenes} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-32 pb-16 text-center relative z-10">
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mx-auto mb-8" />
        <p className="text-slate-600 text-[10px] tracking-[0.3em] uppercase mb-3 font-bold">VidioAI &bull; Next-Gen Content Engine</p>
        <p className="text-slate-800 text-[9px] font-medium">&copy; 2026 ANTIGRAVITY LABS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}

