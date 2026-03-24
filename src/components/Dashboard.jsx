import React from 'react'
import { Building2, Leaf, AlertTriangle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'

function Dashboard({ emissionsData, companyData, setCompanyData }) {
  const { scope1, scope2, history } = emissionsData
  const total = scope1 + scope2
  
  // 计算环比
  const currentMonth = history[history.length - 1]
  const lastMonth = history[history.length - 2]
  const changeRate = lastMonth 
    ? ((currentMonth.scope1 + currentMonth.scope2) - (lastMonth.scope1 + lastMonth.scope2)) / (lastMonth.scope1 + lastMonth.scope2) * 100 
    : 0

  const stats = [
    { 
      label: 'Scope 1 直接排放', 
      value: `${scope1.toFixed(1)} tCO2`,
      subtext: '固定燃烧 + 移动源',
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    { 
      label: 'Scope 2 间接排放', 
      value: `${scope2.toFixed(1)} tCO2`,
      subtext: '外购电力',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    { 
      label: '碳排放总量', 
      value: `${total.toFixed(1)} tCO2`,
      subtext: '当月合计',
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      label: '碳排放强度', 
      value: total > 0 ? `${(total / 1000 * 1000).toFixed(2)}` : '0.00',
      subtext: 'tCO2/万元产值',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
  ]

  return (
    <div className="space-y-6">
      {/* 企业信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-green-500" />
          企业信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">企业名称</label>
            <input
              type="text"
              value={companyData.name}
              onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
              placeholder="请输入企业名称"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">所属行业</label>
            <select
              value={companyData.industry}
              onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">请选择行业</option>
              <option value="电力">电力</option>
              <option value="钢铁">钢铁</option>
              <option value="水泥">水泥</option>
              <option value="化工">化工</option>
              <option value="有色金属">有色金属</option>
              <option value="造纸">造纸</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">报告年度</label>
            <input
              type="number"
              value={companyData.year}
              onChange={(e) => setCompanyData({...companyData, year: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <Leaf className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* 趋势提示 */}
      <div className={`rounded-xl p-5 ${changeRate > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
        <div className="flex items-center gap-3">
          {changeRate > 0 ? (
            <ArrowUp className="w-6 h-6 text-red-500" />
          ) : (
            <ArrowDown className="w-6 h-6 text-green-500" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              环比 {changeRate > 0 ? '增长' : '下降'} {Math.abs(changeRate).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              相比上月碳排放量变化
            </p>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-colors text-center">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">查看趋势</span>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-colors text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">碳配额预警</span>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-colors text-center">
            <Leaf className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">减排建议</span>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-colors text-center">
            <Building2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">同行对比</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
