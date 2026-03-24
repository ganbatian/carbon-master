import React from 'react'
import { TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function EmissionChart({ emissionsData }) {
  const { history, scope1, scope2 } = emissionsData
  const total = scope1 + scope2

  const COLORS = ['#ef4444', '#f97316', '#22c55e']

  const pieData = [
    { name: 'Scope 1', value: scope1 },
    { name: 'Scope 2', value: scope2 },
  ]

  return (
    <div className="space-y-6">
      {/* 趋势分析 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          碳排放趋势分析
        </h2>

        {/* 柱状图 */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">月度碳排放对比</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Bar dataKey="scope1" name="Scope 1 直接排放" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scope2" name="Scope 2 间接排放" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 趋势线图 */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">排放趋势线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="scope1" 
                  name="Scope 1 直接排放" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="scope2" 
                  name="Scope 2 间接排放" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 饼图 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">碳排放构成</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toFixed(2)} tCO2`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5">
          <p className="text-sm text-red-600 dark:text-red-400 mb-1">Scope 1 直接排放</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">{scope1.toFixed(2)} tCO2</p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-1">占比 {(scope1 / total * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5">
          <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Scope 2 间接排放</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{scope2.toFixed(2)} tCO2</p>
          <p className="text-xs text-orange-500 dark:text-orange-500 mt-1">占比 {(scope2 / total * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5">
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">碳排放总量</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{total.toFixed(2)} tCO2</p>
          <p className="text-xs text-green-500 dark:text-green-500 mt-1">当月合计</p>
        </div>
      </div>
    </div>
  )
}

export default EmissionChart
