import React, { useState } from 'react';
import Head from 'next/head';
import ArticleInput from '../components/ArticleInput';
import VideoPlayer from '../components/VideoPlayer';
import ScenePreview from '../components/ScenePreview';
import { processArticle, processUrl, getJobStatus, JobStatus, Scene } from '../services/api';
import { Sparkles, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <Head>
        <title>VidioAI | Professional Video Generator</title>
        <meta name="description" content="Generate high-quality narrated videos from any article using advanced AI pipeline." />
      </Head>

      <main className="max-w-lg mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full mb-6 font-semibold tracking-wide text-xs uppercase border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Video Engine
          </div>
          <h1 className="text-6xl font-extrabold mb-4 gradient-text tracking-tighter">
            Vidio<span className="text-indigo-500 text-glow">AI</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Turn articles into viral mobile videos.
          </p>
        </header>

        {error && (
          <div className="glass-panel border-red-500/30 bg-red-500/5 p-6 mb-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="text-red-400 font-bold mb-1 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Access Blocked
            </div>
            <p className="text-red-300/80 text-sm">{error}</p>
            <div className="mt-4 pt-4 border-t border-red-500/10 text-xs text-red-300/60 leading-relaxed">
              Tip: Some news sites block AI tools. Please copy the article text and paste it into the <b>Text Input</b> tab instead!
            </div>
          </div>
        )}

        {isLoading && jobStatus && jobStatus.status !== 'completed' && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-sky-400 to-indigo-600 transition-all duration-1000 ease-in-out"
                  style={{ width: `${jobStatus.progress}%` }}
                />
              </div>
              
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                  <div className="absolute inset-0 blur-2xl bg-indigo-500/20 animate-pulse" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 capitalize tracking-tight text-white">
                  {jobStatus.status}
                </h3>
                <div className="flex items-center justify-center gap-3 mb-6">
                   <span className="text-indigo-400 font-mono text-xl">{jobStatus.progress}%</span>
                   <span className="text-slate-600">|</span>
                   <span className="text-slate-400 text-sm">Processing Scenes</span>
                </div>
                
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Our AI is editing your cinematic mobile video. Grab a coffee, this takes about 60 seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {!jobStatus || jobStatus.status !== 'completed' ? (
          !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ArticleInput 
                onProcess={handleProcess} 
                onProcessUrl={handleProcessUrl} 
                isLoading={isLoading} 
              />
            </div>
          )
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="glass-panel overflow-hidden shadow-indigo-500/10">
              <VideoPlayer videoUrl={jobStatus.video_url || ""} />
            </div>
            
            <div className="flex justify-center pt-4">
               <button 
                onClick={() => { setJobStatus(null); setIsLoading(false); }}
                className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
               >
                 <span className="w-8 h-px bg-slate-800 group-hover:bg-indigo-500 transition-all" />
                 Create Another Video
                 <span className="w-8 h-px bg-slate-800 group-hover:bg-indigo-500 transition-all" />
               </button>
            </div>

            <div className="pt-4">
              <ScenePreview scenes={jobStatus.scenes} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-24 text-center">
        <p className="text-slate-600 text-xs tracking-widest uppercase mb-2">Powered by Antigravity Engine</p>
        <p className="text-slate-800 text-[10px]">&copy; 2026 VIDIOAI. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
