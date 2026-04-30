import React, { useState } from 'react';
import { Link2, FileText, Send, Loader2 } from 'lucide-react';

interface ArticleInputProps {
  onProcess: (title: string, content: string, voiceId: string) => void;
  onProcessUrl: (url: string, voiceId: string) => void;
  isLoading: boolean;
}

const VOICE_OPTIONS = [
  { id: 'en-US-GuyNeural', name: 'Guy (Male)', color: 'bg-blue-500' },
  { id: 'en-US-AriaNeural', name: 'Aria (Female)', color: 'bg-pink-500' },
  { id: 'en-US-ChristopherNeural', name: 'Christopher (Male)', color: 'bg-indigo-500' },
  { id: 'en-US-JennyNeural', name: 'Jenny (Female)', color: 'bg-emerald-500' },
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
    <div className="glass-panel p-2 overflow-hidden shadow-2xl">
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-500 font-semibold text-sm ${
            activeTab === 'url' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <Link2 className="w-4 h-4" />
          URL Link
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-500 font-semibold text-sm ${
            activeTab === 'text' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          Text Input
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">AI Narrator</label>
          <div className="grid grid-cols-2 gap-3">
            {VOICE_OPTIONS.map((voice) => (
              <button
                key={voice.id}
                type="button"
                onClick={() => setVoiceId(voice.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 ${
                  voiceId === voice.id 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${voice.color} ${voiceId === voice.id ? 'animate-pulse scale-125' : ''}`} />
                <span className={`text-xs font-medium ${voiceId === voice.id ? 'text-white' : 'text-slate-400'}`}>
                  {voice.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'text' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <input
              type="text"
              placeholder="Article Title..."
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Paste your story content here..."
              className="input-field min-h-[180px] resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <input
              type="url"
              placeholder="https://news.example.com/article"
              className="input-field py-5"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="premium-button w-full flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Initializing Pipeline...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate Cinematic Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ArticleInput;
