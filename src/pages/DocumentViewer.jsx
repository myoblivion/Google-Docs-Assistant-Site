import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./../styles/DocumentViewer.scss";
import ChatPanel from "../components/ChatPanel";
import axios from "axios";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import AssistantIcon from "@mui/icons-material/Assistant";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import InfoIcon from "@mui/icons-material/Info";
import AiAssistantLogo from "../../public/ai-logo.png";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ErrorIcon from "@mui/material/Button";
import GetAppIcon from "@mui/icons-material/GetApp";

// Start
const DocumentViewer = () => {
  const iframeRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [references, setReferences] = useState([]);
  const [referencePopup, setReferencePopup] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nerResults, setNerResults] = useState([]);
  const [showNERPopup, setShowNERPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [citationInput, setCitationInput] = useState("");
  const [citationStyle, setCitationStyle] = useState("apa");
  const [citationResult, setCitationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // Line 112-144: Modify handleProcessCitation
  // Update handleProcessCitation to force style selection
  const handleProcessCitation = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setCitationResult(null);

      // Always use selected style, only detect if not manually chosen
      let targetStyle = citationStyle;
      if (!citationStyle) {
        const detectionRes = await axios.post(
          "https://5171-13-53-131-146.ngrok-free.app/detect-style",
          { text: citationInput }
        );
        targetStyle = detectionRes.data.detected_style;
        setCitationStyle(targetStyle); // Update UI to show detected style
      }

      const response = await axios.post(
        "https://5171-13-53-131-146.ngrok-free.app/process-citation",
        {
          input: citationInput,
          document_id: id,
          style: targetStyle, // Force use selected/detected style
          existing_refs: references,
        }
      );

      if (response.data.formatted.toLowerCase().includes("anonymous")) {
        setErrorMessage("Could not detect author - using Anonymous");
      }

      setCitationResult(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || "Citation generation failed"
      );
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    const handleIframeLoad = () => {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        iframe.contentDocument.body.style.overflow = "visible";
        iframe.contentDocument.body.style.position = "relative";
        iframe.contentDocument.body.style.minHeight = "100vh";

        // Add CSS after document load
        const style = iframe.contentDocument.createElement("style");
        style.textContent = `
          .grammar-error {
            background: rgba(255,0,0,0.1);
            border-bottom: 2px dashed #ff0000;
            cursor: pointer;
          }
        `;
        iframe.contentDocument.head.appendChild(style);

        // Initial check after load
        handleDocumentAnalysis();
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", handleIframeLoad);
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", handleIframeLoad);
      }
    };
  }, []);
  // useEffect(() => {
  //   const checkGrammar = async () => {
  //     const text = await getDocumentText();
  //     await handleGrammarCheck(text);
  //   };

  //   if (documentInfo) {
  //     checkGrammar();
  //   }
  // }, [documentInfo]);

  // Reference management functions
  const autoRenumberReferences = (text) => {
    let counter = 1;
    return text.replace(/\[(\d+)\]/g, () => `[${counter++}]`);
  };

  const updateDocumentContent = async (newText) => {
    try {
      await axios.patch(
        `https://docs.googleapis.com/v1/documents/${id}`,
        {
          requests: [
            {
              insertText: {
                text: newText,
                location: { index: 1 },
              },
            },
          ],
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (error) {
      console.error("Document update failed:", error);
    }
  };

  const calculatePosition = (offset) => {
    if (!iframeRef.current) return 0;
    const lineHeight = 24;
    return offset * lineHeight;
  };

  const handleReferenceClick = (ref) => {
    console.log("Reference clicked:", ref);
    // Implement reference navigation logic
  };

  const handleAddReference = (position) => {
    const newNumber = references.expected_numbers?.length + 1 || 1;
    const newRef = `[${newNumber}]`;
    console.log("Adding new reference:", newRef);
    // Implement reference insertion logic
  };

  useEffect(() => {
    const fetchDocumentInfo = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/drive/v3/files/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            params: { fields: "webViewLink,name" },
          }
        );
        setDocumentInfo(response.data);
        setDocumentTitle(response.data.name);
      } catch (error) {
        console.error("Error fetching document info:", error);
      }
    };

    const handleLoad = async () => {
      if (user?.token) {
        await fetchDocumentInfo();
        await handleDocumentAnalysis();
      }
    };

    if (user?.token) {
      fetchDocumentInfo();
      handleLoad();
    }
  }, [user, id]);

  const handleRenumberReferences = async () => {
    try {
      const text = await getDocumentText();
      const updatedText = autoRenumberReferences(text);
      await updateDocumentContent(updatedText);
      await handleDocumentAnalysis();
    } catch (error) {
      console.error("Renumbering failed:", error);
    }
  };

  const getDocumentText = async () => {
    try {
      const res = await axios.get(
        `https://docs.googleapis.com/v1/documents/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
          params: { fields: "body(content)" },
        }
      );

      const hasContent = res.data?.body?.content?.some((section) => {
        if (section.paragraph) {
          return section.paragraph.elements?.some((element) => {
            const content = element.textRun?.content?.trim();
            return !!content;
          });
        }
        return false;
      });

      if (!hasContent) {
        console.warn(
          "Document appears to be empty - no meaningful content found"
        );
        throw new Error(
          "The document appears to be empty. Please add some content before analyzing."
        );
      }

      // Robust text extraction with table handling
      const text = res.data.body.content
        .map((section) => {
          if (section.paragraph) {
            return section.paragraph.elements
              ?.map((e) => e.textRun?.content || "")
              .join("");
          }
          if (section.table) {
            return (
              section.table.tableRows
                ?.map(
                  (row) =>
                    row.tableCells
                      ?.map(
                        (cell) =>
                          cell.content
                            ?.map(
                              (c) =>
                                c.paragraph?.elements
                                  ?.map((e) => e.textRun?.content || "")
                                  .join("") || ""
                            )
                            .join("\t") || ""
                      )
                      .join(" | ") || ""
                )
                .join("\n") || ""
            );
          }
          return "";
        })
        .join("\n")
        .replace(/[\n\t]+/g, " ") // Replace newlines and tabs with spaces
        .replace(/\s+/g, " ") // Collapse multiple spaces
        .trim();
      if (!text) {
        throw new Error(
          "Failed to extract meaningful text from document structure"
        );
      }
      return res.data.body.content
        .map((section) => {
          if (section.paragraph) {
            return section.paragraph.elements
              .map((e) => e.textRun?.content || "")
              .join("")
              .replace(/\n/g, "\u200B\n"); // Preserve newlines
          }
          return "";
        })
        .join("\n");
    } catch (error) {
      console.error("Text extraction failed:", error);
      throw error;
    }
  };

  const handleDocumentAnalysis = async () => {
    setIsProcessing(true);
    try {
      const text = await getDocumentText();

      // Final validation with length check
      const wordCount = text.split(/\s+/).length;

      if (wordCount < 10) {
        return;
      }

      const payload = {
        text: text,
        document_id: id,
      };

      // Use allSettled to handle partial successes
      const [refResult, nerResult] = await Promise.allSettled([
        axios.post(
          "https://5171-13-53-131-146.ngrok-free.app/process-references",
          payload
        ),
        axios.post(
          "https://5171-13-53-131-146.ngrok-free.app/process-ner",
          payload
        ),
      ]);

      // Handle reference results
      if (refResult.status === "fulfilled") {
        setReferences(refResult.value.data);
        if (!refResult.value.data.references?.length) {
          console.warn("No reference numbers found in document");
        }
      } else {
        // Special handling for 404 "not found" responses
        if (refResult.reason.response?.status === 404) {
          setReferences({
            references: [],
            expected_numbers: [],
            missing_numbers: [],
          });
          consolel.log(
            "No reference markers found. Add citations using [number] format."
          );
        } else {
          // console.error("Reference analysis failed:", refResult.reason);
          console.log(
            `Reference analysis failed: ${
              refResult.reason.response?.data?.message || "Unknown error"
            }`
          );
        }
      }

      // Handle NER results
      if (nerResult.status === "fulfilled") {
        setNerResults(nerResult.value.data); // Store NER results in state
      } else {
        console.error("Entity recognition failed:", nerResult.reason);
        console.log(
          `Entity recognition failed: ${
            nerResult.reason.response?.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      console.log(`Analysis failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="document-viewer-page">
      <header className="docs-header">
        <div className="header-left">
          <img className="image-logo" src={AiAssistantLogo} alt="Logo" />
          <div className="title-container">
            <h1 className="document-title">{documentTitle}</h1>
          </div>
        </div>

        <div className="header-right">
          <IconButton
            onClick={() => {
              // Create a temporary link element
              const link = document.createElement("a");
              link.href = "/force-html.zip"; // Path relative to public directory
              link.download = "google-docs-assistant-extension.zip"; // Default filename for download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            title="Download Chrome Extension"
          >
            <GetAppIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowCitationModal(true)}
            title="Add Citation"
            className="citation-button"
          >
            <FormatQuoteIcon />
          </IconButton>

          <IconButton onClick={() => setShowChatPanel(!showChatPanel)}>
            <AssistantIcon />
          </IconButton>
          <IconButton
            onClick={() => navigate("/dashboard")}
            title="Go to Dashboard"
          >
            <AppsIcon />
          </IconButton>

          {/* Account Icon - Logout Popup */}
          <div
            className="account-menu-container"
            style={{ position: "relative" }}
          >
            <IconButton
              onClick={(e) => {
                setShowLogoutPopup(!showLogoutPopup);
                e.stopPropagation();
              }}
              title="Account settings"
            >
              <AccountCircleIcon />
            </IconButton>

            {showLogoutPopup && (
              <div
                className="logout-popup"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  zIndex: 10001,
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  padding: "8px 0",
                  minWidth: "120px",
                }}
              >
                <button
                  className="logout-button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    ":hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="main-content">
        <Dialog
          open={showCitationModal}
          onClose={() => setShowCitationModal(false)}
          maxWidth="md"
        >
          <div className="citation-header">
            <DialogTitle className="citation-header">
              <span>Generate Citation</span>
            </DialogTitle>
            <IconButton onClick={() => setShowCitationModal(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <DialogContent dividers>
            <div className="citation-form">
              <TextField
                fullWidth
                variant="outlined"
                label="Enter URL, DOI, or citation text"
                value={citationInput}
                onChange={(e) => setCitationInput(e.target.value)}
                multiline
                rows={3}
              />
              <div className="citation-controls">
                <Select
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value)}
                  className="style-select"
                >
                  <MenuItem value="apa">APA</MenuItem>
                  <MenuItem value="mla">MLA</MenuItem>
                  <MenuItem value="chicago">Chicago</MenuItem>
                  <MenuItem value="ieee">IEEE</MenuItem>
                  <MenuItem value="vancouver">Vancouver</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProcessCitation}
                  disabled={!citationInput.trim()}
                >
                  Generate Citation
                </Button>
              </div>

              {citationResult && (
                <div className="citation-result">
                  <div className="formatted-citation">
                    <label>Formatted Citation:</label>
                    <div className="citation-text">
                      {citationResult.formatted}
                    </div>
                  </div>
                  <div className="citation-actions">
                    <Button
                      variant="outlined"
                      onClick={() =>
                        navigator.clipboard.writeText(citationResult.formatted)
                      }
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="citation-error">
                  <ErrorIcon />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        {references.references?.map((ref, index) => (
          <div
            key={index}
            className="reference-highlight"
            style={{
              top: calculatePosition(ref.start),
              left: calculatePosition(ref.start, "left"),
            }}
            onClick={() => handleReferenceClick(ref)}
          >
            <div className="reference-badge">{ref.text}</div>
          </div>
        ))}
        {referencePopup && (
          <div
            className="reference-popup"
            style={{ left: referencePopup.x, top: referencePopup.y }}
          >
            <h4>Reference [{referencePopup.number}]</h4>
            {referencePopup.suggestions.length > 0 && (
              <div className="reference-warning">
                Missing numbers: {referencePopup.suggestions.join(", ")}
              </div>
            )}
            <button onClick={handleRenumberReferences}>
              Auto-renumber All
            </button>
            <button onClick={() => handleAddReference(referencePopup.number)}>
              Add New Reference
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`https://docs.google.com/document/d/${id}/edit?rm=embedded&widget=true`}
          title="Google Document"
          className="google-docs-iframe"
          allowFullScreen
        />

        {showChatPanel && (
          <div className="side-panel chat-panel">
            <ChatPanel
              documentId={id}
              user={user}
              onClose={() => setShowChatPanel(false)}
            />
          </div>
        )}
      </div>
      <Dialog
        open={showNERPopup}
        onClose={() => setShowNERPopup(false)}
        maxWidth="md"
        fullWidth
        className="ner-popup-modal"
      >
        <DialogTitle className="popup-header">
          <span>Research Entity Analysis</span>
          <IconButton onClick={() => setShowNERPopup(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="entity-popup-content">
          {nerResults.length === 0 ? (
            <div className="no-entities-message">
              <ScienceIcon fontSize="large" />
              <h3>No research entities detected</h3>
              <p>This could be because:</p>
              <ul>
                <li>The document doesn't contain clinical research content</li>
                <li>Entity confidence thresholds weren't met</li>
                <li>Specialized terminology wasn't recognized</li>
              </ul>
              <button onClick={handleDocumentAnalysis}>Retry Analysis</button>
            </div>
          ) : (
            <div className="entity-grid-popup">
              {nerResults.map((entity, index) => (
                <div key={index} className="entity-card-popup">
                  <div className="entity-header-popup">
                    <span
                      className={`entity-type-badge ${entity.type.toLowerCase()}`}
                    >
                      {entity.type}
                    </span>
                    <div className="confidence-meter">
                      <div
                        className="confidence-fill"
                        style={{ width: `${entity.confidence * 100}%` }}
                      />
                      <span className="confidence-percent">
                        {Math.round(entity.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="entity-body-popup">
                    <h4 className="entity-term">{entity.text}</h4>
                    {entity.type === "INTERVENTION" && (
                      <button
                        className="intervention-info-btn"
                        onClick={() => showInterventionDetails(entity)}
                      >
                        <InfoIcon fontSize="small" />
                        <span>Protocol Details</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentViewer;
