import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector.tsx';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '16px 40px',
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'black',
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: 'white',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flex: 1,
      }}>
        <img
          src="./public/logo_icons/skysync.svg"
          alt="SkySync Logo"
          style={{
            height: '30px',
            width: '30px'
          }}
        />
        <span>{t('login.header.brand')}</span>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;