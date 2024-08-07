"use client";
import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { FaUpload } from 'react-icons/fa'; // Icon for upload button

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  const handleUpload = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }
  
    setUploading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Ensure this matches your Cloudinary settings
  
    console.log('Uploading with data:', Array.from(formData.entries())); // Log form data
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorResult = await response.json();
        console.error('Upload error:', errorResult);
        throw new Error('Upload failed. Please try again.');
      }
  
      const result = await response.json();
      setUploadedUrl(result.secure_url);
    } catch (error) {
      setError((error as Error).message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Cloudinary Image</h1>
      
      {/* File Upload Section */}
      <div className="mb-8">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="mb-4 p-2 border rounded" 
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="flex items-center justify-center py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          <FaUpload className="mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Display Uploaded Image */}
      {uploadedUrl && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Uploaded Image</h2>
          <CldImage
            src={uploadedUrl}
            width="500"
            height="500"
            crop="auto"
            alt="Uploaded image"
          />
        </div>
      )}
    </div>
  );
}
