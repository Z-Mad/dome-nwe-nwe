import React from 'react';
import { Heart, MessageCircle, Share2, Play, ThumbsUp, MoreHorizontal } from 'lucide-react';

const VideoView: React.FC = () => {
  const videos = [
    { id: 1, title: 'EP01: AI如何降低50%的废品率？', duration: '12:30', views: '2.4w', active: true },
    { id: 2, title: '实测：3秒定位板形缺陷', duration: '08:45', views: '1.8w', active: false },
    { id: 3, title: '冷轧工程师的使用反馈', duration: '15:20', views: '1.2w', active: false },
  ];

  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto flex gap-6 h-full">
        {/* Main Video Player Area */}
        <div className="flex-1 flex flex-col">
          <div className="aspect-video bg-black rounded-2xl shadow-lg relative group overflow-hidden">
             {/* Thumbnail / Video Placeholder */}
             <img 
               src="https://picsum.photos/seed/steel_mill/1200/675" 
               alt="Video Thumbnail" 
               className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform hover:bg-white/30">
                    <Play fill="white" className="text-white ml-2" size={40} />
                </div>
             </div>
             
             {/* Video Controls Mock */}
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="w-full h-1 bg-gray-600 rounded-full mb-4 overflow-hidden">
                    <div className="w-1/3 h-full bg-red-600"></div>
                </div>
                <div className="flex justify-between text-white text-sm">
                    <div className="flex gap-4">
                        <Play size={20} fill="white" />
                        <span>04:12 / 12:30</span>
                    </div>
                    <div>HD 1080p</div>
                </div>
             </div>
          </div>

          {/* Video Info */}
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900 mb-2">深度测评：钢铁行业的AlphaGo？冷轧AI助手实战演示</h1>
                   <div className="flex gap-3 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">#工业互联网</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">#黑科技</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">#智能制造</span>
                      <span>发布于 2025-04-15</span>
                   </div>
                </div>
                <div className="flex gap-4">
                   <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-pink-600 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><Heart size={20} /></div>
                      <span className="text-xs">2.4k</span>
                   </button>
                   <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><MessageCircle size={20} /></div>
                      <span className="text-xs">342</span>
                   </button>
                   <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center"><Share2 size={20} /></div>
                      <span className="text-xs">分享</span>
                   </button>
                </div>
             </div>
             <p className="mt-4 text-gray-600 leading-relaxed">
                今天带大家体验一下最新的冷轧质量AI助手。在过去，处理板形缺陷需要老师傅凭经验调整十几项参数，现在这个AI能在毫秒级时间内分析出原因并给出策略。视频中我们会对比传统模式和AI辅助模式下的效率差异...
             </p>
          </div>
        </div>

        {/* Sidebar / Playlist */}
        <div className="w-80 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold text-gray-800 mb-4">选集播放</h3>
               <div className="space-y-3">
                  {videos.map(video => (
                      <div key={video.id} className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${video.active ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                         <div className="relative w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <img src={`https://picsum.photos/seed/${video.id + 20}/200/120`} alt="thumb" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">{video.duration}</span>
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium leading-tight mb-1 ${video.active ? 'text-blue-600' : 'text-gray-800'}`}>{video.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                               <Play size={10} />
                               <span>{video.views}</span>
                            </div>
                         </div>
                      </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-5 rounded-xl text-white shadow-lg">
               <h3 className="font-bold text-lg mb-2">预约下期直播</h3>
               <p className="text-sm text-blue-200 mb-4">专题：如何利用知识图谱解决冷连轧断带问题</p>
               <button className="w-full bg-white text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                  立即预约
               </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;