import { Plus, Trash2, Copy } from 'lucide-react';

export default function ProjectSidebar({ projects, selectedProject, onSelect, onCreate, onDelete, onDuplicate }) {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white mb-3">Projects</h2>
        <button
          onClick={onCreate}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {projects.map(project => (
          <div
            key={project.id}
            className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition ${
              selectedProject?.id === project.id ? 'bg-gray-700' : ''
            }`}
            onClick={() => onSelect(project)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{project.name}</h3>
                <p className="text-gray-400 text-sm">
                  {project.materials?.length || 0} materials
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(project.id);
                  }}
                  className="p-1 hover:bg-gray-600 rounded transition"
                  title="Duplicate"
                >
                  <Copy size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="p-1 hover:bg-red-600 rounded transition"
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
