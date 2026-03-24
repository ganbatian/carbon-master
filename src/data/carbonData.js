// 碳排放因子数据 (来源: IPCC / 中国生态环境部)
export const emissionFactors = {
  // 电力排放因子 (kg CO2/kWh) - 华北电网2023
  electricity: {
    '华北': 0.884,
    '东北': 0.776,
    '华东': 0.732,
    '华中': 0.527,
    '西北': 0.667,
    '南方': 0.528,
    '全国平均': 0.570,
  },
  
  // 化石燃料燃烧排放因子
  fuels: {
    '天然气': { factor: 2.162, unit: 'kg CO2/m³' },  // m³
    '液化石油气': { factor: 3.106, unit: 'kg CO2/kg' },
    '柴油': { factor: 3.096, unit: 'kg CO2/L' },
    '汽油': { factor: 2.925, unit: 'kg CO2/L' },
    '煤炭': { factor: 2.660, unit: 'kg CO2/kg' },
    '重油': { factor: 3.120, unit: 'kg CO2/kg' },
  },
  
  // 移动燃烧源 (kg CO2/L)
  mobileCombustion: {
    '汽油': 2.925,
    '柴油': 3.096,
    '天然气': 2.162,
  },
}

// 计算碳排放量
export const calculateEmissions = {
  // Scope 1: 直接排放
  scope1: {
    // 固定燃烧 (天然气、煤炭等)
    stationaryCombustion: (fuelType, consumption, region) => {
      const factor = emissionFactors.fuels[fuelType]?.factor || 0
      return consumption * factor / 1000 // 转换为 tCO2
    },
    
    // 移动燃烧 (公司车辆)
    mobileCombustion: (fuelType, consumption) => {
      const factor = emissionFactors.mobileCombustion[fuelType] || 0
      return consumption * factor / 1000
    },
    
    // 过程排放 (如水泥生产)
    processEmissions: (emissionRate, quantity) => {
      return emissionRate * quantity / 1000
    },
  },
  
  // Scope 2: 间接排放 (电力)
  scope2: {
    electricity: (consumption, region) => {
      const factor = emissionFactors.electricity[region] || emissionFactors.electricity['全国平均']
      return (consumption * factor) / 1000 // kWh -> tCO2
    },
  },
  
  // 碳排放总量
  total: (scope1Emissions, scope2Emissions) => {
    return scope1Emissions + scope2Emissions
  }
}

// 碳排放报告生成
export const generateReport = (companyData, emissionsData) => {
  const { companyName, reportingYear, industry } = companyData
  const { scope1, scope2, total } = emissionsData
  
  return {
    reportTitle: `${companyName} ${reportingYear}年度碳排放报告`,
    basicInfo: {
      企业名称: companyName,
      报告年度: reportingYear,
      所属行业: industry,
      报告日期: new Date().toLocaleDateString('zh-CN'),
    },
    emissionSummary: {
      'Scope 1 (直接排放)': `${scope1.toFixed(2)} tCO2`,
      'Scope 2 (间接排放)': `${scope2.toFixed(2)} tCO2`,
      '碳排放总量': `${total.toFixed(2)} tCO2`,
    },
    calculationBasis: 'IPCC第六次评估报告 / 中国生态环境部',
  }
}

// 碳市场参考价格 (元/tCO2)
export const carbonPriceRef = {
 全国碳市场: 78,
  广东碳市场: 82,
  上海碳市场: 75,
  北京碳市场: 95,
}

// 计算碳成本
export const calculateCarbonCost = (totalEmissions, quota, market = '全国碳市场') => {
  const price = carbonPriceRef[market] || 78
  const excessEmissions = Math.max(0, totalEmissions - quota)
  const carbonCost = excessEmissions * price
  return {
    quota,
    actualEmissions: totalEmissions,
    excessEmissions,
    price,
    carbonCost: carbonCost.toFixed(2),
  }
}
