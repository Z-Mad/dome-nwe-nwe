import React, { useState } from 'react';
import { 
  X, Download, FileText, Settings, Plus, CreditCard, Wallet, Building, 
  Upload, ShieldCheck, Activity, AlertCircle, Edit3, Terminal, TrendingUp, 
  CheckCircle, Loader2, Scale, Box, Receipt, Scan
} from 'lucide-react';

export default function InvoiceHeaderModal(props: any) {
  const {
    selectedItem, closeModal, showToast, isLoading, setIsLoading, 
    handleSimulatePayment, invoiceHeaders, showInvoiceHeaderForm, 
    setShowInvoiceHeaderForm, editingInvoiceHeader, setEditingInvoiceHeader, 
    setInvoiceHeaders, paymentMethod, setPaymentMethod, setBills, 
    receiptForm, setReceiptForm, setLocalOrders, setMonitoringData, 
    invoiceForm, setInvoiceForm, selectedHeaderId, setSelectedHeaderId, 
    openModal, setInvoices, refundReason, setRefundReason, refundReasonTag, 
    setRefundReasonTag, handleTakedownAsset, editAssetForm, setEditAssetForm, 
    handleSaveAssetInfo, selectedVersion, handleVersionAction, onUpgrade, 
    previewImageUrl, setActiveModal, invoiceStartDate, invoiceEndDate, 
    dateError, isQueryingUsage, localOrders, processSuccessfulPayment,
    auditComment, setAuditComment, handleSellerRefundAudit
  } = props;


    if (showInvoiceHeaderForm && editingInvoiceHeader) {
      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Settings size={18} className="text-blue-600" /> {editingInvoiceHeader.id ? '编辑发票抬头' : '新增发票抬头'}
              </h3>
              <button onClick={() => setShowInvoiceHeaderForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发票类型</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={editingInvoiceHeader.type === "enterprise"} onChange={() => setEditingInvoiceHeader({ ...editingInvoiceHeader, type: "enterprise" })} className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">增值税普通发票</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={editingInvoiceHeader.type === "special"} onChange={() => setEditingInvoiceHeader({ ...editingInvoiceHeader, type: "special" })} className="text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">增值税专用发票</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发票抬头 <span className="text-red-500">*</span></label>
                <input type="text" value={editingInvoiceHeader.title} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入企业全称" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">纳税人识别号 <span className="text-red-500">*</span></label>
                <input type="text" value={editingInvoiceHeader.taxId} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, taxId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入18位统一社会信用代码" />
              </div>
              {editingInvoiceHeader.type === "special" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">注册地址及电话 <span className="text-red-500">*</span></label>
                    <input type="text" value={editingInvoiceHeader.address || ''} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入注册地址及电话" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">开户行及账号 <span className="text-red-500">*</span></label>
                    <input type="text" value={editingInvoiceHeader.bank || ''} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, bank: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="请输入开户行及账号" />
                  </div>
                </>
              )}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editingInvoiceHeader.isDefault} onChange={(e) => setEditingInvoiceHeader({ ...editingInvoiceHeader, isDefault: e.target.checked })} className="text-blue-600 focus:ring-blue-500 rounded" />
                  <span className="text-sm font-medium text-gray-700">设为默认发票抬头</span>
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowInvoiceHeaderForm(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors">取消</button>
              <button onClick={() => {
                if (!editingInvoiceHeader.title || !editingInvoiceHeader.taxId) {
                  showToast("请填写必填项");
                  return;
                }
                let newHeaders = [...invoiceHeaders];
                if (editingInvoiceHeader.isDefault) {
                  newHeaders = newHeaders.map(h => ({ ...h, isDefault: false }));
                }
                if (editingInvoiceHeader.id) {
                  setInvoiceHeaders(newHeaders.map(h => h.id === editingInvoiceHeader.id ? editingInvoiceHeader : h));
                  showToast("修改成功");
                } else {
                  setInvoiceHeaders([...newHeaders, { ...editingInvoiceHeader, id: `h${Date.now()}` }]);
                  showToast("新增成功");
                }
                setShowInvoiceHeaderForm(false);
              }} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">保存</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Settings size={18} className="text-blue-600" /> 发票抬头管理
            </h3>
            <button onClick={() => { closeModal(); setShowInvoiceHeaderForm(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {invoiceHeaders.map(header => (
              <div key={header.id} className="border border-gray-200 rounded-xl p-4 relative hover:border-blue-300 transition-colors">
                {header.isDefault && <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">默认</span>}
                <div className="font-bold text-gray-900 mb-2 pr-12">{header.title}</div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><span className="text-gray-400">税号：</span>{header.taxId}</div>
                  <div><span className="text-gray-400">类型：</span>{header.type === 'special' ? '增值税专用发票' : '增值税普通发票'}</div>
                  <div className="col-span-2"><span className="text-gray-400">开户行及账号：</span>{header.bank || '-'}</div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => { setEditingInvoiceHeader(header); setShowInvoiceHeaderForm(true); }} className="text-blue-600 text-sm font-medium hover:text-blue-800">编辑</button>
                  <button onClick={() => {
                    setInvoiceHeaders(prev => prev.filter(h => h.id !== header.id));
                    showToast("删除成功");
                  }} className="text-red-600 text-sm font-medium hover:text-red-800">删除</button>
                </div>
              </div>
            ))}
            <button onClick={() => {
              setEditingInvoiceHeader({ id: '', type: 'enterprise', title: '', taxId: '', address: '', bank: '', isDefault: false });
              setShowInvoiceHeaderForm(true);
            }} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> 新增发票抬头
            </button>
          </div>
        </div>
      </div>
    );
  
}
