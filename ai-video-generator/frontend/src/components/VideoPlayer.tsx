import React from 'react';
import { Play, Download } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const fullUrl = videoUrl ? (videoUrl.startsWith('http') ? videoUrl : `http://localhost:8000${videoUrl}`) : '';

  return (
    <div className="relative aspect-[9/16] bg-slate-950 flex items-center justify-center group overflow-hidden">
      {!videoUrl ? (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 relative">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl animate-pulse" />
            <Play className="w-10 h-10 text-indigo-400 fill-indigo-400/20 ml-1" />
          </div>
          <div className="text-center">
            <p className="text-indigo-100 font-bold tracking-tight mb-1">Awaiting Generation</p>
            <p className="text-slate-500 text-xs">Your cinematic story will appear here</p>
          </div>
        </div>
      ) : (
        <>
          <video 
            src={fullUrl} 
            controls 
            autoPlay
            className="w-full h-full object-cover"
          />
          <a 
            href={fullUrl}
            download
            className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-indigo-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            title="Download Video"
          >
            <Download className="w-5 h-5" />
          </a>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
