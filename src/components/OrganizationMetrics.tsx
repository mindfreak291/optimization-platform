import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar 
} from 'recharts';
import { BuildData } from '@/types/build';
import { 
  Building, Users, Clock, DollarSign, TrendingUp, TrendingDown,
  Activity, Cpu, Database, Network, AlertTriangle, CheckCircle
} from 'lucide-react';

interface OrganizationMetricsProps {
  buildData: BuildData;
}

export const OrganizationMetrics: React.FC<OrganizationMetricsProps> = ({ buildData }) => {
  const { organizationMetrics, projects } = buildData;

  // Generate team performance data
  const teamPerformance = projects.reduce((acc, project) => {
    const team = project.team;
    if (!acc[team]) {
      acc[team] = { team, totalBuildTime: 0, projectCount: 0, avgBundleSize: 0 };
    }
    acc[team].totalBuildTime += project.buildTime;
    acc[team].projectCount += 1;
    acc[team].avgBundleSize += project.bundleSize;
    return acc;
  }, {} as Record<string, any>);

  const teamData = Object.values(teamPerformance).map((team: any) => ({
    ...team,
    avgBuildTime: Math.round(team.totalBuildTime / team.projectCount),
    avgBundleSize: Number((team.avgBundleSize / team.projectCount).toFixed(1))
  }));

  // Infrastructure metrics
  const infrastructureData = [
    { metric: 'CPU Usage', value: 67, target: 80, status: 'good' },
    { metric: 'Memory Usage', value: 72, target: 85, status: 'good' },
    { metric: 'Disk I/O', value: 45, target: 70, status: 'excellent' },
    { metric: 'Network', value: 38, target: 60, status: 'excellent' },
    { metric: 'Cache Hit Rate', value: 89, target: 85, status: 'excellent' },
    { metric: 'Error Rate', value: 6.3, target: 5, status: 'warning' }
  ];

  // Cost analysis over time
  const costTrendData = Array.from({ length: 6 }, (_, i) => ({
    month: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    infrastructureCost: 8000 + Math.random() * 2000,
    developerCost: 12000 + Math.random() * 3000,
    totalCost: 0
  })).map(item => ({
    ...item,
    totalCost: item.infrastructureCost + item.developerCost
  }));

  // Build health radar data
  const healthRadarData = [
    { subject: 'Build Speed', A: 85, fullMark: 100 },
    { subject: 'Success Rate', A: 94, fullMark: 100 },
    { subject: 'Resource Usage', A: 78, fullMark: 100 },
    { subject: 'Cache Efficiency', A: 89, fullMark: 100 },
    { subject: 'Bundle Optimization', A: 72, fullMark: 100 },
    { subject: 'Developer Experience', A: 88, fullMark: 100 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Building className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {organizationMetrics.totalProjects}
              </div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+3 this quarter</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(organizationMetrics.totalBuildTime / 60)}m
              </div>
              <div className="text-sm text-gray-500">Total Build Time/Day</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">-15% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {organizationMetrics.developerHours}
              </div>
              <div className="text-sm text-gray-500">Dev Hours/Month</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">Efficiency +12%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${(organizationMetrics.costPerMonth / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-500">Monthly Cost</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">+8% infrastructure growth</span>
          </div>
        </div>
      </div>

      {/* Team Performance Comparison */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Team Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={teamData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgBuildTime" fill="#3b82f6" name="Avg Build Time (s)" />
            <Bar dataKey="projectCount" fill="#10b981" name="Project Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Infrastructure Health & Cost Trends */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Infrastructure Metrics */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Infrastructure Health</h3>
          <div className="space-y-4">
            {infrastructureData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.value}%
                    </span>
                    {item.status === 'excellent' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.status === 'excellent' ? 'bg-green-500' :
                      item.status === 'good' ? 'bg-blue-500' :
                      item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {item.value}%</span>
                  <span>Target: {item.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Trends */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Cost Trends (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
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
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => [`${Number(value).toLocaleString()}`, '']} />
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
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Build System Health Radar */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Build System Health Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={healthRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar 
                name="Score" 
                dataKey="A" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Performance Indicators */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Build Success Rate</div>
                <div className="text-sm text-gray-500">Last 30 days</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {((1 - organizationMetrics.failureRate) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-600">+2.3% improvement</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Average Resolution Time</div>
                <div className="text-sm text-gray-500">For failed builds</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">23min</div>
                <div className="text-sm text-green-600">-15% faster</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Developer Satisfaction</div>
                <div className="text-sm text-gray-500">Build tool experience</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">4.2/5</div>
                <div className="text-sm text-green-600">+0.3 this quarter</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">ROI on Optimizations</div>
                <div className="text-sm text-gray-500">Investment return</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">340%</div>
                <div className="text-sm text-green-600">Exceeding targets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CI/CD Pipeline Health */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">CI/CD Pipeline Status</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {organizationMetrics.cicdPipelines}
            </div>
            <div className="text-sm text-green-700">Active Pipelines</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">12min</div>
            <div className="text-sm text-blue-700">Avg Pipeline Duration</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">98.7%</div>
            <div className="text-sm text-purple-700">Pipeline Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};