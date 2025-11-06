import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExplorePage.css";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Navigation functions
  const navigateTo = (path, navItem) => {
    setActiveNav(navItem);
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      navigate(path);
      setIsLoading(false);
    }, 300);
  };

  const goToOverview = () => navigateTo("/overview", "overview");
  const goToQuickStart = () => navigateTo("/quickstart", "quickstart");
  const goToDoctorMode = () => navigateTo("/chat?mode=doctor", "doctor");
  const goToPatientMode = () => navigateTo("/chat?mode=patient", "patient");
  const goToSupport = () => navigateTo("/support", "support");
  const goToChat = () => navigateTo("/chat", "chat");
  const goToLogin = () => navigateTo("/login", "login");
  const goToSignup = () => navigateTo("/signup", "signup");

  // Tool descriptions with icons
  const tools = [
    {
      id: 1,
      title: "Ask Cura",
      description: "Chat with Cura for instant AI-driven medical insights.",
      icon: "💬",
      path: "/signup"
    },
    {
      id: 2,
      title: "Analyze Reports",
      description: "Upload reports and get medical interpretations.",
      icon: "📊",
      path: "/analyze"
    },
    {
      id: 3,
      title: "Symptom Checker",
      description: "Describe symptoms for guided suggestions.",
      icon: "🔍",
      path: "/symptoms"
    },
    {
      id: 4,
      title: "Find Specialists",
      description: "Discover doctors for your medical concerns.",
      icon: "👨‍⚕️",
      path: "/specialists"
    }
  ];

  return (
    <div className="explore-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Cura AI</h2>
        <ul className="nav-links">
          {[
            { name: "Overview", action: goToOverview, id: "overview" },
            { name: "Quickstart", action: goToQuickStart, id: "quickstart" },
            { name: "Doctor Mode", action: goToSignup, id: "doctor" },
            { name: "Patient Mode", action: goToSignup, id: "patient" },
            { name: "Support", action: goToSupport, id: "support" }
          ].map((item) => (
            <li
              key={item.id}
              onClick={item.action}
              className={activeNav === item.id ? "active" : ""}
            >
              {item.name}
            </li>
          ))}
        </ul>

        <div className="external-links">
          <h4>External Resources</h4>
          <a href="https://med-miriad.github.io/demo/" target="_blank" rel="noopener noreferrer">
             Miriad Atlas
          </a>
          <a href="https://mokshithaaerram.github.io/CURAAI-ATLAS/" target="_blank" rel="noopener noreferrer">
             Cura AI Atlas
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header with Auth Buttons */}
        <header className="main-header">
          <div className="top-right-buttons">
            <button className="auth-btn login" onClick={goToLogin}>
              Log in
            </button>
            <button className="auth-btn signup" onClick={goToSignup}>
              Sign up
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Cura AI Platform
              <span className="ai-badge">AI-Powered</span>
            </h1>
            <p className="hero-description">
              Cura AI is an Indian-context medical chatbot built on Retrieval-Augmented Generation (RAG),
              inspired by MIRIAD but enhanced with <strong>2500+ Indian medical questions</strong> and 
              real-world healthcare data.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">2,500+</span>
                <span className="stat-label">Medical Q&A</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Available</span>
              </div>
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered</span>
              </div>
            </div>
            <button className="cta-button" onClick={goToSignup}>
              🚀 Get Started Free
            </button>
          </div>
        </section>

        {/* Mode Cards */}
        <section className="modes-section">
          <h2 className="section-title">Explore Modes</h2>
          <div className="mode-cards">
            <div className="mode-card doctor-mode">
              <div className="mode-icon">👨‍⚕️</div>
              <h3>Doctor Mode</h3>
              <p>
                Tailored for healthcare professionals. Access clinical explanations,
                patient summaries, and diagnostic support with medical-grade terminology.
              </p>
              <div className="mode-features">
                <span>Clinical Terminology</span>
                <span>Patient Summaries</span>
                <span>Diagnostic Support</span>
              </div>
              <button className="mode-btn" onClick={goToSignup}>
                Enter Doctor Mode →
              </button>
            </div>

            <div className="mode-card patient-mode">
              <div className="mode-icon">👤</div>
              <h3>Patient Mode</h3>
              <p>
                Simplified AI responses for patients — understand your symptoms, get guided advice,
                and explore possible causes in human-friendly language.
              </p>
              <div className="mode-features">
                <span>Simple Language</span>
                <span>Symptom Guidance</span>
                <span>Easy Explanations</span>
              </div>
              <button className="mode-btn" onClick={goToSignup}>
                Enter Patient Mode →
              </button>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="tools-section">
          <h2 className="section-title">Core Tools</h2>
          <div className="tools-grid">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="tool-card"
                onClick={() => navigateTo(tool.path, tool.title.toLowerCase())}
              >
                <div className="tool-icon">{tool.icon}</div>
                <h4>{tool.title}</h4>
                <p>{tool.description}</p>
                <span className="tool-cta">Try now →</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="main-footer">
          <p>© 2024 Cura AI. Bridging global AI research with Indian healthcare needs.</p>
        </footer>
      </main>
    </div>
  );
};

export default ExplorePage;