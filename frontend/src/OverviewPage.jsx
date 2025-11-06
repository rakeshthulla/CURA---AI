import React from "react";
import { useNavigate } from "react-router-dom";
import "./OverviewPage.css";

const OverviewPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🇮🇳",
      title: "Indian Medical Context",
      description: "Fine-tuned with 2,500+ Indian medical Q&A pairs for localized healthcare understanding"
    },
    {
      icon: "👨‍⚕️",
      title: "Dual-Mode Interface",
      description: "Switch between technical medical terminology and patient-friendly explanations"
    },
    {
      icon: "🔍",
      title: "RAG Technology",
      description: "Retrieval-Augmented Generation ensures accurate, up-to-date medical information"
    },
    {
      icon: "💬",
      title: "Context-Aware Responses",
      description: "Understands complex medical queries and provides relevant, explainable answers"
    }
  ];

  const technicalSpecs = [
    { label: "Base Model", value: "MIRIAD Research Paper" },
    { label: "Enhanced Dataset", value: "2,500+ Indian Medical Q&A" },
    { label: "Technology", value: "Retrieval-Augmented Generation (RAG)" },
    { label: "Modes", value: "Doctor & Patient" },
    { label: "Medical Domains", value: "Multiple Specialties" },
    { label: "Response Accuracy", value: "Context-Aware Retrieval" }
  ];

  const goToChat = () => navigate("/chat");
  const goToDoctorMode = () => navigate("/chat?mode=doctor");
  const goToPatientMode = () => navigate("/chat?mode=patient");

  return (
    <div className="overview-container">
      {/* Hero Section */}
      <section className="overview-hero">
        <div className="hero-content">
          <div className="badge">AI-Powered Medical Assistant</div>
          <h1>Transforming Healthcare Communication with <span className="gradient-text">Cura AI</span></h1>
          <p className="hero-description">
            Cura AI bridges the gap between medical research and real-world healthcare needs. 
            Built upon the MIRIAD foundation and enhanced with <strong>2,500+ Indian medical questions</strong>, 
            it delivers accurate, context-aware medical insights in both technical and patient-friendly formats.
          </p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={goToChat}>
              Start Chatting
            </button>
            <div className="mode-buttons">
              <button className="mode-btn doctor" onClick={goToDoctorMode}>
                👨‍⚕️ Doctor Mode
              </button>
              <button className="mode-btn patient" onClick={goToPatientMode}>
                👤 Patient Mode
              </button>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="ai-interface-preview">
            <div className="chat-bubble doctor">Medical terminology with clinical accuracy</div>
            <div className="chat-bubble patient">Simple explanations for better understanding</div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="problem-section">
        <h2>The Challenge We Solve</h2>
        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon">📚</div>
            <h3>MIRIAD Limitations</h3>
            <p>While comprehensive, lacked Indian medical context and patient-friendly explanations</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">🌍</div>
            <h3>Localized Healthcare</h3>
            <p>Indian medical scenarios require understanding of local terminology and healthcare systems</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">💬</div>
            <h3>Communication Gap</h3>
            <p>Patients often struggle to understand complex medical terms used by healthcare professionals</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section">
        <h2>How Cura AI Enhances Medical Communication</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="tech-specs-section">
        <h2>Technical Foundation</h2>
        <div className="specs-grid">
          {technicalSpecs.map((spec, index) => (
            <div key={index} className="spec-card">
              <span className="spec-label">{spec.label}</span>
              <span className="spec-value">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="workflow-section">
        <h2>Dual-Mode Intelligence</h2>
        <div className="workflow-cards">
          <div className="workflow-card doctor-workflow">
            <div className="workflow-header">
              <div className="workflow-icon">👨‍⚕️</div>
              <h3>Doctor Mode</h3>
            </div>
            <ul className="workflow-features">
              <li>Technical medical terminology</li>
              <li>Clinical-grade explanations</li>
              <li>Professional documentation style</li>
              <li>Detailed symptom analysis</li>
            </ul>
          </div>
          
          <div className="workflow-card patient-workflow">
            <div className="workflow-header">
              <div className="workflow-icon">👤</div>
              <h3>Patient Mode</h3>
            </div>
            <ul className="workflow-features">
              <li>Simple, easy-to-understand language</li>
              <li>Layman's term explanations</li>
              <li>Empathetic communication style</li>
              <li>Guided health advice</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Experience Smart Medical Communication?</h2>
        <p>Join healthcare professionals and patients using Cura AI for better medical understanding</p>
        <div className="cta-buttons">
          <button className="cta-secondary" onClick={goToDoctorMode}>
            I'm a Healthcare Professional
          </button>
          <button className="cta-secondary" onClick={goToPatientMode}>
            I'm a Patient
          </button>
        </div>
      </section>
    </div>
  );
};

export default OverviewPage;