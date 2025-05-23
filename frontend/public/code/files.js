async function uploadFile() {
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            alert("File uploaded successfully!");
            loadFiles();
            fileInput.value = '';
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert(`Upload failed: ${error.message}`);
    }
}

async function loadFiles() {
    try {
        const response = await fetch('/files', {
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const files = await response.json();
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        files.forEach(file => {
            const fileItem = createFileItem(file);
            fileList.appendChild(fileItem);
        });
    } catch (error) {
        console.error('Error loading files:', error);
        alert(`Failed to load files: ${error.message}`);
    }
}

function createFileItem(filename) {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.innerHTML = `
        <span class="filename">${filename}</span>
        <div class="file-actions">
            <button class="view-btn">View</button>
            <button class="download-btn">Download</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    li.querySelector('.view-btn').addEventListener('click', () => viewFile(filename));
    li.querySelector('.download-btn').addEventListener('click', () => downloadFile(filename));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteFile(filename));

    return li;
}

function viewFile(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const viewableExtensions = ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'txt', 'csv', 'html', 'htm', 'mp4', 'webm', 'mp3', 'wav', 'ogg'];

    if (viewableExtensions.includes(extension)) {
        const url = `/files/${encodeURIComponent(filename)}`;
        const auth = 'Basic ' + btoa('admin:admin');

        const form = document.createElement('form');
        form.method = 'GET';
        form.action = url;
        form.target = '_blank';

        const authInput = document.createElement('input');
        authInput.type = 'hidden';
        authInput.name = 'Authorization';
        authInput.value = auth;

        form.appendChild(authInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    } else {
        alert('This file type cannot be viewed directly. Please download it.');
    }
}

async function downloadFile(filename) {
    try {
        const response = await fetch(`/files/${encodeURIComponent(filename)}`, {
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download error:', error);
        alert(`Download failed: ${error.message}`);
    }
}

async function deleteFile(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
        const response = await fetch(`/files/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'File deleted successfully') {
            alert('File deleted successfully!');
            loadFiles();
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert(`Delete failed: ${error.message}`);
    }
}
