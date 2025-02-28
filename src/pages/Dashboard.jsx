import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchDocuments, createNewDocument } from "../services/api"; // Add createNewDocument import
import { useNavigate } from "react-router-dom";
import AiAssistantLogo from "../../public/ai-logo.png";
import "./../styles/Dashboard.scss";
import {
  FiFile,
  FiSearch,
  FiPlus,
  FiStar,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const modalRef = useRef(null);
  const [sortBy, setSortBy] = useState("modifiedTime");
  const [activeSection, setActiveSection] = useState("my-drive");

  // Time
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.round((now - date) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };
  const truncateTitle = (title) => {
    const maxLength = 25;
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  useEffect(() => {
    if (documents.length > 0) {
      const filtered = documents.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  useEffect(() => {
    const loadDocuments = async () => {
      if (user?.token) {
        try {
          const docs = await fetchDocuments(user.token, activeSection);
          setDocuments(docs || []);
          setFilteredDocuments(docs || []);
        } catch (error) {
          console.error("Error loading documents:", error);
        }
      }
    };
    loadDocuments();
  }, [user, activeSection]);

  // Add search handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.trim());
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewDocClick = () => setShowNewDocModal(true);
  const handleCloseModal = () => {
    setShowNewDocModal(false);
    setNewDocName("");
  };

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleCloseModal();
      }
    };
    if (showNewDocModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNewDocModal]);

  // Create document handler
  const handleCreateNewDocument = async (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    try {
      if (user?.token) {
        const newDoc = await createNewDocument(user.token, {
          name: newDocName,
          mimeType: "application/vnd.google-apps.document",
        });

        if (newDoc.id) {
          const docs = await fetchDocuments(user.token);
          setDocuments(docs || []);
          handleCloseModal();
          navigate(`/document/${newDoc.id}`);
        }
      }
    } catch (error) {
      console.error("Error creating document:", error);
      handleCloseModal();
    }
  };

  // useEffect(() => {
  //   const loadDocuments = async () => {
  //     if (user?.token) {
  //       try {
  //         const docs = await fetchDocuments(user.token);
  //         setDocuments(docs || []);
  //       } catch (error) {
  //         console.error("Error loading documents:", error);
  //       }
  //     }
  //   };
  //   loadDocuments();
  // }, [user]);

  const handleDocumentClick = (doc) => {
    navigate(`/document/${doc.id}`);
  };
  // Add sorting handler
  const sortDocuments = (docs, sortKey) => {
    return [...docs].sort((a, b) => {
      if (sortKey === "name") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b[sortKey]) - new Date(a[sortKey]);
    });
  };

  // Update filtered documents effect to include sorting
  useEffect(() => {
    if (documents.length > 0) {
      const filtered = documents.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const sorted = sortDocuments(filtered, sortBy);
      setFilteredDocuments(sorted);
    }
  }, [searchQuery, documents, sortBy]);



  // Add document actions
  const toggleStar = async (docId, starred) => {
    try {
      await axios.patch(
        `https://www.googleapis.com/drive/v3/files/${docId}`,
        { starred: !starred },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const docs = await fetchDocuments(user.token, activeSection);
      setDocuments(docs || []);
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const moveToTrash = async (docId, trash) => {
    try {
      await axios.patch(
        `https://www.googleapis.com/drive/v3/files/${docId}`,
        { trashed: !trash },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const docs = await fetchDocuments(user.token, activeSection);
      setDocuments(docs || []);
    } catch (error) {
      console.error("Error moving to trash:", error);
    }
  };

  return (
    <div className="dashboard">
      {showNewDocModal && (
        <div className="modal-overlay">
          <div className="new-doc-modal" ref={modalRef}>
            <div className="modal-header">
              <h3>New Document</h3>
              <button className="close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateNewDocument}>
              <div className="modal-content">
                <input
                  type="text"
                  placeholder="Untitled document"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img
            className="image-logo"
            src={AiAssistantLogo}
            alt="Ai Assistant Logo"
          />
          <div className="brand">AI Google</div>
          <div className="logo">Docs</div>
        </div>

        <div className="sidebar-menu">
          <button className="new-doc-btn" onClick={handleNewDocClick}>
            <FiPlus className="icon" />
            <span>New</span>
          </button>

          <div className="menu-section">
            <div
              className={`menu-item ${
                activeSection === "my-drive" ? "active" : ""
              }`}
              onClick={() => setActiveSection("my-drive")}
            >
              <FiFile className="icon" />
              <span>My Drive</span>
            </div>
            <div
              className={`menu-item ${
                activeSection === "starred" ? "active" : ""
              }`}
              onClick={() => setActiveSection("starred")}
            >
              <FiStar className="icon" />
              <span>Starred</span>
            </div>
            <div
              className={`menu-item ${
                activeSection === "trash" ? "active" : ""
              }`}
              onClick={() => setActiveSection("trash")}
            >
              <FiTrash2 className="icon" />
              <span>Trash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="user-menu" ref={menuRef}>
            <div
              className="profile-circle"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            {showUserMenu && (
              <div className="google-user-menu">
                <div className="user-info">
                  <div className="user-name">{user?.name || "User"}</div>
                  <div className="user-email">{user?.email || "No email"}</div>
                </div>

                <div className="menu-divider"></div>

                <button className="menu-item" onClick={handleLogout}>
                  <span className="material-icons">logout</span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Document Grid */}
        <div className="content-area">
          <div className="content-header">
            <h2>My Drive</h2>
            <div className="sort-options">
              <h5>Sort by:</h5>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="modifiedTime">Last modified</option>
                <option value="name">Name</option>
                <option value="createdTime">Date created</option>
              </select>
            </div>
          </div>

          <div className="document-grid">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  className="document-card"
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="document-thumbnail">
                    <img
                      src={
                        doc.thumbnailLink ||
                        "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png"
                      }
                      alt={doc.name}
                      onError={(e) => {
                        e.target.src =
                          "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png";
                      }}
                    />
                  </div>
                  <div className="document-info">
                    <div className="document-title">
                      {truncateTitle(doc.name)}
                    </div>
                    <div className="document-meta">
                      <span>
                        {doc.createdTime &&
                          `Created: ${formatTime(doc.createdTime)} `}
                      </span>
                      <span>
                        Last modified:
                        {doc.modifiedTime
                          ? formatTime(doc.modifiedTime)
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FiFile className="empty-icon" />
                <p>No documents found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
