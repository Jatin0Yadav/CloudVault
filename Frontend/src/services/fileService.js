import api from "./api";

// ==========================================
// Upload File
// ==========================================

export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// ==========================================
// Get All Files
// ==========================================

export const getMyFiles = async () => {
  const response = await api.get("/files/getAllFiles");

  const data = response.data;

  // Backend returns an array directly
  if (Array.isArray(data)) {
    return data;
  }

  // Backend returns { data: [...] }
  if (Array.isArray(data?.data)) {
    return data.data;
  }

  // Backend returns { files: [...] }
  if (Array.isArray(data?.files)) {
    return data.files;
  }

  // Unexpected response
  console.error("Unexpected files response:", data);

  return [];
};

// ==========================================
// Download File
// ==========================================

export const downloadFile = async (id) => {
  const response = await api.get(`/files/${id}/download`, {
    responseType: "blob",
  });

  return response;
};

// ==========================================
// Rename File
// ==========================================

export const renameFile = async (id, newName) => {
  const response = await api.put(`/files/${id}/rename`, {
    newName: newName,
  });

  return response.data;
};

// ==========================================
// Delete File
// ==========================================

export const deleteFile = async (id) => {
  const response = await api.get(`/files/${id}/delete`);

  return response.data;
};

// ==========================================
// Search Files
// ==========================================

export const searchFiles = async (keyword) => {
  const response = await api.get("/files/search", {
    params: {
      keyword: keyword,
    },
  });

  return response.data;
};
