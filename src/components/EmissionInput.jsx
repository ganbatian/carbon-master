import React, { useState } from 'react'
import { Calculator, Save, Plus, Trash2 } from 'lucide-react'
import { emissionFactors } from '../data/carbonData'

function EmissionInput({ setEmissionsData, companyData, setCompanyData }) {
  const [activeScope, setActiveScope] = useState('scope1')
  const [inputs, setInputs] = useState({
    // Scope 1
    stationary: [], // 固定燃烧
    mobile: [],     // 移动源
    process: [],    // 过程排放
    // Scope 2
    electricity: { region: '全国平均', consumption: 0 },
  })

  const addInput = (type) => {
    const newInput = { id: Date.now(), fuelType: '天然气', consumption: 0 }
    setInputs(prev => ({
      ...prev,
      [type]: [...prev[type], newInput]
    }))
  }

  const removeInput = (type, id) => {
    setInputs(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }))
  }

  const updateInput = (type, id, field, value) => {
    setInputs(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }

  const calculate = () => {
    // Scope 1 计算
    let scope1Total = 0
    
    inputs.stationary.forEach(item => {
      const factor = emissionFactors.fuels[item.fuelType]?.factor || 0
      scope1Total += item.consumption * factor / 1000
    })
    
    inputs.mobile.forEach(item => {
      const factor = emissionFactors.mobileCombustion[item.fuelType] || 0
      scope1Total += item.consumption * factor / 1000
    })
    
    inputs.process.forEach(item => {
      scope1Total += item.consumption * item.rate / 1000
    })

    // Scope 2 计算
    const factor = emissionFactors.electricity[inputs.electricity.region] || 0.57
    const scope2Total = inputs.electricity.consumption * factor / 1000

    // 生成历史数据
    const history = ['1月', '2月', '3月', '4月', '5月', '6月'].map((month, i) => {
      const variance = Math.random() * 0.2 - 0.1
      return {
        month,
        scope1: Math.round(scope1Total * (1 + variance)),
        scope2: Math.round(scope2Total * (1 + variance)),
      }
    })

    setEmissionsData({
      scope1: scope1Total,
      scope2: scope2Total,
      history,
    })
    
    alert('碳排放计算完成！')
  }

  const scope1Tabs = [
    { id: 'stationary', label: '固定燃烧' },
    { id: 'mobile', label: '移动源' },
    { id: 'process', label: '过程排放' },
  ]

  return (
    <div className="space-y-6">
      {/* 企业信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-green-500" />
          企业信息
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">企业名称</label>
            <input
              type="text"
              value={companyData.name}
              onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">所属行业</label>
            <select
              value={companyData.industry}
              onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="">请选择</option>
              <option value="电力">电力</option>
              <option value="钢铁">钢铁</option>
              <option value="水泥">水泥</option>
              <option value="化工">化工</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">报告年度</label>
            <input
              type="number"
              value={companyData.year}
              onChange={(e) => setCompanyData({...companyData, year: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Scope 1 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scope 1 直接排放
          </h2>
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm">
            固定燃烧 + 移动源 + 过程排放
          </div>
        </div>

        {/* 子分类标签 */}
        <div className="flex gap-2 mb-4">
          {scope1Tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveScope(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeScope === tab.id
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 输入项 */}
        {activeScope === 'stationary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">固定燃烧源排放</p>
              <button
                onClick={() => addInput('stationary')}
                className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                <Plus className="w-4 h-4" /> 添加
              </button>
            </div>
            {inputs.stationary.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">暂无数据，点击添加</p>
            )}
            {inputs.stationary.map(item => (
              <div key={item.id} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">燃料类型</label>
                  <select
                    value={item.fuelType}
                    onChange={(e) => updateInput('stationary', item.id, 'fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  >
                    {Object.keys(emissionFactors.fuels).map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">消耗量</label>
                  <input
                    type="number"
                    value={item.consumption}
                    onChange={(e) => updateInput('stationary', item.id, 'consumption', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                  />
                </div>
                <button onClick={() => removeInput('stationary', item.id)} className="p-2 text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeScope === 'mobile' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">公司车辆移动源排放</p>
              <button onClick={() => addInput('mobile')} className="flex items-center gap-1 text-sm text-green-600">
                <Plus className="w-4 h-4" /> 添加
              </button>
            </div>
            {inputs.mobile.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">暂无数据，点击添加</p>
            )}
            {inputs.mobile.map(item => (
              <div key={item.id} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">燃料类型</label>
                  <select
                    value={item.fuelType}
                    onChange={(e) => updateInput('mobile', item.id, 'fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {Object.keys(emissionFactors.mobileCombustion).map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">消耗量 (L)</label>
                  <input
                    type="number"
                    value={item.consumption}
                    onChange={(e) => updateInput('mobile', item.id, 'consumption', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <button onClick={() => removeInput('mobile', item.id)} className="p-2 text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeScope === 'process' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">工业过程排放</p>
              <button onClick={() => addInput('process')} className="flex items-center gap-1 text-sm text-green-600">
                <Plus className="w-4 h-4" /> 添加
              </button>
            </div>
            {inputs.process.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">暂无数据，点击添加</p>
            )}
            {inputs.process.map(item => (
              <div key={item.id} className="flex gap-4 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">排放环节</label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => updateInput('process', item.id, 'name', e.target.value)}
                    placeholder="如：水泥烧制"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">排放因子</label>
                  <input
                    type="number"
                    value={item.rate || 0}
                    onChange={(e) => updateInput('process', item.id, 'rate', parseFloat(e.target.value) || 0)}
                    placeholder="kg/t"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">产量 (t)</label>
                  <input
                    type="number"
                    value={item.consumption}
                    onChange={(e) => updateInput('process', item.id, 'consumption', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <button onClick={() => removeInput('process', item.id)} className="p-2 text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scope 2 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scope 2 间接排放
          </h2>
          <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-sm">
            外购电力
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">电网区域</label>
            <select
              value={inputs.electricity.region}
              onChange={(e) => setInputs(prev => ({
                ...prev,
                electricity: { ...prev.electricity, region: e.target.value }
              }))}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            >
              {Object.keys(emissionFactors.electricity).map(region => (
                <option key={region} value={region}>
                  {region} ({emissionFactors.electricity[region]} kgCO2/kWh)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">月均用电量 (kWh)</label>
            <input
              type="number"
              value={inputs.electricity.consumption}
              onChange={(e) => setInputs(prev => ({
                ...prev,
                electricity: { ...prev.electricity, consumption: parseFloat(e.target.value) || 0 }
              }))}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
        </div>
      </div>

      {/* 计算按钮 */}
      <button
        onClick={calculate}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Calculator className="w-5 h-5" />
        计算碳排放量
      </button>
    </div>
  )
}

export default EmissionInput
