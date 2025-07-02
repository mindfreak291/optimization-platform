import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BuildData, OptimizationOpportunity } from '@/types/build';
import { 
  Zap, DollarSign, Clock, TrendingUp, ChevronRight, CheckCircle,
  AlertTriangle, Target, ArrowRight, ExternalLink
} from 'lucide-react';

interface OptimizationRecommendationsProps {
  buildData: BuildData;
}

export const OptimizationRecommendations: React.FC<OptimizationRecommendationsProps> = ({ 
  buildData 
}) => {
  const [selectedOptimization, setSelectedOptimization] = useState<OptimizationOpportunity | null>(null);
  const [filterEffort, setFilterEffort] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  const { optimizationOpportunities } = buildData;

  const filteredOpportunities = optimizationOpportunities.filter(opp => 
    filterEffort === 'All' || opp.effort === filterEffort
  );

  const impactData = optimizationOpportunities.map(opp => ({
    name: opp.type.substring(0, 15) + '...',
    savings: parseInt(opp.savings.replace(/[$,K\/month]/g, '')) * 1000,
    effort: opp.effort,
    projects: opp.projects.length
  }));

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  const totalPotentialSavings = optimizationOpportunities.reduce((sum, opp) => 
    sum + parseInt(opp.savings.replace(/[$,K\/month]/g, '')) * 1000, 0
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {optimizationOpportunities.length}
              </div>
              <div className="text-sm text-gray-500">Opportunities</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${(totalPotentialSavings / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-500">Potential Savings/Month</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">47%</div>
              <div className="text-sm text-gray-500">Avg Time Reduction</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">340%</div>
              <div className="text-sm text-gray-500">Expected ROI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Impact Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Optimization Impact Analysis</h3>
          <select 
            value={filterEffort}
            onChange={(e) => setFilterEffort(e.target.value as any)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="All">All Efforts</option>
            <option value="Low">Low Effort</option>
            <option value="Medium">Medium Effort</option>
            <option value="High">High Effort</option>
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={impactData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${Number(value).toLocaleString()}`, 'Monthly Savings']}
            />
            <Bar dataKey="savings" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Optimization Opportunities List */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Optimization Opportunities</h3>
          {filteredOpportunities.map((opportunity, index) => (
            <div 
              key={index}
              onClick={() => setSelectedOptimization(opportunity)}
              className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{opportunity.type}</h4>
                  <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded-full text-xs border flex items-center space-x-1 ${getEffortColor(opportunity.effort)}`}>
                    {getEffortIcon(opportunity.effort)}
                    <span>{opportunity.effort} Effort</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {opportunity.projects.length} project{opportunity.projects.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{opportunity.savings}</div>
                  <div className="text-xs text-gray-500">{opportunity.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Optimization View */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedOptimization ? 'Implementation Details' : 'Select an Optimization'}
          </h3>
          
          {selectedOptimization ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedOptimization.type}</h4>
                <p className="text-gray-600">{selectedOptimization.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Expected Savings</div>
                  <div className="text-lg font-bold text-green-700">{selectedOptimization.savings}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Performance Impact</div>
                  <div className="text-lg font-bold text-blue-700">{selectedOptimization.impact}</div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Affected Projects</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedOptimization.projects.map((projectId, index) => {
                    const project = buildData.projects.find(p => p.id === projectId);
                    return (
                      <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {project?.name || projectId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {selectedOptimization.implementationSteps && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Implementation Steps</h5>
                  <div className="space-y-2">
                    {selectedOptimization.implementationSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Implementation Plan
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select an optimization opportunity to view implementation details</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Wins Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Wins</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {optimizationOpportunities
            .filter(opp => opp.effort === 'Low')
            .slice(0, 3)
            .map((quickWin, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{quickWin.type}</h4>
                  <ArrowRight className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{quickWin.impact}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-600 font-medium">Low Effort</span>
                  <span className="text-sm font-semibold text-green-700">{quickWin.savings}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Implementation Roadmap */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recommended Implementation Roadmap</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                Q1
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-800">Quick Wins & Low-Hanging Fruit</h4>
              <p className="text-sm text-green-700">
                Focus on low-effort, high-impact optimizations. Expected savings: $3.2K/month
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                Q2
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-blue-800">Medium Complexity Optimizations</h4>
              <p className="text-sm text-blue-700">
                Implement dependency deduplication and build cache optimization. Expected savings: $6.6K/month
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                Q3
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-purple-800">Strategic Architectural Changes</h4>
              <p className="text-sm text-purple-700">
                Major migrations and architectural improvements. Expected savings: $13K/month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};