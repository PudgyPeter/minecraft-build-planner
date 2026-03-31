import { useState, useEffect } from 'react';
import ProjectSidebar from './components/ProjectSidebar';
import MaterialChecklist from './components/MaterialChecklist';
import Calculator from './components/Calculator';
import BackupStatus from './components/BackupStatus';
import ProjectDashboard from './components/ProjectDashboard';
import FavoritesPanel from './components/FavoritesPanel';
import ThemeToggle from './components/ThemeToggle';
import { ToastProvider, useToast } from './components/ToastContainer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './hooks/useTheme';
import * as api from './api';

function AppContent() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleTheme } = useTheme();
  const toast = useToast();

  const handleCreateProject = async () => {
    const name = prompt('Enter project name:');
    if (name) {
      try {
        const project = await api.createProject(name);
        setProjects([project, ...projects]);
        setSelectedProject(project);
        toast.success(`Project "${name}" created!`);
      } catch (error) {
        toast.error('Failed to create project');
      }
    }
  };

  // Keyboard shortcuts
  const shortcuts = {
    newProject: {
      key: 'n',
      ctrl: true,
      action: handleCreateProject,
      enabled: !!handleCreateProject
    },
    search: {
      key: 'f',
      ctrl: true,
      action: (query) => setSearchQuery(query || ''),
      enabled: true
    },
    save: {
      key: 's',
      ctrl: true,
      action: () => {
        toast.success('Project saved to backup');
        // Trigger backup save
        fetch('/api/backup/create', { method: 'POST' });
      },
      enabled: true
    },
    toggleTheme: {
      key: 'd',
      ctrl: true,
      action: toggleTheme,
      enabled: !!toggleTheme
    }
  };

  useKeyboardShortcuts(shortcuts);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadMaterials(selectedProject.id);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const data = await api.fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
      setProjects([]);
    }
  };

  const loadMaterials = async (projectId) => {
    try {
      const data = await api.fetchMaterials(projectId);
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load materials:', error);
      toast.error('Failed to load materials');
      setMaterials([]);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Delete this project?')) {
      try {
        await api.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        if (selectedProject?.id === id) {
          setSelectedProject(null);
          setMaterials([]);
        }
        toast.success('Project deleted');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleDuplicateProject = async (id) => {
    try {
      const duplicate = await api.duplicateProject(id);
      setProjects([duplicate, ...projects]);
      toast.success('Project duplicated');
    } catch (error) {
      toast.error('Failed to duplicate project');
    }
  };

  const handleAddMaterial = async (material) => {
    try {
      const newMaterial = await api.createMaterial(material);
      setMaterials([...materials, newMaterial]);
      toast.success(`${material.name} added to project`);
    } catch (error) {
      toast.error('Failed to add material');
    }
  };

  const handleUpdateMaterial = async (id, updates) => {
    try {
      await api.updateMaterial(id, updates);
      setMaterials(materials.map(m => m.id === id ? { ...m, ...updates } : m));
    } catch (error) {
      toast.error('Failed to update material');
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      await api.deleteMaterial(id);
      setMaterials(materials.filter(m => m.id !== id));
      toast.success('Material deleted');
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const handleSaveTemplate = async (projectId) => {
    const name = prompt('Enter template name:');
    if (name) {
      try {
        const project = projects.find(p => p.id === projectId);
        await api.createTemplate({ name, materials: project.materials });
        toast.success(`Template "${name}" saved`);
      } catch (error) {
        toast.error('Failed to save template');
      }
    }
  };

  const handleAddFromCalculator = (materials) => {
    materials.forEach(m => {
      handleAddMaterial({
        projectId: selectedProject.id,
        name: m.name,
        quantity: m.quantity,
        category: 'Calculated'
      });
    });
    
    loadMaterials(selectedProject.id);
    toast.success(`Added ${materials.length} calculated materials`);
  };

  return (
    <div className="min-h-screen w-screen flex bg-gray-900 overflow-hidden">
      <ProjectSidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelect={setSelectedProject}
        onCreate={handleCreateProject}
        onDelete={handleDeleteProject}
        onDuplicate={handleDuplicateProject}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <BackupStatus />
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex">
          {selectedProject ? (
            <>
              <div className="flex-1 flex">
                <MaterialChecklist
                  project={selectedProject}
                  materials={materials}
                  onAdd={handleAddMaterial}
                  onUpdate={handleUpdateMaterial}
                  onDelete={handleDeleteMaterial}
                  onSaveTemplate={handleSaveTemplate}
                />
                
                <Calculator
                  project={selectedProject}
                  onAddToProject={handleAddFromCalculator}
                />
              </div>
              
              <div className="w-80 border-l border-gray-700 p-4">
                <FavoritesPanel 
                  onAddMaterial={handleAddMaterial}
                  onSearch={setSearchQuery}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
              <ProjectDashboard projects={projects} materials={[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
