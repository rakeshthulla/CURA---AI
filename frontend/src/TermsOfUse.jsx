import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SettingsPages.css";

const TermsOfUse = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Terms of Use</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="settings-content">
          <div className="terms-content">
            <div className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Cura AI, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </div>

            <div className="terms-section">
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily use Cura AI for personal, 
                non-commercial transitory viewing only. This is the grant of a license, 
                not a transfer of title.
              </p>
            </div>

            <div className="terms-section">
              <h2>3. Medical Disclaimer</h2>
              <p>
                Cura AI provides health information and AI-powered suggestions for 
                educational purposes only. It is not a substitute for professional medical 
                advice, diagnosis, or treatment.
              </p>
              <ul>
                <li>Always seek the advice of your physician</li>
                <li>Never disregard professional medical advice</li>
                <li>Do not delay seeking medical treatment based on AI suggestions</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>4. User Responsibilities</h2>
              <p>As a user of Cura AI, you agree to:</p>
              <ul>
                <li>Provide accurate information about your health status</li>
                <li>Use the platform responsibly and ethically</li>
                <li>Not misuse the AI suggestions for critical medical decisions</li>
                <li>Maintain the confidentiality of your account</li>
              </ul>
            </div>

            <div className="terms-section">
              <h2>5. Data Privacy</h2>
              <p>
                We are committed to protecting your health data. All information is 
                encrypted and stored securely in compliance with healthcare regulations.
              </p>
            </div>

            <div className="acceptance-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span className="checkmark"></span>
                I have read and agree to the Terms of Use
              </label>
              
              <button 
                className={`btn-primary ${!accepted ? 'disabled' : ''}`}
                disabled={!accepted}
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;