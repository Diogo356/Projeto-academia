// src/components/admin/SettingsPanel.jsx
import React, { useState } from 'react';
import SettingsTabs from './SettingsTabs';
import CompanySettings from './CompanySettings';
import AccountManagement from './AccountManagement';

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="space-y-8">
      {/* Tabs de Navegação */}
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conteúdo Dinâmico */}
      {activeTab === 'company' && <CompanySettings />}
      {activeTab === 'accounts' && <AccountManagement />}
    </div>
  );
};

export default SettingsPanel;