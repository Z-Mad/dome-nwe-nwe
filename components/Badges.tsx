import React from 'react';
import { Clock, AlertTriangle, Archive, Zap } from 'lucide-react';

export const StatusBadge = ({ status, expireDate }: { status: string; expireDate?: string }) => {
  const isExpiringSoon =
    expireDate &&
    new Date(expireDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 &&
    new Date(expireDate).getTime() > new Date().getTime();

  if (status === 'Active' || status === 'Running') {
    if (isExpiringSoon) {
      return (
        <span className="bg-red-50 text-red-600 border border-red-100 text-xs px-2 py-1 rounded flex items-center gap-1 w-fit font-medium">
          <Clock size={12} /> 3天后到期
        </span>
      );
    }
    return (
      <span className="bg-green-50 text-green-600 border border-green-200 text-xs px-2 py-1 rounded w-fit font-medium">
        使用中
      </span>
    );
  }
  if (status === 'PendingActivation') {
    return (
      <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs px-2 py-1 rounded w-fit font-medium flex items-center gap-1">
        <Zap size={12} /> 待激活
      </span>
    );
  }
  if (status === 'Trial') {
    const daysLeft = expireDate
      ? Math.ceil(
          (new Date(expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;
    return (
      <span className="bg-blue-50 text-blue-600 border border-blue-100 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium w-fit">
        <Clock size={12} /> 试用中 (剩{daysLeft}天)
      </span>
    );
  }
  if (status === 'TRIAL_SUSPENDED') {
    return (
      <span className="bg-red-50 text-red-600 border border-red-100 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium w-fit">
        <AlertTriangle size={12} /> 试用暂停
      </span>
    );
  }
  if (status === 'GRACE_PERIOD') {
    return (
      <span className="bg-orange-50 text-orange-600 border border-orange-100 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium w-fit">
        <Clock size={12} /> 数据保留期 (7天)
      </span>
    );
  }
  if (status === 'ARCHIVED') {
    return (
      <span className="bg-gray-100 text-gray-500 border border-gray-200 text-xs px-2 py-1 rounded flex items-center gap-1 font-medium w-fit">
        <Archive size={12} /> 已归档
      </span>
    );
  }
  if (status === 'Expired') {
    return (
      <span className="bg-gray-100 text-gray-500 border border-gray-200 text-xs px-2 py-1 rounded w-fit font-medium">
        已过期
      </span>
    );
  }
  if (status === 'PaymentFailed') {
    return (
      <span className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-1 rounded w-fit font-medium flex items-center gap-1">
        <AlertTriangle size={12} /> 支付失败
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="bg-orange-50 text-orange-600 border border-orange-200 text-xs px-2 py-1 rounded w-fit font-medium flex items-center gap-1">
        <Clock size={12} /> 待线下支付
      </span>
    );
  }
  if (status === 'UnderReview') {
    return (
      <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs px-2 py-1 rounded w-fit font-medium flex items-center gap-1">
        <Clock size={12} /> 审核中
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-1 rounded w-fit font-medium flex items-center gap-1">
        <AlertTriangle size={12} /> 已驳回
      </span>
    );
  }
  return (
    <span className="bg-gray-50 text-gray-500 border border-gray-200 text-xs px-2 py-1 rounded w-fit font-medium">
      {status}
    </span>
  );
};

export const PaymentStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'PendingPayment':
      return <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 text-xs px-2 py-1 rounded w-fit font-medium">待支付</span>;
    case 'UnderReview':
      return <span className="bg-blue-50 text-blue-600 border border-blue-200 text-xs px-2 py-1 rounded w-fit font-medium">审核中</span>;
    case 'Rejected':
      return <span className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-1 rounded w-fit font-medium">已驳回</span>;
    case 'Paid':
      return <span className="bg-green-50 text-green-600 border border-green-200 text-xs px-2 py-1 rounded w-fit font-medium">已支付</span>;
    case 'PaymentFailed':
      return <span className="bg-red-50 text-red-600 border border-red-200 text-xs px-2 py-1 rounded w-fit font-medium">支付失败</span>;
    case 'Cancelled':
      return <span className="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded w-fit font-medium">已取消</span>;
    default:
      return <span className="bg-gray-50 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded w-fit font-medium">{status}</span>;
  }
};