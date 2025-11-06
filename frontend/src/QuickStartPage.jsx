import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuickStartPage.css";

const QuickStartPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login", "login");
  const goToSignup = () => navigate("/signup", "signup");
  return (
    <div className="quickstart-container">
      <div className="quickstart-header">
        <h1>Quickstart Guide</h1>
        <p>
          Follow these simple steps to start using <strong>Cura AI</strong> — your personalized
          healthcare assistant built with Indian medical data and MIRIAD integration.
        </p>
      </div>

      <div className="steps">
        <div className="step-card">
          <div className="step-number">1</div>
          <h2>Choose Your Mode</h2>
          <p>
            Select <strong>Doctor Mode</strong> for detailed clinical responses, or{" "}
            <strong>Patient Mode</strong> for simplified medical explanations.
          </p>
          <div className="step-actions">
            <button className="mode-btn doctor" onClick={goToSignup}>
              Doctor Mode
            </button>
            <button className="mode-btn patient" onClick={goToSignup}>
              Patient Mode
            </button>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <h2>Start Chatting</h2>
          <p>
            Ask medical questions, upload reports, or describe symptoms — Cura retrieves the
            most relevant and verified medical insights.
          </p>
          <div className="step-actions">
            <button className="action-btn" onClick={goToSignup}>
              Start Chatting
            </button>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <h2>Get AI-Powered Insights</h2>
          <p>
            Receive accurate answers supported by MIRIAD and Indian healthcare datasets,
            tailored for both professionals and patients.
          </p>
          <div className="step-actions">
            <button className="action-btn" onClick={goToSignup}>
              Try Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartPage;