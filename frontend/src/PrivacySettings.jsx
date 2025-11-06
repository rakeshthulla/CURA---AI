import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SettingsPages.css";

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: true,
    marketingEmails: false,
    showOnlineStatus: true,
    profileVisibility: "public"
  });

  const handleToggle = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSelectChange = (e) => {
    setPrivacySettings(prev => ({
      ...prev,
      profileVisibility: e.target.value
    }));
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Privacy Settings</h1>
          <p>Manage your privacy preferences and data settings</p>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h2>Data & Privacy</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Data Collection</h3>
                <p>Allow us to collect usage data to improve our services</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.dataCollection}
                  onChange={() => handleToggle("dataCollection")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Analytics</h3>
                <p>Help us understand how you use our platform</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.analytics}
                  onChange={() => handleToggle("analytics")}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Marketing Emails</h3>
                <p>Receive updates about new features and promotions</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.marketingEmails}
                  onChange={() => handleToggle("marketingEmails")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h2>Profile Visibility</h2>
            <div className="setting-item">
              <div className="setting-info">
                <h3>Profile Privacy</h3>
                <p>Control who can see your profile information</p>
              </div>
              <select 
                value={privacySettings.profileVisibility}
                onChange={handleSelectChange}
                className="settings-select"
              >
                <option value="public">Public</option>
                <option value="contacts">Contacts Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h3>Online Status</h3>
                <p>Show when you're active on the platform</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacySettings.showOnlineStatus}
                  onChange={() => handleToggle("showOnlineStatus")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h2>Data Management</h2>
            <div className="action-buttons">
              <button className="btn-secondary">Export My Data</button>
              <button className="btn-danger">Delete Account</button>
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

export default PrivacySettings;