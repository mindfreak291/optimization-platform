import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { BuildData } from '@/types/build';
import { Clock, Package, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BuildOverviewProps {
  buildData: BuildData;
}

export const BuildOverview: React.FC<BuildOverviewProps> = ({ buildData }) => {
  const { projects, organizationMetrics } = buildData;

  const projectPerformanceData = projects.map(project => ({
    name: project.name.substring(0, 12) + '...',
    buildTime: project.buildTime,
    bundleSize: project.bundleSize,
    team: project.team
  }));

  const buildTrendData = projects[0]?.builds?.slice(-7).map(build => ({
    date: build.date.substring(5),
    buildTime: build.buildTime,
    bundleSize: build.bundleSize * 1000 // Convert to KB for better visualization
  })) || [];

  const teamDistribution = projects.reduce((acc, project) => {
    acc[project.team] = (acc[project.team] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamPieData = Object.entries(teamDistribution).map(([team, count]) => ({
    name: team,
    value: count,
    percentage: Math.round((count / projects.length) * 100)
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(organizationMetrics.avgBuildTime)}s
              </div>
              <div className="text-sm text-gray-500">Avg Build Time</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">-12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {organizationMetrics.totalProjects}
              </div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-blue-600">+3 this quarter</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {organizationMetrics.developerHours}h
              </div>
              <div className="text-sm text-gray-500">Dev Hours/Month</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">-8% efficiency gain</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${(organizationMetrics.costPerMonth / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-gray-500">Monthly Cost</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">+5% from infrastructure</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Project Performance Comparison */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Project Build Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="buildTime" fill="#3b82f6" name="Build Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Build Trends */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">7-Day Build Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={buildTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="buildTime" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Build Time (s)"
              />
              <Line 
                type="monotone" 
                dataKey="bundleSize" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Bundle Size (KB)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Projects by Team</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={teamPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {teamPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40% space-y-2">
              {teamPieData.map((team, index) => (
                <div key={team.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{team.name}</span>
                  <span className="text-sm font-semibold">{team.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Build System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(1 - organizationMetrics.failureRate) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold">
                  {((1 - organizationMetrics.failureRate) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CI/CD Pipelines</span>
              <span className="font-semibold text-blue-600">
                {organizationMetrics.cicdPipelines} active
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Optimization Opportunities</span>
              <span className="font-semibold text-orange-600">
                {buildData.optimizationOpportunities.length} identified
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Potential Monthly Savings</span>
              <span className="font-semibold text-green-600">
                $12.4K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};