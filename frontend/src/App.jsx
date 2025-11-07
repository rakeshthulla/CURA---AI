import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ExplorePage from "./ExplorePage";
import OverviewPage from "./OverviewPage";
import QuickStartPage from "./QuickStartPage";
import SupportPage from "./SupportPage";
import TermsOfUse from "./TermsOfUse";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ChatPage from "./ChatPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/explore" replace />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/quickstart" element={<QuickStartPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="*" element={<Navigate to="/explore" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;