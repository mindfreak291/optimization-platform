import React, { useState } from 'react';
import { 
   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { BuildData } from '@/types/build';
import { 
  DollarSign, TrendingUp, TrendingDown, Calculator, Target,
  Users, Clock, Zap, AlertTriangle, CheckCircle
} from 'lucide-react';

interface CostAnalysisProps {
  buildData: BuildData;
}

export const CostAnalysis: React.FC<CostAnalysisProps> = ({ buildData }) => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [costBreakdown, setCostBreakdown] = useState<'infrastructure' | 'developer' | 'opportunity'>('infrastructure');

  const { organizationMetrics, projects, optimizationOpportunities } = buildData;

  // Generate cost trend data
  const costTrendData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    
    return {
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      infrastructureCost: 8000 + Math.random() * 3000,
      developerCost: 12000 + Math.random() * 4000,
      opportunityCost: 2000 + Math.random() * 1500,
      totalCost: 0
    };
  }).map(item => ({
    ...item,
    totalCost: item.infrastructureCost + item.developerCost + item.opportunityCost
  }));

  // Cost breakdown by category
  const costBreakdownData = [
    { 
      category: 'CI/CD Infrastructure', 
      cost: 4200, 
      percentage: 27,
      description: 'Build servers, storage, networking'
    },
    { 
      category: 'Developer Time', 
      cost: 8400, 
      percentage: 54,
      description: 'Time spent waiting for builds'
    },
    { 
      category: 'Cloud Resources', 
      cost: 2100, 
      percentage: 13,
      description: 'AWS, deployment infrastructure'
    },
    { 
      category: 'Tool Licenses', 
      cost: 900, 
      percentage: 6,
      description: 'Build tools, monitoring, analytics'
    }
  ];

  // Project cost analysis
  const projectCostData = projects.map(project => {
    const buildsPerDay = 15; // Average builds per day
    const costPerMinute = 0.5; // Cost per build minute
    const developerWaitCost = 2; // Cost per minute of developer waiting
    
    const dailyBuildCost = (project.buildTime / 60) * buildsPerDay * costPerMinute;
    const dailyWaitCost = (project.buildTime / 60) * buildsPerDay * developerWaitCost;
    
    return {
      name: project.name.substring(0, 15) + '...',
      team: project.team,
      buildTime: project.buildTime,
      dailyCost: dailyBuildCost + dailyWaitCost,
      monthlyCost: (dailyBuildCost + dailyWaitCost) * 30,
      efficiency: Math.random() * 40 + 60 // Simulated efficiency score
    };
  });

  // ROI calculations for optimizations
  const roiData = optimizationOpportunities.map(opp => {
    const monthlySavings = parseInt(opp.savings.replace(/[$,K\/month]/g, '')) * 1000;
    const implementationCost = opp.effort === 'Low' ? 5000 : 
                              opp.effort === 'Medium' ? 15000 : 35000;
    const roi = ((monthlySavings * 12 - implementationCost) / implementationCost) * 100;
    
    return {
      optimization: opp.type.substring(0, 20) + '...',
      monthlySavings,
      implementationCost,
      roi,
      paybackMonths: Math.ceil(implementationCost / monthlySavings),
      effort: opp.effort
    };
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const formatCurrency = (value: number) => `${(value / 1000).toFixed(1)}K`;

  const currentMonthlyCost = organizationMetrics.costPerMonth;
  const potentialMonthlySavings = optimizationOpportunities.reduce((sum, opp) => 
    sum + parseInt(opp.savings.replace(/[$,K\/month]/g, '')) * 1000, 0
  );

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(currentMonthlyCost)}
              </div>
              <div className="text-sm text-gray-500">Current Monthly Cost</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(potentialMonthlySavings)}
              </div>
              <div className="text-sm text-gray-500">Potential Savings</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">-{Math.round(potentialMonthlySavings/currentMonthlyCost*100)}% reduction possible</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Calculator className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${Math.round((potentialMonthlySavings * 12) / 1000)}K
              </div>
              <div className="text-sm text-gray-500">Annual Savings</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">High confidence</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(organizationMetrics.developerHours)}h
              </div>
              <div className="text-sm text-gray-500">Dev Hours/Month</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Optimization target: -40%</span>
          </div>
        </div>
      </div>

      {/* Cost Trends */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Cost Trends (12 Months)</h3>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="monthly">Monthly View</option>
            <option value="quarterly">Quarterly View</option>
            <option value="yearly">Yearly View</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={costTrendData}>
            <defs>
              <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOpp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
            <Area 
              type="monotone" 
              dataKey="infrastructureCost" 
              stackId="1"
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorInfra)"
              name="Infrastructure"
            />
            <Area 
              type="monotone" 
              dataKey="developerCost" 
              stackId="1"
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorDev)"
              name="Developer Time"
            />
            <Area 
              type="monotone" 
              dataKey="opportunityCost" 
              stackId="1"
              stroke="#f59e0b" 
              fillOpacity={1} 
              fill="url(#colorOpp)"
              name="Opportunity Cost"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Breakdown and Project Analysis */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cost Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
          <div className="flex items-center mb-4">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="cost"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40% space-y-2">
              {costBreakdownData.map((item, index) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">{formatCurrency(item.cost)} ({item.percentage}%)</div>
                  <div className="text-xs text-gray-400 ml-5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Cost Analysis */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Project Cost Analysis</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={projectCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Monthly Cost']} />
              <Bar dataKey="monthlyCost" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Optimization ROI Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Optimization</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Monthly Savings</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Implementation Cost</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Payback Period</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Annual ROI</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Effort</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roiData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.optimization}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
                    {formatCurrency(item.monthlySavings)}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(item.implementationCost)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${
                      item.paybackMonths <= 3 ? 'text-green-600' :
                      item.paybackMonths <= 6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.paybackMonths} months
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${
                      item.roi >= 200 ? 'text-green-600' :
                      item.roi >= 100 ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {item.roi.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.effort === 'Low' ? 'bg-green-100 text-green-800' :
                      item.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.effort}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {item.roi >= 200 && item.paybackMonths <= 3 ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">High</span>
                        </>
                      ) : item.roi >= 100 && item.paybackMonths <= 6 ? (
                        <>
                          <Clock className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-blue-600 font-medium">Medium</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-yellow-600 font-medium">Low</span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Optimization Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4">Cost Optimization Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-green-500" />
              <h4 className="font-medium">Quick Wins</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Implement low-effort optimizations for immediate cost reduction
            </p>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(roiData.filter(r => r.effort === 'Low').reduce((sum, r) => sum + r.monthlySavings, 0))} /month
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium">Medium Term</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Strategic optimizations with significant impact
            </p>
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency(roiData.filter(r => r.effort === 'Medium').reduce((sum, r) => sum + r.monthlySavings, 0))} /month
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium">Transformational</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Architectural changes for maximum long-term impact
            </p>
            <div className="text-lg font-bold text-purple-600">
              {formatCurrency(roiData.filter(r => r.effort === 'High').reduce((sum, r) => sum + r.monthlySavings, 0))} /month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};