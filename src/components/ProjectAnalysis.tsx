import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { BuildData } from '@/types/build';
import { 
  Clock, Package, TrendingUp, TrendingDown, CheckCircle, 
  AlertTriangle, Users, Code 
} from 'lucide-react';

interface ProjectAnalysisProps {
  buildData: BuildData;
  selectedProject: string;
  onProjectSelect: (projectId: string) => void;
}

export const ProjectAnalysis: React.FC<ProjectAnalysisProps> = ({ 
  buildData, 
  selectedProject, 
  onProjectSelect 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'buildTime' | 'bundleSize'>('buildTime');
  
  const project = buildData.projects.find(p => p.id === selectedProject);
  
  if (!project) return null;

  const metrics = {
    buildTime: { label: 'Build Time (s)', color: '#3b82f6' },
    bundleSize: { label: 'Bundle Size (MB)', color: '#10b981' }
  };

  const trendData = project.builds?.map(build => ({
    ...build,
    trend: build[selectedMetric]
  })) || [];

  const avgMetric = trendData.reduce((sum, item) => sum + item.trend, 0) / trendData.length;
  const trend = trendData.length > 1 ? 
    ((trendData[trendData.length - 1].trend - trendData[0].trend) / trendData[0].trend) * 100 : 0;

  const chunkData = project.chunks?.map(chunk => ({
    ...chunk,
    percentage: (chunk.size / (project?.chunks?.reduce((sum, c) => sum + c.size, 0) ?? 1)) * 100
  })) || [];

  const dependencyData = project.dependencyList?.map(dep => ({
    ...dep,
    percentage: (dep.size / (project?.dependencyList?.reduce((sum, d) => sum + d.size, 0)??1)) * 100
  })) || [];

  const getChunkColor = (type: string) => {
    const colors = {
      entry: '#3b82f6',
      vendor: '#10b981', 
      common: '#f59e0b',
      runtime: '#ef4444',
      async: '#8b5cf6'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getOptimizationStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'recommended': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOptimizationIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'recommended': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Project Selector */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap gap-3">
          {buildData.projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => onProjectSelect(proj.id)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedProject === proj.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-sm font-medium">{proj.name}</div>
              <div className="text-xs text-gray-500">{proj.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-6 h-6 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {project.buildTime}s
              </div>
              <div className="text-sm text-gray-500">Build Time</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="w-6 h-6 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {project.bundleSize}MB
              </div>
              <div className="text-sm text-gray-500">Bundle Size</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-6 h-6 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {project.team}
              </div>
              <div className="text-sm text-gray-500">Team</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Code className="w-6 h-6 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {project.dependencies}
              </div>
              <div className="text-sm text-gray-500">Dependencies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Performance Trends</h3>
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'buildTime' | 'bundleSize')}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            {Object.entries(metrics).map(([key, metric]) => (
              <option key={key} value={key}>{metric.label}</option>
            ))}
          </select>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: metrics[selectedMetric].color }}>
              {avgMetric.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">30-day Average</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center justify-center ${
              trend < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend < 0 ? <TrendingDown className="w-5 h-5 mr-1" /> : <TrendingUp className="w-5 h-5 mr-1" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Trend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {trendData.filter(d => d.success).length}
            </div>
            <div className="text-sm text-gray-500">Successful Builds</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="trend" 
              stroke={metrics[selectedMetric].color} 
              strokeWidth={2}
              dot={{ fill: metrics[selectedMetric].color, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bundle Analysis */}
      <div className="grid lg:grid-cols-2 gap-8">
        {project.chunks && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Bundle Composition</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={chunkData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="size"
                  >
                    {chunkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getChunkColor(entry.type)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-40% space-y-2">
                {chunkData.map((chunk, index) => (
                  <div key={chunk.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getChunkColor(chunk.type) }}
                      ></div>
                      <span className="text-sm text-gray-600 capitalize">{chunk.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{chunk.size}KB</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dependencies */}
        {project.dependencyList && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Top Dependencies</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {dependencyData.slice(0, 10).map((dep, index) => (
                <div key={dep.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">{dep.name}</div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      dep.treeshakable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dep.treeshakable ? 'Tree-shakable' : 'Not optimized'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{dep.size}KB</div>
                    <div className="text-xs text-gray-500">{dep.version}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Optimizations */}
      {project.optimizations && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Optimization Status</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {project.optimizations.map((opt, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getOptimizationStatusColor(opt.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getOptimizationIcon(opt.status)}
                    <span className="font-medium">{opt.type}</span>
                  </div>
                  <span className="text-sm font-semibold">{opt.impact}</span>
                </div>
                <div className="text-sm opacity-75 capitalize">{opt.status.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};