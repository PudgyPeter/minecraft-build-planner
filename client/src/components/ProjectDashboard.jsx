import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, Target, Clock, Zap } from 'lucide-react';

export default function ProjectDashboard({ projects, materials }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    calculateStats();
  }, [projects, materials]);

  const calculateStats = () => {
    if (!projects || projects.length === 0) {
      setStats({
        totalProjects: 0,
        totalMaterials: 0,
        completedMaterials: 0,
        completionRate: 0,
        mostUsedMaterials: [],
        recentActivity: [],
        estimatedTime: 0
      });
      return;
    }

    // Calculate basic stats
    const allMaterials = projects.flatMap(p => p.materials || []);
    const totalMaterials = allMaterials.length;
    const completedMaterials = allMaterials.filter(m => m.collected).length;
    const completionRate = totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0;

    // Most used materials
    const materialCounts = {};
    allMaterials.forEach(m => {
      materialCounts[m.name] = (materialCounts[m.name] || 0) + m.quantity;
    });
    
    const mostUsedMaterials = Object.entries(materialCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    // Recent activity (projects sorted by creation/modification)
    const recentActivity = projects
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(p => ({
        name: p.name,
        createdAt: p.createdAt,
        materialsCount: p.materials?.length || 0
      }));

    // Estimated gathering time (rough calculation)
    const estimatedTime = totalMaterials * 2; // Assume 2 minutes per material

    setStats({
      totalProjects: projects.length,
      totalMaterials,
      completedMaterials,
      completionRate,
      mostUsedMaterials,
      recentActivity,
      estimatedTime
    });
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!stats) {
    return (
      <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-white">Project Dashboard</h2>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-green-500" size={16} />
            <span className="text-gray-400 text-sm">Projects</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-blue-500" size={16} />
            <span className="text-gray-400 text-sm">Materials</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalMaterials}</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-500" size={16} />
            <span className="text-gray-400 text-sm">Complete</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.completionRate}%</div>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-orange-500" size={16} />
            <span className="text-gray-400 text-sm">Est. Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(stats.estimatedTime)}</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          Overall Progress
        </h3>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
            style={{ width: `${stats.completionRate}%` }}
          >
            {stats.completionRate > 10 && (
              <span className="text-xs text-white font-medium">{stats.completionRate}%</span>
            )}
          </div>
        </div>
        <div className="text-gray-400 text-sm mt-1">
          {stats.completedMaterials} of {stats.totalMaterials} materials collected
        </div>
      </div>

      {/* Most Used Materials */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-white font-semibold mb-3">Most Used Materials</h3>
          {stats.mostUsedMaterials.length > 0 ? (
            <div className="space-y-2">
              {stats.mostUsedMaterials.map((material, index) => (
                <div key={material.name} className="flex items-center justify-between bg-gray-900 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-4">#{index + 1}</span>
                    <span className="text-white text-sm">{material.name}</span>
                  </div>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {material.quantity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No materials yet</div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-2">
              {stats.recentActivity.map((project, index) => (
                <div key={project.name} className="bg-gray-900 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{project.name}</span>
                    <span className="text-gray-400 text-xs">
                      {project.materialsCount} materials
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No projects yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
