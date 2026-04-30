import React, { useState } from 'react';
import { Link2, FileText, Send, Loader2, Mic2, Globe } from 'lucide-react';

interface ArticleInputProps {
  onProcess: (title: string, content: string, voiceId: string) => void;
  onProcessUrl: (url: string, voiceId: string) => void;
  isLoading: boolean;
}

const VOICE_OPTIONS = [
  { id: 'en-US-GuyNeural', name: 'Guy (Male)', color: 'bg-blue-500', lang: 'EN-US' },
  { id: 'en-US-AriaNeural', name: 'Aria (Female)', color: 'bg-pink-500', lang: 'EN-US' },
  { id: 'en-US-ChristopherNeural', name: 'Christopher (Male)', color: 'bg-indigo-500', lang: 'EN-US' },
  { id: 'en-US-JennyNeural', name: 'Jenny (Female)', color: 'bg-emerald-500', lang: 'EN-US' },
];

const ArticleInput: React.FC<ArticleInputProps> = ({ onProcess, onProcessUrl, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'url'>('url');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [voiceId, setVoiceId] = useState(VOICE_OPTIONS[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text') {
      onProcess(title, content, voiceId);
    } else {
      onProcessUrl(url, voiceId);
    }
  };

  return (
    <div className="glass-panel overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-indigo-500/10">
      <div className="flex p-2 bg-slate-950/20 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-3xl transition-all duration-500 font-bold text-sm ${
            activeTab === 'url' 
              ? 'bg-indigo-600 text-white shadow-[0_10px_25px_rgba(79,70,229,0.4)]' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
        >
          <Globe className={`w-4 h-4 ${activeTab === 'url' ? 'animate-pulse' : ''}`} />
          URL Link
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-3xl transition-all duration-500 font-bold text-sm ${
            activeTab === 'text' 
              ? 'bg-indigo-600 text-white shadow-[0_10px_25px_rgba(79,70,229,0.4)]' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
        >
          <FileText className={`w-4 h-4 ${activeTab === 'text' ? 'animate-pulse' : ''}`} />
          Text Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Mic2 className="w-3 h-3 text-indigo-500" />
              AI Voice Narrator
            </label>
            <span className="text-[10px] font-bold text-indigo-400/60 uppercase tracking-widest">Studio Quality</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {VOICE_OPTIONS.map((voice) => (
              <button
                key={voice.id}
                type="button"
                onClick={() => setVoiceId(voice.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-500 flex items-center gap-4 relative overflow-hidden group ${
                  voiceId === voice.id 
                    ? 'border-indigo-500/50 bg-indigo-500/10 ring-1 ring-indigo-500/20' 
                    : 'border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/60'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${voice.color} ${voiceId === voice.id ? 'animate-pulse scale-125 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'opacity-40'}`} />
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${voiceId === voice.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {voice.name}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono">{voice.lang}</span>
                </div>
                {voiceId === voice.id && (
                  <div className="absolute top-0 right-0 p-1">
                    <div className="w-1 h-1 rounded-full bg-indigo-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="px-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Content</label>
          </div>
          
          {activeTab === 'text' ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
              <input
                type="text"
                placeholder="Article Title..."
                className="input-field py-5 text-lg font-semibold"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Paste your story content here..."
                className="input-field min-h-[220px] resize-none leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Link2 className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="url"
                  placeholder="https://news.example.com/article"
                  className="input-field py-6 pl-14 text-sm"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <p className="mt-3 text-[10px] text-slate-500 ml-2 italic">
                Supporting all major news outlets and blogs.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="premium-button w-full flex items-center justify-center gap-4 text-sm tracking-widest uppercase group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Initializing Pipeline
            </>
          ) : (
            <>
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              Generate Cinematic Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ArticleInput;

