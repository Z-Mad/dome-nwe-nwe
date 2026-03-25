import React, { useState, useEffect } from 'react';
import { 
  X, Download, FileText, Settings, Plus, CreditCard, Wallet, Building, 
  Upload, ShieldCheck, Activity, AlertCircle, Edit3, Terminal, TrendingUp, 
  CheckCircle, Loader2, Scale, Box, Receipt, Scan
} from 'lucide-react';


export const EditAssetModal = ({ selectedItem, closeModal, showToast, localOrders, setLocalOrders, setMonitoringData, processSuccessfulPayment, setActiveModal, setBills, onNavigate, setPreviewImageUrl, selectedVersion, handleVersionAction, handleSaveAssetInfo, handleTakedownAsset, handleSellerRefundAudit, openModal, handleSimulatePayment }: any) => {
    const [editAssetForm, setEditAssetForm] = useState({ title: "", desc: "", tags: "" });
  const [isLoading, setIsLoading] = useState(false);

  return  (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
          <Edit3 size={20} className="text-blue-600" /> 编辑资产信息
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              资产名称 (Title)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              value={editAssetForm.title}
              onChange={(e) =>
                setEditAssetForm({ ...editAssetForm, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              分类 (Category)
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            >
              <option>
                {selectedItem?.category === "method"
                  ? "方法智能体"
                  : "分析智能体"}
              </option>
            </select>
            <p className="text-[10px] text-gray-400 mt-1">
              分类一旦创建不可修改，如需变更请重新发布。
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              简介 (Description)
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 focus:border-blue-500 outline-none resize-none"
              value={editAssetForm.desc}
              onChange={(e) =>
                setEditAssetForm({ ...editAssetForm, desc: e.target.value })
              }
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              标签 (Tags)
            </label>
            <input
              type="text"
              placeholder="输入标签，用逗号分隔..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              value={editAssetForm.tags}
              onChange={(e) =>
                setEditAssetForm({ ...editAssetForm, tags: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSaveAssetInfo}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 shadow-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "保存修改"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditAssetModal;
