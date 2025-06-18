import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './utils/Dashboard.css';
import { getFiles } from '../../api/api.ts';
import FileList from './components/FileList.tsx';
import FileUpload from './components/FileUpload.tsx';
import ReadFile from './components/ReadFile.tsx';
import LanguageSelector from '../Login/components/LanguageSelector.tsx';
import { useTranslation } from 'react-i18next';

interface ServerFile {
  id: number;
  filename: string;
  filepath: string;
  created_at: string;
  isSelected?: boolean;
  isFavorite?: boolean;
}

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [isSecondaryCollapsed, setIsSecondaryCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [serverFiles, setServerFiles] = useState<ServerFile[]>([]);
  const [previewFile, setPreviewFile] = useState<ServerFile | null>(null);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Синхронізація activeTab з мовою
  useEffect(() => {
    const defaultTab = t('dashboard.main_menu.home');
    setActiveTab(defaultTab); // Завжди встановлюємо актуальне значення
  }, [i18n.language, t]);

  // Завантаження файлів
  useEffect(() => {
    if (!token) {
      console.error('No JWT token found');
      alert(t('dashboard.errors.no_token'));
      navigate('/login');
      return;
    }
    const fetchFiles = async () => {
      try {
        const response = await getFiles(token);
        setServerFiles(
          response.data.map((file: ServerFile) => ({
            ...file,
            isSelected: false,
            isFavorite: false,
          })),
        );
      } catch (error: any) {
        console.error('Error fetching files:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        if (error.response?.status === 401) {
          alert(t('dashboard.errors.session_expired'));
          navigate('/login');
        } else {
          alert(t('dashboard.errors.fetch_files'));
        }
      }
    };
    fetchFiles();
  }, [token, navigate, t]);

  const handleCreateFolder = () => setShowFolderModal(true);
  const handleFolderSubmit = () => {
    console.log(`Створено папку: ${folderName}`);
    setShowFolderModal(false);
    setFolderName('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    console.log('Drag over detected');
  };

  const handleDragLeave = () => {
    setIsDragging(false);
    console.log('Drag leave detected');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    console.log('Drop detected, files:', e.dataTransfer.files);
  };

  const handleFileUpload = (newFiles: ServerFile[]) => {
    console.log('Files uploaded:', newFiles);
    setServerFiles((prev) => [...prev, ...newFiles]);
  };

  const handlePreviewFile = (file: ServerFile) => setPreviewFile(file);
  const closePreviewPanel = () => setPreviewFile(null);
  const toggleSecondarySidebar = () => setIsSecondaryCollapsed(!isSecondaryCollapsed);
  const toggleAvatarMenu = () => setIsAvatarMenuOpen(!isAvatarMenuOpen);

  // Мемоїзовані меню для стабільності
  const mainMenuItems = useMemo(
    () => [
      { name: t('dashboard.main_menu.home'), icon: './public/dashboard_icons/home.svg' },
      { name: t('dashboard.main_menu.folders'), icon: './public/dashboard_icons/folder.svg' },
    ],
    [t],
  );

  const secondaryMenuItems = useMemo(
    () => [
      {
        name: t('dashboard.secondary_menu.all_files'),
        icon: './public/dashboard_icons/file-folder.svg',
        children: [
          { name: t('dashboard.secondary_menu.photos'), icon: './public/dashboard_icons/image.svg' },
          { name: t('dashboard.secondary_menu.shared'), icon: './public/dashboard_icons/group.svg' },
          { name: t('dashboard.secondary_menu.file_requests'), icon: './public/dashboard_icons/request.svg' },
          { name: t('dashboard.secondary_menu.deleted_files'), icon: './public/dashboard_icons/delete.svg' },
        ],
      },
      {
        name: t('dashboard.secondary_menu.quick_access'),
        icon: null,
        children: [{ name: t('dashboard.secondary_menu.starred'), icon: null }],
      },
    ],
    [t],
  );

  const getSecondaryTitle = () =>
    activeTab === t('dashboard.main_menu.folders') ? t('dashboard.main_menu.folders') : t('dashboard.main_menu.home');

  const filteredSecondaryMenuItems = useMemo(
    () =>
      activeTab === t('dashboard.main_menu.folders')
        ? [{ name: t('dashboard.secondary_menu.all_files'), icon: './public/dashboard_icons/file-folder.svg', children: [] }]
        : secondaryMenuItems,
    [activeTab, t],
  );

  const handleTabClick = (tabName: string) => {
    const isChildItem = secondaryMenuItems.flatMap((item) => item.children || []).some((child) => child.name === tabName);
    if (isChildItem && activeTab !== t('dashboard.main_menu.folders')) {
      setActiveTab(tabName);
    } else {
      setActiveTab(tabName);
    }
  };

  if (!token) return null;

  return (
    <div className={`dashboard-container ${previewFile ? 'preview-open' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <div className="primary-sidebar">
        <div className="logo-container">
          <img src="./public/logo_icons/skysync.svg" alt="Logo" className="logo" />
        </div>
        <div className="main-menu">
          {mainMenuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-btn ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => handleTabClick(item.name)}
            >
              <div className="icon-container">
                <img src={item.icon} alt={item.name} className="menu-icon" />
              </div>
              <span className="menu-label">{item.name}</span>
            </button>
          ))}
        </div>
        <button className="toggle-btn" onClick={toggleSecondarySidebar}>
          <img src="./public/dashboard_icons/change.svg" alt="Toggle menu" />
        </button>
      </div>
      <div className={`secondary-sidebar ${isSecondaryCollapsed ? 'collapsed' : ''}`}>
        <h2 className="section-title secondary-title">{getSecondaryTitle()}</h2>
        {filteredSecondaryMenuItems.map((item) => (
          <div key={item.name} className="submenu-group">
            <div className="submenu-header">
              {item.name === t('dashboard.secondary_menu.quick_access') ? (
                <div className="quick-access-wrapper">
                  <span className="quick-access-text">{item.name}</span>
                  {activeTab !== t('dashboard.main_menu.folders') && (
                    <button className="quick-access-btn" onClick={handleCreateFolder}>
                      <img src="./public/dashboard_icons/plus.svg" alt="Add" className="quick-access-icon" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  className={`submenu-btn parent ${activeTab === item.name ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.name)}
                >
                  {item.icon && (
                    <div className="icon-container">
                      <img src={item.icon} alt={item.name} className="submenu-icon" />
                    </div>
                  )}
                  <span className="submenu-label">{item.name}</span>
                </button>
              )}
            </div>
            {item.children && item.children.length > 0 && (
              <div className="submenu-children">
                {item.children.map((child) => (
                  <button
                    key={child.name}
                    className={`submenu-btn child ${activeTab === child.name ? 'active' : ''}`}
                    onClick={() => handleTabClick(child.name)}
                  >
                    {child.icon && (
                      <div className="icon-container">
                        <img src={child.icon} alt={child.name} className="submenu-icon" />
                      </div>
                    )}
                    <span className="submenu-label">{child.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <main className="main-content">
        <div className="search-container">
          <img src="./public/dashboard_icons/search.svg" alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder={t('dashboard.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className={`invite-btn ${previewFile ? 'preview-open' : ''}`}>
            <img src="./public/dashboard_icons/user.svg" alt="Invite" className="invite-icon" />
            {!previewFile && <span>{t('dashboard.invite_members')}</span>}
          </button>
          <div className="action-buttons">
            <button className="header-btn">
              <img src="./public/dashboard_icons/bell.svg" alt="Notifications" />
            </button>
            <button className="header-btn">
              <img src="./public/dashboard_icons/monitor.svg" alt="Dashboard" />
            </button>
            <button className="header-btn">
              <img src="./public/dashboard_icons/question.svg" alt="Help" />
            </button>
            <button className="header-btn">
              <img src="./public/dashboard_icons/application.svg" alt="Programs" />
            </button>
            <button className="header-btn avatar-btn" onClick={toggleAvatarMenu}>
              <span className="avatar-initials">AD</span>
            </button>
            {isAvatarMenuOpen && (
              <div className="avatar-dropdown">
                <div className="avatar-info">
                  <span>Artur Dmytyshyn</span>
                  <span>arturdmytyshyn@gmail.com</span>
                </div>
                <div className="avatar-options">
                  <button className="avatar-option">{t('dashboard.avatar_options.settings')}</button>
                  <button className="avatar-option">{t('dashboard.avatar_options.account_management')}</button>
                  <button className="avatar-option">{t('dashboard.avatar_options.automation')}</button>
                  <button className="avatar-option">
                    <img src="./public/dashboard_icons/sharecomputer.svg" alt="ForComputer" />
                    {t('dashboard.avatar_options.for_computer')}
                  </button>
                  <button className="avatar-option">
                    <img src="./public/dashboard_icons/next.svg" alt="NextArrow" />
                    {t('dashboard.avatar_options.theme')}
                  </button>
                  <button className="avatar-option">{t('dashboard.avatar_options.logout')}</button>
                  <LanguageSelector />
                  <button className="avatar-option">
                    <img src="./public/dashboard_icons/settingplus.svg" alt="PlusMember" />
                    {t('dashboard.avatar_options.add_team_account')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="content-wrapper">
          <div className="quick-actions">
            <button className="quick-action-btn">
              <img src="./public/dashboard_icons/share.svg" alt="Share" />
              <span>{t('dashboard.quick_actions.share')}</span>
            </button>
            <button className="quick-action-btn" onClick={() => setShowUploadModal(true)}>
              <img src="./public/dashboard_icons/plus.svg" alt="Create" />
              <span>{t('dashboard.quick_actions.create')}</span>
            </button>
            <button className="quick-action-btn" onClick={handleCreateFolder}>
              <img src="./public/dashboard_icons/newfolder.svg" alt="Create Folder" />
              <span>{t('dashboard.quick_actions.create_folder')}</span>
            </button>
            <button className="quick-action-btn">
              <img src="./public/dashboard_icons/copy.svg" alt="Transfer Copy" />
              <span>{t('dashboard.quick_actions.transfer_copy')}</span>
            </button>
            <button className="quick-action-btn">
              <img src="./public/dashboard_icons/export.svg" alt="Share File" />
              <span>{t('dashboard.quick_actions.share_file')}</span>
            </button>
          </div>
          <div className="divider"></div>
          <div className="files-section">
            <div className="second-header">
              <div className="icon-container"></div>
            </div>
            <div className="files-subheader">
              <h3 className="section-subtitle">{t('dashboard.files_section.all_files')}</h3>
              <img src="./public/dashboard_icons/settings.svg" alt="Settings" className="settings-icon" />
            </div>
            <div className="file-tabs">
              <button
                className={`tab-btn ${activeTab === t('dashboard.files_section.recent') ? 'active' : ''}`}
                onClick={() => setActiveTab(t('dashboard.files_section.recent'))}
              >
                <img src="./public/dashboard_icons/reverse.svg" alt="Reserve" className="reserve-icon" />
                {t('dashboard.files_section.recent')}
              </button>
              <button
                className={`tab-btn ${activeTab === t('dashboard.files_section.starred') ? 'active' : ''}`}
                onClick={() => setActiveTab(t('dashboard.files_section.starred'))}
              >
                <img src="./public/dashboard_icons/star.svg" alt="Star" className="star-icon" />
                {t('dashboard.files_section.starred')}
              </button>
            </div>
            <div className={`drop-zone ${isDragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              {serverFiles.length === 0 ? (
                <>
                  <img src="./public/dashboard_icons/folder.svg" alt="Folder" className="drop-zone-icon" />
                  <p className="drop-zone-text">
                    {t('dashboard.drop_zone.text')}{' '}
                    <button className="create-folder-btn" onClick={handleCreateFolder}>
                      {t('dashboard.drop_zone.create_folder')}
                    </button>
                  </p>
                  <FileUpload onUpload={handleFileUpload} setIsDragging={setIsDragging} token={token} />
                </>
              ) : (
                <div className="uploaded-files">
                  <h4>{t('dashboard.uploaded_files')}</h4>
                  <FileList files={serverFiles} setFiles={setServerFiles} onPreview={handlePreviewFile} />
                </div>
              )}
            </div>
          </div>
        </div>
        {previewFile && token && (
          <div className="preview-panel">
            <ReadFile file={previewFile} token={token} onClose={closePreviewPanel} />
          </div>
        )}
      </main>
      {showFolderModal && (
        <div className="modal-overlay" onClick={() => setShowFolderModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{t('dashboard.modals.create_folder.title')}</h3>
            <input
              type="text"
              placeholder={t('dashboard.modals.create_folder.placeholder')}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowFolderModal(false)}>
                {t('dashboard.modals.cancel')}
              </button>
              <button className="modal-btn primary" onClick={handleFolderSubmit}>
                {t('dashboard.modals.create')}
              </button>
            </div>
          </div>
        </div>
      )}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{t('dashboard.modals.upload.title')}</h3>
            <div className="upload-options">
              <FileUpload onUpload={handleFileUpload} setIsDragging={setIsDragging} token={token} />
              <button className="upload-option" onClick={handleCreateFolder}>
                <img src="./public/dashboard_icons/newfolder.svg" alt="Folder" className="option-icon" />
                <span>{t('dashboard.modals.upload.folder')}</span>
              </button>
            </div>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowUploadModal(false)}>
                {t('dashboard.modals.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;