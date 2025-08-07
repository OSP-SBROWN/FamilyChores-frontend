import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Upload, Camera, X, Check, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  personName?: string;
}

export default function PhotoUpload({ currentPhoto, onPhotoChange, personName = 'Person' }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert file to base64 data URL
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await fileToDataURL(file);
      onPhotoChange(dataUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera is not supported on this device. Please use file upload instead.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user' // Front-facing camera
        }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      // Set video stream once video element is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      let message = 'Could not access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          message += 'Please allow camera permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          message += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          message += 'Camera is not supported on this device.';
        } else {
          message += 'Please try using file upload instead.';
        }
      }
      
      alert(message);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    onPhotoChange(dataUrl);
    stopCamera();
  };

  // Remove photo
  const removePhoto = () => {
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="photo">Photo</Label>
      
      {/* Current Photo Display */}
      {currentPhoto && (
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#023047]">Current Photo</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePhoto}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-center">
              <img
                src={currentPhoto}
                alt={`${personName}'s photo`}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera View */}
      {isCameraOpen && (
        <Card className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#023047]">Camera</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopCamera}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-lg bg-gray-100"
              />
              {/* Camera viewfinder overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 border-4 border-white/70 rounded-full shadow-lg">
                  <div className="w-full h-full border-2 border-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-3">
              <Button
                variant="outline"
                onClick={stopCamera}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                className="bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Controls */}
      {!isCameraOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Photo
          </Button>
          
          <Button
            variant="outline"
            onClick={startCamera}
            disabled={isUploading}
            className="w-full"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        </div>
      )}

      {/* Hidden file input with mobile camera support */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user" // Suggests front-facing camera on mobile
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden canvas for photo capture */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Upload an image file or take a photo with your camera. Maximum size: 5MB.
      </p>
    </div>
  );
}
