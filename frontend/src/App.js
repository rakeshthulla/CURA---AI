import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExplorePage from "./ExplorePage";
import ChatPage from "./ChatPage";
import LoginPage from "./LoginPage";
import OverviewPage from "./OverviewPage";
import QuickStartPage from "./QuickStartPage";
import SupportPage from "./SupportPage";
import SignupPage from './SignupPage';
import ForgotPassword from "./ForgotPassword";
import PrivacySettings from "./PrivacySettings";
import TermsOfUse from "./TermsOfUse";
import HelpSupport from "./HelpSupport";
import ResetPassword from "./ResetPassword";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/quickstart" element={<QuickStartPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/privacy" element={<PrivacySettings />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
