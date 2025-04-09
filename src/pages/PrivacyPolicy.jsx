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
      <p><em>Last updated: [4/9/2025]</em></p>

      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy describes how [Your Company/Project Name] ("we," "us," or "our")
        collects, uses, and shares information when you use our service, which uses the Google
        Docs API, manages Google Docs and Google Drive documents, and includes features such as
        an AI Assistant for document analysis, rewriting, citation, and a Grammarly-like extension
        (collectively, the "Service"). By using our Service, you agree to the collection and use
        of information in accordance with this policy.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>2.1 Personal Information</h3>
      <p>
        We may collect personal information that you voluntarily provide to us, such as your name,
        email address, and any other information you choose to supply when registering or using the Service.
      </p>

      <h3>2.2 Document Data</h3>
      <p>
        Our Service interacts with Google Docs via the Google Docs API and may access documents stored
        in your Google Drive. The type of data accessed includes:
      </p>
      <ul>
        <li>Document metadata (e.g., title, creation date)</li>
        <li>Content of your Google Docs</li>
        <li>Usage data related to how you interact with the document viewer and editing tools</li>
      </ul>

      <h3>2.3 Usage and Technical Data</h3>
      <p>
        We automatically collect certain information when you use our Service, including:
      </p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Device information</li>
        <li>Access timestamps and usage patterns</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use the collected information for purposes including:
      </p>
      <ul>
        <li>Providing and maintaining our Service</li>
        <li>Allowing you to view and manage Google Docs via our interface</li>
        <li>Enabling AI-driven document analysis, rewriting, and citation features</li>
        <li>Improving our products and services</li>
        <li>Monitoring and analyzing usage trends to improve the Service</li>
        <li>Communicating with you about account or service-related matters</li>
      </ul>

      <h2>4. Data Sharing and Third-Party Services</h2>
      <h3>4.1 Google Services</h3>
      <p>
        Our application integrates with Google Docs and Google Drive. Information accessed via these integrations
        is used solely to provide the Service. For details on how Google handles your data, please review their
        privacy policy at:{" "}
        <a 
          href="https://policies.google.com/privacy" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          https://policies.google.com/privacy
        </a>.
      </p>
      <h3>4.2 Service Providers</h3>
      <p>
        We may share your information with third-party service providers who assist with the operation of our Service
        (e.g., hosting providers, analytics services). These providers are obligated to maintain the confidentiality
        and security of your data.
      </p>
      <h3>4.3 Legal Requirements</h3>
      <p>
        We may disclose your information if required to do so by law or in response to valid requests by public authorities.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures designed to protect your data against unauthorized
        access, loss, or misuse. However, no method of transmission over the Internet or electronic storage is 100% secure.
      </p>

      <h2>6. Retention of Data</h2>
      <p>
        We retain your personal and document data only for as long as is necessary to fulfill the purposes for which
        it was collected, or as required by law.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights regarding your personal data, including:
      </p>
      <ul>
        <li>The right to access and receive a copy of your data</li>
        <li>The right to request correction or deletion of your data</li>
        <li>The right to restrict processing of your data</li>
        <li>The right to object to processing of your data</li>
      </ul>
      <p>
        If you wish to exercise any of these rights, please contact us at: [your contact email].
      </p>

      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
        Privacy Policy on this page. Changes are effective immediately upon posting unless otherwise stated.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at: [Your Contact Information].
      </p>
      
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
