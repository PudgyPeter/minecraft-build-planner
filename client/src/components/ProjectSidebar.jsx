import { Plus, Trash2, Copy, FolderOpen, Package } from 'lucide-react';

export default function ProjectSidebar({ projects, selectedProject, onSelect, onCreate, onDelete, onDuplicate }) {
  return (
    <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-green-900 to-blue-900">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <FolderOpen className="text-green-400" size={24} />
          Projects
        </h2>
        <button
          onClick={onCreate}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {projects.map(project => (
          <div
            key={project.id}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition-all transform hover:scale-[1.02] ${
              selectedProject?.id === project.id 
                ? 'bg-gradient-to-r from-blue-700 to-blue-800 shadow-lg border-blue-600' 
                : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
            } border`}
            onClick={() => onSelect(project)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Package 
                    className={selectedProject?.id === project.id ? "text-blue-300" : "text-gray-400"} 
                    size={16} 
                  />
                  <h3 className={`font-medium truncate ${
                    selectedProject?.id === project.id ? "text-blue-100" : "text-white"
                  }`}>
                    {project.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-400">
                  {project.materials?.length || 0} materials
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(project.id);
                  }}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-all transform hover:scale-110"
                  title="Duplicate"
                >
                  <Copy size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="p-2 hover:bg-red-600 rounded-lg transition-all transform hover:scale-110"
                  title="Delete"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
