export interface Project {
    id: string;
    name: string;
    type: string;
    team: string;
    buildTime: number;
    bundleSize: number;
    dependencies: number;
    lastOptimized: string;
    builds?: BuildHistory[];
    chunks?: Chunk[];
    dependencyList?: Dependency[];
    optimizations?: Optimization[];
  }
  
  export interface BuildHistory {
    date: string;
    buildTime: number;
    bundleSize: number;
    success: boolean;
  }
  
  export interface Chunk {
    name: string;
    size: number;
    type: 'entry' | 'vendor' | 'common' | 'runtime' | 'async';
  }
  
  export interface Dependency {
    name: string;
    size: number;
    type: string;
    treeshakable: boolean;
    version?: string;
    lastUpdated?: string;
  }
  
  export interface Optimization {
    type: string;
    impact: string;
    status: 'implemented' | 'recommended' | 'in-progress';
    description?: string;
  }
  
  export interface OrganizationMetrics {
    totalBuildTime: number;
    totalProjects: number;
    avgBuildTime: number;
    costPerMonth: number;
    developerHours: number;
    cicdPipelines: number;
    failureRate: number;
  }
  
  export interface OptimizationOpportunity {
    type: string;
    projects: string[];
    impact: string;
    effort: 'Low' | 'Medium' | 'High';
    savings: string;
    description?: string;
    implementationSteps?: string[];
  }
  
  export interface BuildData {
    projects: Project[];
    organizationMetrics: OrganizationMetrics;
    optimizationOpportunities: OptimizationOpportunity[];
  }