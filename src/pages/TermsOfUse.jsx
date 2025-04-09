import React from "react";
import "../../src/styles/TermsOfUse.scss"; // Adjust the path as needed
import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <div className="terms-of-use" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
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
      <h1>Terms of Use</h1>
      <p><em>Last updated: [4/9/2025]</em></p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our Service, you agree to be bound by these Terms of Use ("Terms").
        If you do not agree to these Terms, please do not use our Service.
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        Our Service enables you to view and manage Google Docs via integration with the Google Docs API.
        In addition to standard viewing and management tools, our Service includes:
      </p>
      <ul>
        <li>
          An AI Assistant that can analyze documents, generate rewritten content, provide citations, and perform related functions.
        </li>
        <li>
          A writing-assistance extension similar to Grammarly for checking grammar, style, and clarity.
        </li>
      </ul>

      <h2>3. User Accounts and Access</h2>
      <ul>
        <li>
          <strong>Eligibility:</strong> You must be of legal age and have the authority to enter into these Terms.
        </li>
        <li>
          <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password.
          All activities under your account are your responsibility.
        </li>
        <li>
          <strong>Third-Party Services:</strong> When using third-party services like Google Docs, you agree to be bound by their terms and policies.
        </li>
      </ul>

      <h2>4. Permitted Uses</h2>
      <p>
        You are granted a non-exclusive, non-transferable, revocable license to:
      </p>
      <ul>
        <li>Use the Service for personal or internal business purposes.</li>
        <li>Access and manage your Google Docs documents as facilitated by our application.</li>
        <li>Utilize the AI features and writing-assistance tools as provided.</li>
      </ul>

      <h2>5. Prohibited Activities</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Reverse engineer, decompile, or disassemble our software or any underlying technology.</li>
        <li>Use the Service for any unlawful, harmful, or fraudulent activities.</li>
        <li>Attempt to access or interfere with our systems or those of our providers without authorization.</li>
        <li>Share or distribute content that infringes on any copyright or violates the rights of others.</li>
      </ul>

      <h2>6. Intellectual Property Rights</h2>
      <ul>
        <li>
          <strong>Our Content:</strong> All content, including software, text, graphics, logos, and other intellectual property in the Service is owned by or licensed to us.
        </li>
        <li>
          <strong>User Content:</strong> You retain ownership of content you upload or create; however, by using our Service, you grant us a license to use, display, and distribute that content solely for the purpose of operating the Service.
        </li>
      </ul>

      <h2>7. Disclaimers and Limitation of Liability</h2>
      <ul>
        <li>
          <strong>Service "As Is":</strong> The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.
        </li>
        <li>
          <strong>Disclaimers:</strong> We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.
        </li>
        <li>
          <strong>Limitation of Liability:</strong> In no event shall we be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, even if advised of the possibility of such damages.
        </li>
      </ul>

      <h2>8. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold us harmless from any claims, liabilities, damages, losses, or expenses
        arising from your use of the Service or violation of these Terms.
      </p>

      <h2>9. Modifications to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes will be posted on this page and will take effect
        immediately upon posting. Continued use of the Service constitutes acceptance of the modified Terms.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate your access to the Service at our discretion, without notice, for conduct that we believe
        violates these Terms or that may harm other users or our business interests.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising under
        these Terms shall be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
      </p>

      <h2>12. Contact Information</h2>
      <p>
        If you have any questions regarding these Terms, please contact us at: [Your Contact Information].
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

export default TermsOfUse;
