import React, { useState } from 'react';
import axios from 'axios';

interface ServerFile {
  id: number;
  filename: string;
  filepath: string;
  created_at: string;
  isSelected?: boolean;
  isFavorite?: boolean;
}

interface FileListProps {
  files: ServerFile[];
  setFiles: React.Dispatch<React.SetStateAction<ServerFile[]>>;
  onPreview: (file: ServerFile) => void;
}

const FileList: React.FC<FileListProps> = ({ files, setFiles, onPreview }) => {
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const toggleMenu = (fileId: string) => {
    setShowMenu(showMenu === fileId ? null : fileId);
  };

  const toggleSelectFile = (fileId: string) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === parseInt(fileId) ? { ...file, isSelected: !file.isSelected } : file
      )
    );
  };

  const toggleFavorite = (fileId: string) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === parseInt(fileId) ? { ...file, isFavorite: !file.isFavorite } : file
      )
    );
  };

  const handleDownloadFile = async (file: ServerFile) => {
    try {
      const response = await axios.get(`http://localhost:8000/files/download/${file.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { filepath, filename } = response.data;
      const a = document.createElement('a');
      a.href = `http://localhost:8000/${filepath}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Помилка при завантаженні файлу');
    }
  };

  const handleShareFile = (file: ServerFile) => {
    navigator.clipboard.writeText(`http://localhost:8000/${file.filepath}`);
    alert(`Посилання на файл ${file.filename} скопійовано в буфер обміну`);
  };

  const handleDeleteFile = async (file: ServerFile) => {
    try {
      await axios.delete(`http://localhost:8000/files/${file.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Помилка при видаленні файлу');
    }
  };

  return (
    <ul className="file-list">
      {files.map((file) => (
        <li key={file.id} className="file-item">
          <input
            type="checkbox"
            checked={file.isSelected}
            onChange={() => toggleSelectFile(file.id.toString())}
          />
          <span
            className="file-name"
            onClick={() => onPreview(file)}
          >
            {file.filename}
          </span>
          <button
            className="favorite-btn"
            onClick={() => toggleFavorite(file.id.toString())}
          >
            {file.isFavorite ? '★' : '☆'}
          </button>
          <span className="file-date">{new Date(file.created_at).toLocaleString()}</span>
          <div className="file-menu">
            <button
              className="menu-toggle"
              onClick={() => toggleMenu(file.id.toString())}
            >
              ⋮
            </button>
            {showMenu === file.id.toString() && (
              <div className="file-menu-dropdown">
                <button onClick={() => handleDownloadFile(file)}>
                  Завантажити
                </button>
                <button onClick={() => handleShareFile(file)}>
                  Поділитися
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteFile(file)}
                >
                  Видалити
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FileList;