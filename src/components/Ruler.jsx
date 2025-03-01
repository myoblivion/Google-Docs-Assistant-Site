const handleProcessCitation = async () => {
  try {
    const response = await axios.post(
      "https://5171-13-53-131-146.ngrok-free.app/process-citation",
      {
        input: citationInput,
        document_id: id,
        style: citationStyle,
      }
    );

    setCitationResult(response.data);
    setErrorMessage(null);
  } catch (error) {
    setCitationResult(null);
    setErrorMessage(
      error.response?.data?.detail || "Failed to generate citation. Please check your input."
    );
  }
};

const handleInsertCitation = async () => {
  try {
    // Get current document content
    const text = await getDocumentText();
    
    // Create update requests
    const requests = [{
      insertText: {
        text: ` ${citationResult.formatted}`,
        endOfSegmentLocation: { segmentId: "" }, // Appends to end of document
      }
    }];

    await axios.patch(
      `https://docs.googleapis.com/v1/documents/${id}`,
      { requests },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    setShowCitationModal(false);
    handleDocumentAnalysis(); // Refresh document analysis
  } catch (error) {
    setErrorMessage("Failed to insert citation into document");
  }
};