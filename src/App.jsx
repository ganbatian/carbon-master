import React, { useState } from 'react'
import { 
  Building2, FileText, TrendingUp, AlertTriangle, 
  Download, Calculator, PieChart, Leaf,
  Menu, X, Sun, Moon
} from 'lucide-react'
import Dashboard from './components/Dashboard'
import EmissionInput from './components/EmissionInput'
import Report from './components/Report'
import EmissionChart from './components/EmissionChart'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    year: new Date().getFullYear(),
  })
  const [emissionsData, setEmissionsData] = useState({
    scope1: 0,
    scope2: 0,
    history: [
      { month: '1月', scope1: 120, scope2: 450 },
      { month: '2月', scope1: 115, scope2: 420 },
      { month: '3月', scope1: 130, scope2: 480 },
      { month: '4月', scope1: 125, scope2: 460 },
      { month: '5月', scope1: 140, scope2: 510 },
      { month: '6月', scope1: 135, scope2: 495 },
    ]
  })

  const navItems = [
    { id: 'dashboard', label: '数据概览', icon: PieChart },
    { id: 'input', label: '数据录入', icon: Calculator },
    { id: 'chart', label: '趋势分析', icon: TrendingUp },
    { id: 'report', label: '报告生成', icon: FileText },
  ]

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 顶部导航 */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">CarbonMaster</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">企业碳排放管理平台</p>
                </div>
              </div>

              {/* 桌面端导航 */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* 右侧按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 移动端导航 */}
            {mobileMenuOpen && (
              <nav className="md:hidden py-4 border-t dark:border-gray-700">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </header>

        {/* 主内容 */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              emissionsData={emissionsData} 
              companyData={companyData}
              setCompanyData={setCompanyData}
            />
          )}
          {activeTab === 'input' && (
            <EmissionInput 
              setEmissionsData={setEmissionsData}
              companyData={companyData}
              setCompanyData={setCompanyData}
            />
          )}
          {activeTab === 'chart' && (
            <EmissionChart emissionsData={emissionsData} />
          )}
          {activeTab === 'report' && (
            <Report 
              emissionsData={emissionsData}
              companyData={companyData}
            />
          )}
        </main>

        {/* 页脚 */}
        <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              CarbonMaster © 2024 | 计算标准: IPCC AR6 / 中国生态环境部
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
