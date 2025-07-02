import { BuildData, Project, BuildHistory } from '@/types/build';

const generateBuildHistory = (baseTime: number, baseSzie: number): BuildHistory[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    buildTime: baseTime + Math.random() * (baseTime * 0.3),
    bundleSize: baseSzie + Math.random() * (baseSzie * 0.2),
    success: Math.random() > 0.05
  })).reverse();
};

export const generateBuildData = (): BuildData => ({
  projects: [
    {
      id: 'web-app',
      name: 'Main Web Application',
      type: 'Next.js 14',
      team: 'Platform Engineering',
      buildTime: 847,
      bundleSize: 2.3,
      dependencies: 245,
      lastOptimized: '2024-12-15',
      builds: generateBuildHistory(847, 2.3),
      chunks: [
        { name: 'main', size: 580, type: 'entry' },
        { name: 'vendor', size: 720, type: 'vendor' },
        { name: 'commons', size: 180, type: 'common' },
        { name: 'runtime', size: 45, type: 'runtime' },
        { name: 'async-chunks', size: 775, type: 'async' }
      ],
      dependencyList: [
        { name: 'react', size: 142, type: 'framework', treeshakable: true, version: '18.2.0' },
        { name: 'lodash', size: 528, type: 'utility', treeshakable: false, version: '4.17.21' },
        { name: 'moment', size: 329, type: 'date', treeshakable: false, version: '2.29.4' },
        { name: 'antd', size: 892, type: 'ui', treeshakable: true, version: '5.0.0' },
        { name: 'recharts', size: 234, type: 'visualization', treeshakable: true, version: '2.8.0' }
      ],
      optimizations: [
        { type: 'Code Splitting', impact: '-15%', status: 'implemented' },
        { type: 'Tree Shaking', impact: '-23%', status: 'implemented' },
        { type: 'Bundle Analysis', impact: '-12%', status: 'recommended' },
        { type: 'Lazy Loading', impact: '-8%', status: 'in-progress' }
      ]
    },
    {
      id: 'mobile-app',
      name: 'Mobile Application',
      type: 'React Native',
      team: 'Mobile Engineering',
      buildTime: 1240,
      bundleSize: 4.7,
      dependencies: 180,
      lastOptimized: '2024-11-28',
      builds: generateBuildHistory(1240, 4.7),
      optimizations: [
        { type: 'Metro Bundle Splitting', impact: '-20%', status: 'recommended' },
        { type: 'Hermes Engine', impact: '-35%', status: 'in-progress' }
      ]
    },
    {
      id: 'admin-portal',
      name: 'Admin Portal',
      type: 'Vue.js 3',
      team: 'Backend Engineering',
      buildTime: 445,
      bundleSize: 1.8,
      dependencies: 156,
      lastOptimized: '2024-12-20',
      builds: generateBuildHistory(445, 1.8),
      optimizations: [
        { type: 'Vite Migration', impact: '-45%', status: 'implemented' },
        { type: 'Component Lazy Loading', impact: '-12%', status: 'implemented' }
      ]
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      type: 'Angular 17',
      team: 'Data Engineering',
      buildTime: 1120,
      bundleSize: 3.2,
      dependencies: 198,
      lastOptimized: '2024-10-15',
      builds: generateBuildHistory(1120, 3.2),
      optimizations: [
        { type: 'Ivy Renderer', impact: '-25%', status: 'implemented' },
        { type: 'OnPush Strategy', impact: '-18%', status: 'recommended' }
      ]
    }
  ],
  organizationMetrics: {
    totalBuildTime: 3652,
    totalProjects: 12,
    avgBuildTime: 678,
    costPerMonth: 15600,
    developerHours: 340,
    cicdPipelines: 45,
    failureRate: 0.063
  },
  optimizationOpportunities: [
    {
      type: 'Webpack to Vite Migration',
      projects: ['web-app', 'analytics-dashboard'],
      impact: 'Reduce build time by 60%',
      effort: 'High',
      savings: '$5,800/month',
      description: 'Migrate from Webpack to Vite for significantly faster development builds',
      implementationSteps: [
        'Audit existing webpack configuration',
        'Create Vite configuration',
        'Update build scripts',
        'Test in staging environment',
        'Gradual rollout to production'
      ]
    },
    {
      type: 'Dependency Deduplication',
      projects: ['web-app', 'admin-portal', 'analytics-dashboard'],
      impact: 'Reduce bundle size by 18%',
      effort: 'Medium',
      savings: '$2,400/month',
      description: 'Eliminate duplicate dependencies across projects'
    },
    {
      type: 'Build Cache Optimization',
      projects: ['mobile-app'],
      impact: 'Reduce build time by 35%',
      effort: 'Medium',
      savings: '$4,200/month',
      description: 'Implement distributed build caching with Nx or similar'
    },
    {
      type: 'Micro-Frontend Architecture',
      projects: ['web-app'],
      impact: 'Enable independent deployments',
      effort: 'High',
      savings: '$7,200/month',
      description: 'Split monolithic frontend into independently deployable modules'
    }
  ]
});

export const generateComparisonData = () => ({
  buildTools: [
    { name: 'Webpack', avgBuildTime: 125, devServerStart: 8.5, hmrSpeed: 2.1, adoption: 65 },
    { name: 'Vite', avgBuildTime: 45, devServerStart: 1.2, hmrSpeed: 0.3, adoption: 25 },
    { name: 'Parcel', avgBuildTime: 78, devServerStart: 3.8, hmrSpeed: 1.5, adoption: 8 },
    { name: 'esbuild', avgBuildTime: 12, devServerStart: 0.8, hmrSpeed: 0.2, adoption: 2 }
  ],
  optimizationImpact: [
    { optimization: 'Code Splitting', beforeTime: 180, afterTime: 153, bundleReduction: 15 },
    { optimization: 'Tree Shaking', beforeTime: 153, afterTime: 118, bundleReduction: 23 },
    { optimization: 'Lazy Loading', beforeTime: 118, afterTime: 108, bundleReduction: 8 },
    { optimization: 'Bundle Analysis', beforeTime: 108, afterTime: 95, bundleReduction: 12 }
  ]
});