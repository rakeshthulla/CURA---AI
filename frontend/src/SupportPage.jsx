import React, { useState } from "react";
import "./SupportPage.css";

const SupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is Cura AI a replacement for doctors?",
      answer: "No. Cura AI provides AI-assisted insights to help patients and doctors make informed decisions, but it is not a medical professional substitute."
    },
    {
      question: "What dataset is Cura AI trained on?",
      answer: "Cura AI uses a hybrid of the MIRIAD dataset and an Indian medical dataset with 2,500+ localized questions for better regional understanding."
    },
    {
      question: "How does Doctor Mode differ from Patient Mode?",
      answer: "Doctor Mode provides technical medical terminology and clinical explanations, while Patient Mode offers simplified, easy-to-understand language for general users."
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes, we prioritize data security and privacy. All conversations are encrypted and we comply with healthcare data protection standards."
    },
    {
      question: "Can I upload medical reports for analysis?",
      answer: "Yes, Cura AI can analyze medical reports and provide insights. However, always consult with healthcare professionals for final diagnosis."
    },
    {
      question: "What medical specialties does Cura AI cover?",
      answer: "Cura AI covers various specialties including general medicine, cardiology, dermatology, pediatrics, and more through our comprehensive medical database."
    },
    {
      question: "How accurate are the medical responses?",
      answer: "Responses are based on verified medical sources and our enhanced Indian dataset, but always verify critical information with healthcare providers."
    },
    {
      question: "Is Cura AI available in regional languages?",
      answer: "Currently, Cura AI supports English with plans to expand to regional languages in future updates."
    },
    {
      question: "Can healthcare professionals use this for patient education?",
      answer: "Absolutely! Doctor Mode is designed specifically for healthcare professionals to access detailed medical information and explanations."
    },
    {
      question: "What makes Cura AI different from other medical chatbots?",
      answer: "Cura AI combines global medical research (MIRIAD) with localized Indian healthcare data, providing context-aware responses for the Indian population."
    }
  ];

  return (
    <div className="support-container">
      <div className="support-header">
        <h1>Support & Help</h1>
        <p>
          Need help using Cura AI? We're here for you. Check out the FAQs below or reach out
          directly to our support team.
        </p>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-toggle">{activeFaq === index ? '−' : '+'}</span>
              </div>
              {activeFaq === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="contact-section">
        <h2>Contact Support</h2>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <div>
              <p className="contact-label">Email</p>
              <a href="mailto:support@curaai.in">support@curaai.in</a>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕒</span>
            <div>
              <p className="contact-label">Response Time</p>
              <p className="contact-detail">Within 24 hours</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🌐</span>
            <div>
              <p className="contact-label">Documentation</p>
              <a href="#" className="contact-detail">View User Guide</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;