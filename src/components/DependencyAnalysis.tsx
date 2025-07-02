import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { BuildData, Dependency } from '@/types/build';
import { 
  Package, AlertTriangle, CheckCircle, TrendingDown,
  Search, ExternalLink, Shield, Clock
} from 'lucide-react';

interface DependencyAnalysisProps {
  buildData: BuildData;
}

export const DependencyAnalysis: React.FC<DependencyAnalysisProps> = ({ buildData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedProject, setSelectedProject] = useState('web-app');

  const project = buildData.projects.find(p => p.id === selectedProject);
  const dependencies = project?.dependencyList || [];

  // Aggregate dependency data across all projects
  const allDependencies = useMemo(() => {
    const depMap = new Map<string, any>();
    
    buildData.projects.forEach(project => {
      project.dependencyList?.forEach(dep => {
        if (depMap.has(dep.name)) {
          const existing = depMap.get(dep.name);
          existing.totalSize += dep.size;
          existing.projects.push(project.name);
          existing.usageCount += 1;
        } else {
          depMap.set(dep.name, {
            ...dep,
            totalSize: dep.size,
            projects: [project.name],
            usageCount: 1,
            duplicated: false
          });
        }
      });
    });

    // Mark duplicated dependencies
    return Array.from(depMap.values()).map(dep => ({
      ...dep,
      duplicated: dep.usageCount > 1
    }));
  }, [buildData.projects]);

  const filteredDependencies = dependencies.filter(dep => {
    const matchesSearch = dep.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || dep.type === filterType;
    return matchesSearch && matchesType;
  });

  const dependencyTypes = [...new Set(dependencies.map(dep => dep.type))];
  
  // Data for treemap visualization
  const treemapData = filteredDependencies.map(dep => ({
    name: dep.name,
    size: dep.size,
    type: dep.type,
    treeshakable: dep.treeshakable
  }));

  // Bundle composition by type
  const bundleComposition = dependencyTypes.map(type => {
    const typeDeps = dependencies.filter(dep => dep.type === type);
    const totalSize = typeDeps.reduce((sum, dep) => sum + dep.size, 0);
    return {
      type,
      size: totalSize,
      count: typeDeps.length,
      treeshakable: typeDeps.filter(dep => dep.treeshakable).length
    };
  });

  // Risk analysis
  const riskAnalysis = useMemo(() => {
    const outdatedDeps = dependencies.filter(dep => {
      // Simulate outdated check based on version patterns
      const version = dep.version || '1.0.0';
      const majorVersion = parseInt(version.split('.')[0]);
      return majorVersion < 2; // Simplified outdated logic
    });

    const nonTreeshakable = dependencies.filter(dep => !dep.treeshakable);
    const largeDeps = dependencies.filter(dep => dep.size > 300);

    return {
      outdated: outdatedDeps.length,
      nonTreeshakable: nonTreeshakable.length,
      large: largeDeps.length,
      totalRisk: outdatedDeps.length + nonTreeshakable.length + largeDeps.length
    };
  }, [dependencies]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getSizeColor = (size: number) => {
    if (size > 500) return '#ef4444'; // Red for large
    if (size > 200) return '#f59e0b'; // Orange for medium
    return '#10b981'; // Green for small
  };

  const getRiskLevel = (dep: Dependency) => {
    let risk = 0;
    if (!dep.treeshakable) risk += 1;
    if (dep.size > 300) risk += 1;
    // Add more risk factors as needed
    
    if (risk === 0) return { level: 'Low', color: 'text-green-600 bg-green-50' };
    if (risk === 1) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    return { level: 'High', color: 'text-red-600 bg-red-50' };
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {dependencies.length}
              </div>
              <div className="text-sm text-gray-500">Total Dependencies</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {riskAnalysis.totalRisk}
              </div>
              <div className="text-sm text-gray-500">Risk Factors</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {dependencies.filter(d => d.treeshakable).length}
              </div>
              <div className="text-sm text-gray-500">Tree-shakable</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Package className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(dependencies.reduce((sum, dep) => sum + dep.size, 0) / 1024)}MB
              </div>
              <div className="text-sm text-gray-500">Total Size</div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Selector and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {buildData.projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProject(proj.id)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  selectedProject === proj.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dependencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="All">All Types</option>
              {dependencyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dependency Size Visualization */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Dependency Size Visualization</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {treemapData.slice(0, 12).map((dep, index) => (
            <div
              key={dep.name}
              className="relative p-4 rounded-lg border-2 transition-all hover:shadow-md"
              style={{
                backgroundColor: getSizeColor(dep.size) + '20',
                borderColor: getSizeColor(dep.size),
                minHeight: Math.max(60, Math.min(120, dep.size / 5))
              }}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {dep.name}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {dep.type}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold" style={{ color: getSizeColor(dep.size) }}>
                    {dep.size}KB
                  </div>
                  <div className="flex items-center mt-1">
                    {dep.treeshakable ? (
                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className="text-xs text-gray-500">
                      {dep.treeshakable ? 'Optimized' : 'Not optimized'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span>Small (&lt;200KB)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Medium (200-500KB)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Large (&gt;500KB)</span>
          </div>
        </div>
      </div>

      {/* Bundle Composition and Risk Analysis */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Bundle Composition by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bundleComposition}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="size" fill="#3b82f6" name="Size (KB)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="font-medium text-red-800">Non-tree-shakable</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{riskAnalysis.nonTreeshakable}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-yellow-800">Large Dependencies</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{riskAnalysis.large}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-orange-800">Potentially Outdated</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{riskAnalysis.outdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Dependency List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Dependency Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Package</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Version</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Size</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Tree-shakable</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Risk</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDependencies.slice(0, 20).map((dep, index) => {
                const risk = getRiskLevel(dep);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{dep.name}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{dep.version || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        dep.size > 500 ? 'text-red-600' : 
                        dep.size > 200 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {dep.size}KB
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                        {dep.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {dep.treeshakable ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${risk.color}`}>
                        {risk.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
     {/* Optimization Recommendations */}
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border">
    <h3 className="text-lg font-semibold mb-4">Dependency Optimization Recommendations</h3>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingDown className="w-5 h-5 text-red-500" />
          <h4 className="font-medium">Replace Large Dependencies</h4>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Consider replacing moment.js (329KB) with date-fns or day.js for 70% size reduction
        </p>
        <span className="text-xs text-green-600 font-medium">Potential savings: 230KB</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Package className="w-5 h-5 text-blue-500" />
          <h4 className="font-medium">Enable Tree Shaking</h4>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Lodash and other utilities can be tree-shaken with proper import statements
        </p>
        <span className="text-xs text-green-600 font-medium">Potential savings: 350KB</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h4 className="font-medium">Deduplicate Dependencies</h4>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {allDependencies.filter(d => d.duplicated).length} dependencies are used across multiple projects
        </p>
        <span className="text-xs text-green-600 font-medium">Potential savings: 180KB</span>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-5 h-5 text-purple-500" />
          <h4 className="font-medium">Update Dependencies</h4>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          {riskAnalysis.outdated} dependencies may have newer, more efficient versions
        </p>
        <span className="text-xs text-blue-600 font-medium">Security & Performance</span>
      </div>
    </div>
  </div>
</div>
);
};