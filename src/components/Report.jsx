import React, { useState } from 'react'
import { FileText, Download, Printer, Share2, Building2, Calendar, Leaf } from 'lucide-react'
import { carbonPriceRef, calculateCarbonCost } from '../data/carbonData'

function Report({ emissionsData, companyData }) {
  const { scope1, scope2 } = emissionsData
  const total = scope1 + scope2
  const [quota, setQuota] = useState(10000) // 碳配额
  const carbonInfo = calculateCarbonCost(total, quota)

  const generatePDF = () => {
    const reportContent = `
${companyData.name || '某企业'} ${companyData.year || new Date().getFullYear()}年度碳排放报告
================================================================

一、基本信息
----------------------------------------------------------------
企业名称：${companyData.name || '未填写'}
所属行业：${companyData.industry || '未填写'}
报告年度：${companyData.year || new Date().getFullYear()}
报告日期：${new Date().toLocaleDateString('zh-CN')}

二、碳排放数据
----------------------------------------------------------------
Scope 1 (直接排放)：${scope1.toFixed(2)} tCO2
  - 固定燃烧源排放
  - 移动源排放
  - 过程排放

Scope 2 (间接排放)：${scope2.toFixed(2)} tCO2
  - 外购电力

碳排放总量：${total.toFixed(2)} tCO2

三、碳配额分析
----------------------------------------------------------------
碳配额：${quota} tCO2
实际排放：${total.toFixed(2)} tCO2
超出配额：${carbonInfo.excessEmissions.toFixed(2)} tCO2
碳市场价格：${carbonInfo.price} 元/tCO2
碳成本：${carbonInfo.carbonCost} 元

四、计算依据
----------------------------------------------------------------
本报告碳排放因子采用以下标准：
- IPCC 第六次评估报告 (AR6)
- 中国生态环境部 2023 年度排放因子
- ISO 14064-1:2018 标准

================================================================
报告生成时间：${new Date().toLocaleString('zh-CN')}
报告编号：CM-${Date.now().toString().slice(-8)}
```

    // 创建下载
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${companyData.name || '企业'}_碳排放报告_${companyData.year || new Date().getFullYear()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 报告预览 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* 报告头部 */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{companyData.name || '某企业'} 碳排放报告</h2>
              <p className="text-green-100">{companyData.year || new Date().getFullYear()} 年度</p>
            </div>
          </div>
        </div>

        {/* 报告内容 */}
        <div className="p-8 space-y-8">
          {/* 基本信息 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-500" />
              基本信息
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">企业名称</p>
                <p className="font-medium text-gray-900 dark:text-white">{companyData.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">所属行业</p>
                <p className="font-medium text-gray-900 dark:text-white">{companyData.industry || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">报告年度</p>
                <p className="font-medium text-gray-900 dark:text-white">{companyData.year || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">报告日期</p>
                <p className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString('zh-CN')}</p>
              </div>
            </div>
          </div>

          {/* 碳排放数据 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              碳排放数据
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 border border-red-100 dark:border-red-900">
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">Scope 1 直接排放</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{scope1.toFixed(2)}</p>
                <p className="text-xs text-red-500 mt-1">tCO2 (占比 {(scope1 / total * 100 || 0).toFixed(1)}%)</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-5 border border-orange-100 dark:border-orange-900">
                <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Scope 2 间接排放</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{scope2.toFixed(2)}</p>
                <p className="text-xs text-orange-500 mt-1">tCO2 (占比 {(scope2 / total * 100 || 0).toFixed(1)}%)</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-100 dark:border-green-900">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">碳排放总量</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{total.toFixed(2)}</p>
                <p className="text-xs text-green-500 mt-1">tCO2</p>
              </div>
            </div>
          </div>

          {/* 碳配额分析 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              碳配额分析
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-2">设置企业碳配额 (tCO2)</label>
                  <input
                    type="number"
                    value={quota}
                    onChange={(e) => setQuota(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500">碳配额</p>
                  <p className="font-bold text-gray-900 dark:text-white">{quota.toLocaleString()} tCO2</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500">实际排放</p>
                  <p className="font-bold text-gray-900 dark:text-white">{total.toFixed(2)} tCO2</p>
                </div>
                <div className={`text-center p-3 rounded-lg ${carbonInfo.excessEmissions > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className="text-xs text-gray-500">超出配额</p>
                  <p className={`font-bold ${carbonInfo.excessEmissions > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {carbonInfo.excessEmissions.toFixed(2)} tCO2
                  </p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500">碳成本</p>
                  <p className="font-bold text-gray-900 dark:text-white">¥{parseFloat(carbonInfo.carbonCost).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 计算依据 */}
          <div className="text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
            <p>计算依据：IPCC 第六次评估报告 (AR6) / 中国生态环境部 2023 年度排放因子 / ISO 14064-1:2018</p>
            <p className="mt-1">报告编号：CM-{Date.now().toString().slice(-8)}</p>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={generatePDF}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-5 h-5" />
          下载报告
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-5 h-5" />
          打印报告
        </button>
      </div>
    </div>
  )
}

export default Report
