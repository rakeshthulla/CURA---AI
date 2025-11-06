import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SettingsPages.css";

const HelpSupport = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const faqs = [
    {
      question: "How do I update my health information?",
      answer: "You can update your health information by going to your profile settings and selecting 'Health Profile'. Make sure to save your changes."
    },
    {
      question: "Is my health data secure?",
      answer: "Yes, we use industry-standard encryption and comply with healthcare data protection regulations to keep your information safe."
    },
    {
      question: "How accurate are the AI suggestions?",
      answer: "Our AI provides educational suggestions based on patterns in data. However, always consult with healthcare professionals for medical decisions."
    },
    {
      question: "Can I export my health data?",
      answer: "Yes, you can export your data from the Privacy Settings page in PDF or CSV format."
    },
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. You'll receive an email with instructions to reset your password."
    }
  ];

  const handleInputChange = (e) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your message! We'll get back to you soon.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Help & Support</h1>
          <p>Get help and contact our support team</p>
        </div>

        <div className="settings-content">
          <div className="support-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div 
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {activeFAQ === index ? '−' : '+'}
                    </span>
                  </div>
                  {activeFAQ === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="support-section">
            <h2>Contact Support</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>

          <div className="support-section">
            <h2>Emergency Contact</h2>
            <div className="emergency-info">
              <p>
                <strong>For medical emergencies, please contact:</strong>
              </p>
              <div className="emergency-contacts">
                <div className="contact-item">
                  <span>🚑 Local Emergency Services</span>
                  <strong>911</strong>
                </div>
                <div className="contact-item">
                  <span>🏥 Poison Control</span>
                  <strong>1-800-222-1222</strong>
                </div>
                <div className="contact-item">
                  <span>💊 Your Primary Care Physician</span>
                  <strong>Contact directly</strong>
                </div>
              </div>
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

export default HelpSupport;