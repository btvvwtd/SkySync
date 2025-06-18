import React, { useRef } from 'react';
import { createFile } from '../../../api/api.ts';

interface ServerFile {
  id: number;
  filename: string;
  filepath: string;
  created_at: string;
  isSelected?: boolean;
  isFavorite?: boolean;
}

interface FileUploadProps {
  onUpload: (newFiles: ServerFile[]) => void;
  setIsDragging?: (isDragging: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, setIsDragging }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const uploadFileToServer = async (file: File): Promise<ServerFile> => {
    console.log('Token for upload:', token ? `Present: ${token.substring(0, 20)}...` : 'Missing');
    if (!token) {
      console.error('No JWT token found');
      throw new Error('Необхідно увійти в систему');
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    try {
      const response = await createFile(token, file);
      console.log('Upload successful:', response.data);
      return { ...response.data, isSelected: false, isFavorite: false };
    } catch (error: any) {
      console.error('Upload error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging?.(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files.map(f => f.name));

    try {
      const uploadedFiles = await Promise.all(files.map(uploadFileToServer));
      onUpload(uploadedFiles);
    } catch (error) {
      alert('Помилка при завантаженні файлів');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      console.log('Selected files:', files.map(f => f.name));
      try {
        const uploadedFiles = await Promise.all(files.map(uploadFileToServer));
        onUpload(uploadedFiles);
      } catch (error) {
        alert('Помилка при завантаженні файлів');
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        multiple
      />
      <button className="upload-btn" onClick={handleUploadClick}>
        Передати
      </button>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging?.(true);
        }}
        onDragLeave={() => setIsDragging?.(false)}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default FileUpload;