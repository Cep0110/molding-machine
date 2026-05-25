export const API_BASE = "http://localhost:8000"; // Your Backend URL

export const classifyMaterial = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/predict`, { method: 'POST', body: formData });
  return response.json(); // Returns { material, confidence, recommendedTemp }
};

export const queryKnowledgeBase = async (question: string) => {
  const response = await fetch(`${API_BASE}/rag-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  return response.json(); // Returns { answer, sources }
};
