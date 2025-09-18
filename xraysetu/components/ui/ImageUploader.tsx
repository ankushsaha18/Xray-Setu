'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/utils/apiClient';

interface XRayImage {
  file: File;
  preview: string;
}

interface UploadProgressData {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

interface ImageUploaderProps {
  onImageSelect: (image: XRayImage | null) => void;
  onUploadStart?: () => void;
  onUploadProgress?: (data: UploadProgressData) => void;
  onUploadComplete?: (id: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  maxSizeMB?: number;
  showUploadButton?: boolean;
  autoUpload?: boolean;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  className = '',
  maxSizeMB = 10,
  showUploadButton = false,
  autoUpload = false,
  disabled = false
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<XRayImage | null>(null);
  const { isAuthenticatedUser } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    // Validate file type
    const file = acceptedFiles[0];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!file) return;
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    // Check file size (in MB)
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Store the selected image
    const image: XRayImage = {
      file,
      preview: objectUrl
    };
    
    setSelectedImage(image);
    
    // Pass the image to parent component
    onImageSelect(image);

    // Auto upload if enabled
    if (autoUpload && isAuthenticatedUser) {
      handleUpload(image);
    }
  }, [onImageSelect, autoUpload, isAuthenticatedUser, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': []
    },
    maxFiles: 1,
    multiple: false,
    disabled: disabled || isUploading
  });

  const clearImage = () => {
    // Clean up the object URL to avoid memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    
    setPreview(null);
    setError(null);
    setSelectedImage(null);
    onImageSelect(null);
  };

  const handleUpload = async (image: XRayImage) => {
    if (!isAuthenticatedUser || disabled) {
      setError('You must be logged in to upload images');
      return;
    }

    if (!image) {
      setError('No image selected');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // Notify parent of upload start
      onUploadStart?.();
      
      // Update progress to 0%
      onUploadProgress?.({ progress: 0, status: 'uploading', message: 'Starting upload...' });
      
      // Real upload using our unified API client
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('upload_only', 'true'); // Just upload, don't analyze yet
      
      // Use our unified API client to handle the upload
      const response = await apiRequest<{ imageId: string }>({
        endpoint: '/api/upload-scan',
        method: 'POST',
        body: formData,
        formData: true,
        requiresAuth: true
      });
      
      if (response.error) {
        throw response.error;
      }
      
      // Simulate completion since we don't have progress events from fetch
      onUploadProgress?.({ progress: 100, status: 'complete', message: 'Upload complete' });
      
      // Get the image ID from the response and pass it to the parent
      const imageId = response.data?.imageId || `image-${Date.now()}`;
      onUploadComplete?.(imageId);
      
    } catch (err) {
      console.error('Upload error:', err);
      
      const error = err instanceof Error ? err : new Error('Failed to upload image');
      setError(error.message);
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full max-w-[600px] mx-auto ${className}`}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-500 bg-gradient-to-br from-primary-900/30 to-emerald-900/30 shadow-lg'
              : disabled
              ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
              : 'border-gray-600 hover:border-primary-500 bg-gray-800/30 hover:bg-gray-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-primary-900/30">
              <Upload className={`h-10 w-10 ${disabled ? 'text-gray-500' : 'text-primary-400'}`} />
            </div>
            <div className={`${disabled ? 'text-gray-500' : 'text-gray-300'}`}>
              {isDragActive ? (
                <p className="text-xl font-semibold">Drop the X-ray image here...</p>
              ) : (
                <>
                  <p className="text-xl font-semibold">
                    {disabled 
                      ? 'Image uploading is disabled'
                      : 'Drag & drop an X-ray image here'
                    }
                  </p>
                  {!disabled && <p className="text-lg mt-2">or click to select a file</p>}
                </>
              )}
            </div>
            <p className="text-gray-400">
              Supported formats: JPG, JPEG, PNG (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={clearImage}
              disabled={isUploading}
              className="p-2 bg-gray-900/70 hover:bg-gray-900 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-gray-700"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-xl">
            <div className="aspect-square w-full relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="X-ray preview"
                className="w-full h-full object-contain"
              />
              
              {isUploading && (
                <div className="absolute inset-0 bg-gray-900/70 flex flex-col items-center justify-center text-white">
                  <Loader2 className="h-12 w-12 animate-spin mb-3" />
                  <p className="text-lg font-medium">Uploading...</p>
                </div>
              )}
            </div>
          </div>

          {showUploadButton && selectedImage && !isUploading && (
            <button
              onClick={() => handleUpload(selectedImage)}
              className="mt-5 w-full bg-gradient-to-r from-primary-600 to-emerald-600 hover:from-primary-500 hover:to-emerald-500 text-white py-3 px-6 rounded-xl font-medium transition-all shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
              disabled={!isAuthenticatedUser || isUploading}
            >
              <Upload className="h-5 w-5 mr-2" />
              {isAuthenticatedUser ? 'Upload Image for Analysis' : 'Login to Upload'}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-xl">
          <p className="text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;