const fs = require('fs')
const content = fs.readFileSync('components/UserProfile.tsx', 'utf-8')

const startRev = content.indexOf('const renderSellerRevenue = () => {')
const endRev = content.indexOf('const renderSellerAnalysis = () => (')

if (startRev !== -1 && endRev !== -1) {
  const newFinance = `  const renderSellerFinance = () => {
    const maxRev = Math.max(...SELLER_REVENUE_CHART_DATA.map((d) => d.value)) * 1.1;
    const underReviewItems = monitoringData.filter((item) => item.status === "under_review");
    const pendingInvoices = localOrders.filter((item) => item.invoiceStatus === "Pending");
    const pendingRefunds = sellerRefunds;

    return (
      <div className="space-y-8 animate-in fade-in pb-10">
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-gray-100">
          {["overview", "monitoring", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSellerFinanceSubTab(tab as any)}
              className={\`pb-4 text-sm font-bold relative transition-colors \${
                sellerFinanceSubTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }\`}
            >
              {tab === "overview" ? "综合看板" : tab === "monitoring" ? "资产与订单监控" : "财务流水明细"}
              {sellerFinanceSubTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {sellerFinanceSubTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* 1. Header Cards */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg shadow-blue-200 lg:w-1/3 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">本月已收款 (RECEIVED)</div>
                  <div className="text-4xl font-bold mb-8">{SELLER_STATS.revenue}</div>
                </div>
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-blue-500 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute right-4 top-4 text-blue-400 opacity-20"><CreditCard size={100} /></div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:w-1/3 flex flex-col justify-between">
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">待买家付款 (PENDING)</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{SELLER_STATS.pending}</div>
                  <div className="text-xs text-gray-400">包含已出账单及待核销款项</div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:w-1/3 flex flex-col justify-between">
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">累计已收款 (TOTAL)</div>
                  <div className="text-4xl font-bold text-gray-900 mb-4">{SELLER_STATS.total}</div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-2/3 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Action Center (待办中心) */}
            {(underReviewItems.length > 0 || pendingInvoices.length > 0 || pendingRefunds.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BellRing size={20} className="text-orange-500" /> 待办中心
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Financial Audit */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-indigo-50/50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
                      <div className="font-bold text-indigo-900 flex items-center gap-2">
                        <Receipt size={16} className="text-indigo-600" /> 财务审核
                      </div>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">{underReviewItems.length}</span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
                      {underReviewItems.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-4">暂无待审核项</div>
                      ) : (
                        underReviewItems.map(item => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-900">{item.buyer}</span>
                              <span className="font-mono text-indigo-600 font-bold">¥{item.estimatedCost.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{item.orderId}</div>
                            <button onClick={() => openModal("confirm_payment", item)} className="w-full py-1.5 bg-indigo-600 text-white rounded-md text-xs font-bold hover:bg-indigo-700 transition-colors">
                              审核收款
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Invoice Management */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
                      <div className="font-bold text-orange-900 flex items-center gap-2">
                        <FileText size={16} className="text-orange-600" /> 发票开具
                      </div>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingInvoices.length}</span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
                      {pendingInvoices.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-4">暂无待开票项</div>
                      ) : (
                        pendingInvoices.map(item => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-900">{item.provider}</span>
                              <span className="font-mono text-orange-600 font-bold">¥{item.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{item.id}</div>
                            <button onClick={() => {
                                showToast("发票已开具并发送至买家邮箱");
                                setLocalOrders((prev) =>
                                  prev.map((o) =>
                                    o.id === item.id ? { ...o, invoiceStatus: "Issued" } : o
                                  )
                                );
                              }} className="w-full py-1.5 bg-orange-600 text-white rounded-md text-xs font-bold hover:bg-orange-700 transition-colors">
                              开具发票
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Refund Audit */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-red-50/50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
                      <div className="font-bold text-red-900 flex items-center gap-2">
                        <RefreshCw size={16} className="text-red-600" /> 退款处理
                      </div>
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{pendingRefunds.length}</span>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
                      {pendingRefunds.length === 0 ? (
                        <div className="text-gray-400 text-sm text-center py-4">暂无待退款项</div>
                      ) : (
                        pendingRefunds.map(refund => (
                          <div key={refund.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-sm">
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-gray-900">{refund.buyer}</span>
                              <span className="font-mono text-red-600 font-bold">¥{refund.amount.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-3">{refund.orderId}</div>
                            <button onClick={() => openModal("seller_refund_audit", refund)} className="w-full py-1.5 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors">
                              审核处理
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CHART */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-8 pl-2">
                <h3 className="font-bold text-gray-800">近12个月收款趋势</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> 总收款</span>
                  <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-200"></div> 平均值</span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 relative px-4">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[1, 2, 3, 4].map((l) => (<div key={l} className="border-t border-dashed border-gray-100 w-full h-0"></div>))}
                </div>
                {SELLER_REVENUE_CHART_DATA.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full gap-2 group cursor-pointer relative z-10">
                    <div className="w-full bg-green-400 rounded-t-sm hover:bg-green-500 transition-all relative" style={{ height: \`\${(d.value / maxRev) * 100}%\` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        ¥{d.value.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 text-center">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MONITORING TAB */}
        {sellerFinanceSubTab === "monitoring" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">资产与订单监控</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" placeholder="搜索客户名称或资产..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Filter size={16} /> 筛选
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">客户与订单</th>
                    <th className="px-6 py-4 font-medium">资产与实例</th>
                    <th className="px-6 py-4 font-medium">计费规则</th>
                    <th className="px-6 py-4 font-medium">用量与明细</th>
                    <th className="px-6 py-4 font-medium">费用合计</th>
                    <th className="px-6 py-4 font-medium">状态</th>
                    <th className="px-6 py-4 font-medium text-right sticky right-0 bg-gray-50 z-10">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monitoringData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.buyer}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{item.orderId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{item.asset} <span className="text-gray-500 font-normal text-xs">({item.version})</span></div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded">{item.instanceName}</span>
                          <span className="font-mono">{item.instanceId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{item.plan}</span>
                          <span className="text-gray-500 text-xs">{item.period}</span>
                        </div>
                        <div className="text-xs text-gray-500">{item.unitPrice}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between gap-4">
                            <span>Token: <span className="font-mono text-gray-900">{item.usage.tokens}</span></span>
                            <span className="font-mono text-gray-900">¥ {item.feeBreakdown.tokens.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span>存储: <span className="font-mono text-gray-900">{item.usage.storage}</span></span>
                            <span className="font-mono text-gray-900">¥ {item.feeBreakdown.storage.toFixed(2)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600 text-base">¥ {item.estimatedCost.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {item.status === "unbilled" && <span className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-medium border border-orange-100">待请款</span>}
                        {item.status === "pending_payment" && <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100">待支付</span>}
                        {item.status === "under_review" && <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-medium border border-purple-100">待确认收款</span>}
                        {item.status === "paid" && <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100">已支付</span>}
                        {item.status === "running" && <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-100">正常运行中</span>}
                      </td>
                      <td className="px-6 py-4 text-right sticky right-0 bg-white group-hover:bg-gray-50/50 transition-colors z-10">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => {
                            const order = localOrders.find(o => o.id === item.orderId);
                            if (order) openModal("order_detail", order);
                            else showToast("未找到关联订单详情");
                          }} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm">
                            <FileText size={14} /> 详情
                          </button>
                          {item.plan === "按量计费" ? (
                            item.status === "unbilled" ? (
                              <button onClick={() => openModal("generate_invoice", item)} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-sm">
                                <FileText size={14} /> 生成请款单
                              </button>
                            ) : item.status === "pending_payment" ? (
                              <button disabled className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-400 cursor-not-allowed bg-gray-50">
                                <Clock size={14} /> 待买家支付
                              </button>
                            ) : item.status === "under_review" ? (
                              <button onClick={() => openModal("confirm_payment", item)} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm">
                                <CheckCircle size={14} /> 确认收款
                              </button>
                            ) : (
                              <button disabled className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-400 cursor-not-allowed bg-gray-50">
                                <CheckCircle size={14} /> 已支付
                              </button>
                            )
                          ) : item.status === "under_review" ? (
                            <button onClick={() => openModal("confirm_payment", item)} className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm">
                              <CheckCircle size={14} /> 确认收款
                            </button>
                          ) : item.status === "pending_payment" ? (
                            <button disabled className="text-sm font-medium flex items-center gap-1.5 justify-center px-3 py-1.5 rounded-lg transition-colors text-gray-400 cursor-not-allowed bg-gray-50">
                              <Clock size={14} /> 待买家支付
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 flex items-center justify-end gap-1 px-3 py-1.5">无需请款</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {sellerFinanceSubTab === "transactions" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">财务流水明细</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 font-bold bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">流水号</th>
                    <th className="px-4 py-3">类型</th>
                    <th className="px-4 py-3">关联订单/资产</th>
                    <th className="px-4 py-3 text-right">金额</th>
                    <th className="px-4 py-3 text-center">状态</th>
                    <th className="px-4 py-3 text-right">时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {SELLER_TRANSACTIONS.map((trx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-mono text-gray-500">{trx.id}</td>
                      <td className="px-4 py-4">
                        <span className={\`text-xs px-2 py-1 rounded \${trx.type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}\`}>
                          {trx.type === "income" ? "收款" : "退款"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-800">{trx.asset}</div>
                        <div className="text-xs text-gray-400">Buyer: {trx.buyer}</div>
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-green-600">+{trx.amount.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={\`text-[10px] px-2 py-0.5 rounded border \${trx.status === "settled" ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-100 text-gray-500 border-gray-200"}\`}>
                          {trx.status === "settled" ? "已核销" : "待核销"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-400 text-xs">{trx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };
`
  const newContent = content.substring(0, startRev) + newFinance + '\n' + content.substring(endRev)
  fs.writeFileSync('components/UserProfile.tsx', newContent)
  console.log('Successfully replaced renderSellerRevenue with renderSellerFinance')
} else {
  console.log('Could not find start or end markers')
}
