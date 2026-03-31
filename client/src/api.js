const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function createProject(name) {
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function deleteProject(id) {
  await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
}

export async function duplicateProject(id) {
  const res = await fetch(`${API_URL}/projects/${id}/duplicate`, {
    method: 'POST'
  });
  return res.json();
}

export async function fetchMaterials(projectId) {
  try {
    const res = await fetch(`${API_URL}/materials/projects/${projectId}/materials`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function createMaterial(data) {
  const res = await fetch(`${API_URL}/materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateMaterial(id, data) {
  const res = await fetch(`${API_URL}/materials/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteMaterial(id) {
  await fetch(`${API_URL}/materials/${id}`, { method: 'DELETE' });
}

export async function bulkCreateMaterials(projectId, materials) {
  const res = await fetch(`${API_URL}/materials/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, materials })
  });
  return res.json();
}

export async function fetchTemplates() {
  const res = await fetch(`${API_URL}/templates`);
  return res.json();
}

export async function createTemplate(name, projectId) {
  const res = await fetch(`${API_URL}/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, projectId })
  });
  return res.json();
}

export async function applyTemplate(templateId, projectId) {
  const res = await fetch(`${API_URL}/templates/${templateId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId })
  });
  return res.json();
}

export async function deleteTemplate(id) {
  await fetch(`${API_URL}/templates/${id}`, { method: 'DELETE' });
}

export async function calculate(item, quantity, breakdown = false) {
  const res = await fetch(`${API_URL}/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, quantity, breakdown })
  });
  return res.json();
}
