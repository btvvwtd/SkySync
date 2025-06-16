import React, { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface ServerFile {
  id: number;
  filename: string;
  filepath: string;
  created_at: string;
  isSelected?: boolean;
  isFavorite?: boolean;
}

interface ReadFileProps {
  file: ServerFile;
  token: string;
  onClose: () => void;
}

const ReadFile: React.FC<ReadFileProps> = ({ file, token, onClose }) => {
  const [content, setContent] = useState<string | null>(null);
  const [pdfImageUrl, setPdfImageUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/${file.filepath}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const blob = await response.blob();
        const contentType = response.headers.get('content-type');
        console.log(`Fetched ${file.filename}, Content-Type: ${contentType}`);

        if (file.filepath.match(/\.(jpg|jpeg|png|svg)$/i)) {
          setContent(URL.createObjectURL(blob));
        } else if (file.filepath.endsWith('.pdf')) {
          await renderPdfAsImage(blob);
        } else if (file.filepath.match(/\.(txt|doc|docx)$/i)) {
          const reader = new FileReader();
          reader.onload = (e) => setContent(e.target?.result as string);
          reader.readAsText(blob);
        } else {
          setContent('Перегляд цього типу файлу не підтримується.');
        }
      } catch (error) {
        console.error('Error loading file content:', error);
        setContent('Не вдалося завантажити вміст файлу.');
      }
    };

    const renderPdfAsImage = async (blob: Blob) => {
      try {
        const url = URL.createObjectURL(blob);
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 }); // Збільшено масштаб для ширшої панелі
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (canvas && context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
          setPdfImageUrl(canvas.toDataURL());
        }
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error rendering PDF:', error);
        setContent('Не вдалося відобразити PDF.');
      }
    };

    loadFileContent();
  }, [file, token]);

  const handleDownload = () => {
    if (content || pdfImageUrl) {
      const link = document.createElement('a');
      link.href = content || pdfImageUrl || '';
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta * 0.1, 0.5), 2));
  };

  return (
    <div className="preview-modal">
      <div className="preview-header">
        <button className="close-preview" onClick={onClose}>
          ×
        </button>
        <div>
          <span className="preview-title">{file.filename}</span>
          <span className="preview-info">PDF - {(new Blob([content || pdfImageUrl || ''], { type: 'application/pdf' }).size / 1024).toFixed(2)} KB</span>
        </div>
        <div className="preview-actions">
          <button className="action-btn">Поділитися</button>
          <button className="action-btn" onClick={handleDownload}>Завантажити</button>
        </div>
      </div>
      <div className="preview-content">
        <style>
          {`--zoom: ${zoom};`}
        </style>
        {content && file.filepath.match(/\.(jpg|jpeg|png|svg)$/i) && (
          <img src={content} alt={file.filename} className="preview-image" />
        )}
        {pdfImageUrl && file.filepath.endsWith('.pdf') && (
          <img src={pdfImageUrl} alt={file.filename} className="preview-image" />
        )}
        {content && file.filepath.match(/\.(txt|doc|docx)$/i) && (
          <div className="text-content">{content}</div>
        )}
        {content && !file.filepath.match(/\.(jpg|jpeg|png|svg|pdf|txt|doc|docx)$/i) && (
          <p>{content}</p>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      <div className="preview-footer">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => handleZoom(-1)}>-</button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button className="zoom-btn" onClick={() => handleZoom(1)}>+</button>
        </div>
      </div>
    </div>
  );
};

export default ReadFile;