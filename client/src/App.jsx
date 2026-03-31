import { useState, useEffect } from 'react';
import ProjectSidebar from './components/ProjectSidebar';
import MaterialChecklist from './components/MaterialChecklist';
import Calculator from './components/Calculator';
import * as api from './api';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [materials, setMaterials] = useState([]);

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
      setProjects([]);
    }
  };

  const loadMaterials = async (projectId) => {
    try {
      const data = await api.fetchMaterials(projectId);
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load materials:', error);
      setMaterials([]);
    }
  };

  const handleCreateProject = async () => {
    const name = prompt('Enter project name:');
    if (name) {
      const project = await api.createProject(name);
      setProjects([project, ...projects]);
      setSelectedProject(project);
    }
  };

  const handleDeleteProject = async (id) => {
    if (confirm('Delete this project?')) {
      await api.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setMaterials([]);
      }
    }
  };

  const handleDuplicateProject = async (id) => {
    const duplicate = await api.duplicateProject(id);
    setProjects([duplicate, ...projects]);
  };

  const handleAddMaterial = async (data) => {
    const material = await api.createMaterial(data);
    setMaterials([...materials, material]);
  };

  const handleUpdateMaterial = async (id, updates) => {
    const updated = await api.updateMaterial(id, updates);
    setMaterials(materials.map(m => m.id === id ? updated : m));
  };

  const handleDeleteMaterial = async (id) => {
    await api.deleteMaterial(id);
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleSaveTemplate = async (projectId) => {
    const name = prompt('Enter template name:');
    if (name) {
      await api.createTemplate(name, projectId);
      alert('Template saved!');
    }
  };

  const handleAddFromCalculator = async (baseMaterials) => {
    if (!selectedProject) return;
    
    await api.bulkCreateMaterials(
      selectedProject.id,
      baseMaterials.map(m => ({
        name: m.name,
        quantity: m.quantity,
        category: 'Calculated'
      }))
    );
    
    loadMaterials(selectedProject.id);
  };

  return (
    <div className="h-screen flex bg-gray-900" style={{ height: '100vh', display: 'flex', backgroundColor: '#111827' }}>
      {/* Fallback test */}
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        background: '#374151', 
        color: 'white', 
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999
      }}>
        App loaded! Projects: {projects.length}
      </div>
      
      <ProjectSidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelect={setSelectedProject}
        onCreate={handleCreateProject}
        onDelete={handleDeleteProject}
        onDuplicate={handleDuplicateProject}
      />
      
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
  );
}

export default App;
