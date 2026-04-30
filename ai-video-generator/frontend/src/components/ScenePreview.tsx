import React from 'react';
import { Scene } from '../services/api';
import { Layout, Sparkles } from 'lucide-react';

interface ScenePreviewProps {
  scenes: Scene[];
}

const ScenePreview: React.FC<ScenePreviewProps> = ({ scenes }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <Layout className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white">Storyboard</h3>
      </div>
      
      <div className="space-y-4">
        {scenes.map((scene, idx) => (
          <div 
            key={scene.id} 
            className="glass-panel group hover:border-indigo-500/30 transition-all duration-500"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded">
                    SCENE {idx + 1}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">
                    {scene.emotion}
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-indigo-500/30 group-hover:text-indigo-400 transition-colors" />
              </div>
              
              <h4 className="font-bold text-lg mb-3 text-white leading-tight group-hover:text-indigo-100 transition-colors">
                {scene.title}
              </h4>
              
              <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-800 group-hover:border-indigo-500/20 transition-all">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic">
                  "{scene.narration}"
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider leading-4">
                  Visual: <span className="text-slate-400 lowercase font-medium tracking-normal">{scene.visual_description}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenePreview;
