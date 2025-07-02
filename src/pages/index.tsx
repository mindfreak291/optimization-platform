import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { BuildOverview } from '@/components/BuildOverview';
import { ProjectAnalysis } from '@/components/ProjectAnalysis';
import { OrganizationMetrics } from '@/components/OrganizationMetrics';
import { OptimizationRecommendations } from '@/components/OptimizationRecommendations';
import { DependencyAnalysis } from '@/components/DependencyAnalysis';
import { CostAnalysis } from '@/components/CostAnalysis';
import { generateBuildData } from '@/utils/mockData';
import { BuildData } from '@/types/build';
import { 
  BarChart3, Zap, Building, Target, Package, DollarSign, 
  TrendingUp
} from 'lucide-react';

const navigation = [
  { id: 'overview', label: 'Build Overview', icon: BarChart3 },
  { id: 'projects', label: 'Project Analysis', icon: Package },
  { id: 'organization', label: 'Organization Metrics', icon: Building },
  { id: 'optimizations', label: 'Optimizations', icon: Zap },
  { id: 'dependencies', label: 'Dependencies', icon: Target },
  { id: 'costs', label: 'Cost Analysis', icon: DollarSign },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [buildData, setBuildData] = useState<BuildData | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('web-app');

  useEffect(() => {
    setBuildData(generateBuildData());
  }, []);

  if (!buildData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading build analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Build System Optimization Platform</title>
        <meta name="description" content="Enterprise build system analysis and optimization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🚀 Build System Optimization Platform
                </h1>
                <p className="text-gray-600 mt-1">
                  Enterprise-scale build performance analysis and optimization
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Monthly Savings</div>
                  <div className="text-2xl font-bold text-green-600">$12.4K</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8 overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === item.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'overview' && <BuildOverview buildData={buildData} />}
          {activeTab === 'projects' && (
            <ProjectAnalysis 
              buildData={buildData} 
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
            />
          )}
          {activeTab === 'organization' && <OrganizationMetrics buildData={buildData} />}
          {activeTab === 'optimizations' && <OptimizationRecommendations buildData={buildData} />}
          {activeTab === 'dependencies' && <DependencyAnalysis buildData={buildData} />}
          {activeTab === 'costs' && <CostAnalysis buildData={buildData} />}
        </main>
      </div>
    </>
  );
}