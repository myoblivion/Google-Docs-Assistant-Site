import React from "react";
import "../../src/styles/TermsOfUse.scss"; // Adjust the path as needed
import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <div
      className="terms-of-use"
      style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <Link
        to="/"
        style={{
          marginBottom: "1rem",
          display: "inline-block",
          textDecoration: "none",
          color: "#4285F4",
        }}
      >
        ← Back
      </Link>
      <h1>Terms of Use</h1>
      <p>
        <em>Last updated: [4/9/2025]</em>
      </p>

      <p>
        These Terms of Use ("Terms") govern your access and use of this Service, which is provided solely for research and academic exploration. By using this Service, you agree to comply with these Terms. If you do not agree, please do not use the Service.
      </p>

      <h2>1. Purpose of the Service</h2>
      <p>
        Our Service is designed exclusively for researchers and academic users to explore, analyze, and manage documents using the Google Docs API. Features include:
      </p>
      <ul>
        <li>
          Viewing and managing Google Docs documents.
        </li>
        <li>
          Utilizing an AI Assistant for document analysis, rewriting content, generating citations, and other research-related functions.
        </li>
        <li>
          Accessing writing-assistance tools similar to services like Grammarly to check grammar, style, and clarity.
        </li>
      </ul>

      <h2>2. Data and Privacy</h2>
      <p>
        We respect your privacy. Please note that this Service does not collect, store, or process any personal data. It functions purely as a research tool. Any data you use or input is entirely your responsibility.
      </p>

      <h2>3. Permitted Uses</h2>
      <p>
        You are granted a non-exclusive, non-transferable, revocable license to:
      </p>
      <ul>
        <li>
          Use the Service for academic research or personal exploration.
        </li>
        <li>
          Access and manage your Google Docs documents as facilitated by the Service.
        </li>
        <li>
          Utilize the AI Assistant and writing-assistance features for research-related purposes.
        </li>
      </ul>

      <h2>4. Prohibited Activities</h2>
      <p>
        You agree not to:
      </p>
      <ul>
        <li>
          Reverse engineer, decompile, or disassemble any software or the underlying technology of the Service.
        </li>
        <li>
          Use the Service for any unlawful, harmful, or fraudulent activities.
        </li>
        <li>
          Interfere with or disrupt the operations of the Service or its associated systems.
        </li>
        <li>
          Share or distribute content that infringes on copyrights or the rights of others.
        </li>
      </ul>

      <h2>5. Intellectual Property Rights</h2>
      <p>
        All content and functionalities offered by the Service, including software, text, graphics, logos, and other elements, are owned by or licensed to us. You are granted a license to use the Service solely for its intended research purposes.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without any warranties, whether express or implied. While we strive to ensure the Service operates correctly, we do not guarantee that it will always be uninterrupted, error-free, or secure. Use of the Service is entirely at your own risk.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Under no circumstances shall we be liable for any direct, indirect, incidental, consequential, or punitive damages that may arise from your use of the Service, even if we have been advised of the possibility of such damages.
      </p>

      <h2>8. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Any changes will be posted on this page and become effective immediately upon posting. Your continued use of the Service after any changes signifies your acceptance of the modified Terms.
      </p>

      {/* <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at our discretion, without prior notice, if we determine that you have violated these Terms or engaged in activities that could negatively impact the Service or its users.
      </p> */}

      {/* <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].
      </p> */}

      {/* <h2>11. Contact Information</h2>
      <p>
        If you have any questions or concerns regarding these Terms, please contact us at: [Your Contact Information].
      </p> */}

      <Link
        to="/"
        style={{
          marginTop: "2rem",
          display: "inline-block",
          textDecoration: "none",
          color: "#4285F4",
        }}
      >
        ← Back
      </Link>
    </div>
  );
};

export default TermsOfUse;
