import axios from "axios";

const API_DRIVE = axios.create({
  baseURL: "https://www.googleapis.com/drive/v3",
});

const API_DOCS = axios.create({
  baseURL: "https://docs.googleapis.com/v1",
});

// Fetch all Google Docs files
// In services/api.js update the fetchDocuments function
export const fetchDocuments = async (token, section = 'my-drive') => {
  try {
    let query = "mimeType='application/vnd.google-apps.document'";
    
    if (section === 'starred') {
      query += " and starred = true and trashed = false";
    } else if (section === 'trash') {
      query += " and trashed = true";
    } else { // For 'my-drive'
      query += " and trashed = false";
    }

    const response = await axios.get("https://www.googleapis.com/drive/v3/files", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        fields: "files(id, name, thumbnailLink, createdTime, modifiedTime, starred, trashed)"
      },
    });
    return response.data.files || [];
  } catch (error) {
    console.error("Error fetching documents:", error.response?.data || error);
    throw error;
  }
};
export const fetchDocumentInfo = async (token, documentId) => {
  const response = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${documentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { fields: "webViewLink,name" }
    }
  );
  return response.data;
};
// Fetch document content including title
export const fetchDocumentContent = async (token, documentId) => {
  try {
    const response = await axios.get(`https://docs.googleapis.com/v1/documents/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
      params: {
        fields: "title,body(content),inlineObjects" // Added title to fields
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching document content:", error.response?.data || error);
    throw error;
  }
};

// Update document including title support
export const updateDocument = async (token, documentId, requests) => {
  try {
    const response = await axios.post(
      `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
      { requests },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; // Return updated document state
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const createNewDocument = async (token, documentData) => {
  try {
    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: documentData.name,
        mimeType: documentData.mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create document");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};