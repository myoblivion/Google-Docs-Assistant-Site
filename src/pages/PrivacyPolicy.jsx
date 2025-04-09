import React from "react";
import { Link } from "react-router-dom";
import "../../src/styles/PrivacyPolicy.scss"; // Adjust the path as needed

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link 
        to="/" 
        style={{ 
          marginBottom: "1rem", 
          display: "inline-block", 
          textDecoration: "none", 
          color: "#4285F4" 
        }}
      >
        ← Back
      </Link>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: 4/9/2025</em></p>

      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy describes how AI Google Assistant operates using the Google Docs API to access,
        display, and interact with documents on Google Docs and Google Drive. Please note that our service does not collect, 
        store, or track any of your personal data. We simply rely on the Google API for document functionality.
      </p>

      <h2>2. Use of Google API</h2>
      <p>
        Our service integrates with Google Docs and Google Drive using the official Google API. The functionality provided 
        (e.g., viewing, editing, and analyzing documents) is entirely dependent on the data accessible through your Google account. 
        We do not store or manage any of this data on our servers.
      </p>

      <h2>3. Data Collected by Google</h2>
      <p>
        While we do not collect any personal or document data, please be aware that certain information (such as document metadata, 
        content, and usage details) is processed through Google’s API. For more details on how Google handles your data, please review 
        their privacy policy at:{" "}
        <a 
          href="https://policies.google.com/privacy" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          https://policies.google.com/privacy
        </a>.
      </p>

      <h2>4. No Local Data Storage</h2>
      <p>
        Our service functions solely as an interface between you and the Google API. We do not collect, store, or share any information 
        on our end. All interactions with your documents remain within the Google ecosystem.
      </p>

      <h2>5. Changes to This Privacy Policy</h2>
      <p>
        We reserve the right to update this Privacy Policy as needed. Any changes will be posted on this page with an updated effective date.
      </p>

      {/* <h2>6. Contact Us</h2>
      <p>
        If you have any questions regarding this Privacy Policy or our use of the Google API, please contact us at: [Your Contact Information].
      </p> */}
      
      <Link 
        to="/" 
        style={{ 
          marginTop: "2rem", 
          display: "inline-block", 
          textDecoration: "none", 
          color: "#4285F4" 
        }}
      >
        ← Back
      </Link>
    </div>
  );
};

export default PrivacyPolicy;
