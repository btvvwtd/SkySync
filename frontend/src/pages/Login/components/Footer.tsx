import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer style={{
      minHeight: '500px',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      width: '100vw',
      backgroundColor: 'black',
      color: 'white',
      padding: '120px 40px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(150px, 1fr))',
      gap: '50px',
      fontSize: '14px',
      lineHeight: '3',
      boxSizing: 'border-box',
      marginTop: '70px',
    }}>
      <div>
        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.dropbox.title')}</h4>
        <div>{t('login.footer.dropbox.desktop_app')}</div>
        <div>{t('login.footer.dropbox.mobile_app')}</div>
        <div>{t('login.footer.dropbox.integrations')}</div>
        <div>{t('login.footer.dropbox.features')}</div>
        <div>{t('login.footer.dropbox.solutions')}</div>
        <div>{t('login.footer.dropbox.security')}</div>
        <div>{t('login.footer.dropbox.early_access')}</div>
        <div>{t('login.footer.dropbox.templates')}</div>
        <div>{t('login.footer.dropbox.free_tools')}</div>
      </div>
      <div>
        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.products.title')}</h4>
        <div>{t('login.footer.products.plus')}</div>
        <div>{t('login.footer.products.professional')}</div>
        <div>{t('login.footer.products.business')}</div>
        <div>{t('login.footer.products.enterprise')}</div>
        <div>{t('login.footer.products.dash')}</div>
        <div>{t('login.footer.products.reclaim')}</div>
        <div>{t('login.footer.products.sign')}</div>
        <div>{t('login.footer.products.docsend')}</div>
        <div>{t('login.footer.products.plans')}</div>
        <div>{t('login.footer.products.updates')}</div>
      </div>
      <div>
        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.features.title')}</h4>
        <div>{t('login.footer.features.send_large_files')}</div>
        <div>{t('login.footer.features.send_large_videos')}</div>
        <div>{t('login.footer.features.photo_storage')}</div>
        <div>{t('login.footer.features.secure_sharing')}</div>
        <div>{t('login.footer.features.password_manager')}</div>
        <div>{t('login.footer.features.cloud_backup')}</div>
        <div>{t('login.footer.features.pdf_editing')}</div>
        <div>{t('login.footer.features.e_signatures')}</div>
        <div>{t('login.footer.features.pdf_conversion')}</div>
      </div>
      <div>
        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.support.title')}</h4>
        <div>{t('login.footer.support.help_center')}</div>
        <div>{t('login.footer.support.contact_us')}</div>
        <div>{t('login.footer.support.cancel_contract')}</div>
        <div>{t('login.footer.support.privacy_terms')}</div>
        <div>{t('login.footer.support.cookie_policy')}</div>
        <div>{t('login.footer.support.cookie_ccpa')}</div>
        <div>{t('login.footer.support.ai_principles')}</div>
        <div>{t('login.footer.support.sitemap')}</div>
        <div>{t('login.footer.support.cancel_contract')}</div>
        <div>{t('login.footer.support.learning_resources')}</div>
      </div>
      <div>
        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.resources.title')}</h4>
        <div>{t('login.footer.resources.blog')}</div>
        <div>{t('login.footer.resources.customer_stories')}</div>
        <div>{t('login.footer.resources.resource_library')}</div>
        <div>{t('login.footer.resources.developers')}</div>
        <div>{t('login.footer.resources.community_forums')}</div>
        <div>{t('login.footer.resources.referrals')}</div>
        <div>{t('login.footer.resources.reseller_partners')}</div>
        <div>{t('login.footer.resources.integration_partners')}</div>
        <div>{t('login.footer.resources.find_partner')}</div>
      </div>
      <div>
        <h4 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px' }}>{t('login.footer.company.title')}</h4>
        <div>{t('login.footer.company.about_us')}</div>
        <div>{t('login.footer.company.legal_info')}</div>
        <div>{t('login.footer.company.careers')}</div>
        <div>{t('login.footer.company.investor_relations')}</div>
        <div>{t('login.footer.company.our_impact')}</div>
      </div>
      <div style={{
        gridColumn: '',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '30px',
        }}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo_icons/twitter.svg" // Змінено шлях
              alt="Twitter"
              style={{ height: '24px', width: '24px' }}
            />
          </a>
          <a href="https://web.telegram.org/a/" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo_icons/telegram.svg" // Змінено шлях
              alt="Instagram"
              style={{ height: '24px', width: '24px' }}
            />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo_icons/youtube.svg" // Змінено шлях
              alt="YouTube"
              style={{ height: '24px', width: '24px' }}
            />
          </a>
        </div>
        <div style={{
          width: '55%',
          height: '1px',
          backgroundColor: '#333',
        }}></div>
      </div>
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '10px'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
        }}>
          <img
            src="/logo_icons/internet1.svg" // Змінено шлях
            alt="Internet"
            style={{ height: '18px', width: '18px' }}
          />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>{t('login.footer.language')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>^</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;