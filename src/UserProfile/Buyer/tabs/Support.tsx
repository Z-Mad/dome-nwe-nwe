import React, { useState } from "react";
import { Headphones, MessageSquare as MessageIcon, HelpCircle, ChevronRight, Loader2 } from "lucide-react";
import { useUserProfile } from "../../Core/UserProfileContext";
import { SUPPORT_TICKETS, FAQ_ITEMS } from "../constants";
import { chatService } from "../../../../services/chat";

const BuyerSupport: React.FC = () => {
  const { openModal, onNavigate, showToast } = useUserProfile();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const contactConsultant = async () => {
    try {
      setIsCreatingSession(true);
      const res = await chatService.createSession(6227);
      if (res.success && res.data) {
        onNavigate("messages", { conversationId: String(res.data.sessionId) });
      } else {
        showToast(res.msg || "发起会话失败");
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      showToast("发起会话异常，请稍后重试");
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Row: Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Implementation Center Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Headphones size={20} className="text-blue-600" /> 维观实施中心
            (Implementation Center)
          </h3>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="https://picsum.photos/seed/manager_james/200/200"
                  alt="James"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">
                张大伟 (James)
              </h4>
              <div className="text-xs text-gray-500 mb-1">
                大客户经理 · 宝信软件
              </div>
              <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>{" "}
                在线
              </div>
            </div>
            <button
              onClick={contactConsultant}
              disabled={isCreatingSession}
              className="ml-auto bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isCreatingSession ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  发起中...
                </>
              ) : (
                "发起会话"
              )}
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">服务热线</span>
              <span className="font-bold text-gray-900 font-mono">
                400-820-8820
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">技术支持邮箱</span>
              <span className="font-bold text-gray-900 font-mono">
                support@baosight.com
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Center Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageIcon size={20} className="text-orange-500" /> 工单中心
            </h3>
            <button
              onClick={() => openModal("create_ticket")}
              className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-colors"
            >
              新建工单
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {SUPPORT_TICKETS.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => openModal("ticket_detail", { ticketId: ticket.id })}
                className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800 text-sm">
                    {ticket.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${
                      ticket.status === "processing"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ticket.status === "processing" ? "处理中" : "已关闭"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>{ticket.id}</span>
                  <span>{ticket.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle size={20} className="text-purple-600" /> 常见问题
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors cursor-pointer flex justify-between items-center group"
            >
              <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                {item}
              </span>
              <ChevronRight
                size={16}
                className="text-gray-300 group-hover:text-blue-400"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerSupport;