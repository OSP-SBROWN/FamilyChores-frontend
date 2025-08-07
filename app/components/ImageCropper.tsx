import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ZoomIn, ZoomOut, RotateCcw, Check, X } from 'lucide-react';
import { optimizeImage } from '../utils/imageOptimization';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const CANVAS_SIZE = 300;
  const CROP_SIZE = 200; // Size of the circular crop area

  // Initialize canvas when image loads
  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      drawCanvas();
    }
  }, [imageLoaded, scale, position]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Save context
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CROP_SIZE / 2, 0, 2 * Math.PI);
    ctx.clip();

    // Calculate image dimensions and positioning
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;
    let drawWidth = CANVAS_SIZE * scale;
    let drawHeight = CANVAS_SIZE * scale;

    if (imageAspectRatio > 1) {
      drawHeight = drawWidth / imageAspectRatio;
    } else {
      drawWidth = drawHeight * imageAspectRatio;
    }

    const drawX = (CANVAS_SIZE - drawWidth) / 2 + position.x;
    const drawY = (CANVAS_SIZE - drawHeight) / 2 + position.y;

    // Draw image
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    // Restore context
    ctx.restore();

    // Draw crop circle outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CROP_SIZE / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // Add shadow outside crop area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(CANVAS_SIZE / 2, CANVAS_SIZE / 2, CROP_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }, [scale, position, imageLoaded]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };

    // Limit position to reasonable bounds
    const maxOffset = CANVAS_SIZE * scale * 0.5;
    newPosition.x = Math.max(-maxOffset, Math.min(maxOffset, newPosition.x));
    newPosition.y = Math.max(-maxOffset, Math.min(maxOffset, newPosition.y));
    
    setPosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newPosition = {
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    };

    // Limit position to reasonable bounds
    const maxOffset = CANVAS_SIZE * scale * 0.5;
    newPosition.x = Math.max(-maxOffset, Math.min(maxOffset, newPosition.x));
    newPosition.y = Math.max(-maxOffset, Math.min(maxOffset, newPosition.y));
    
    setPosition(newPosition);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCropComplete = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    // Create a new canvas for the final cropped image
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    cropCanvas.width = CROP_SIZE;
    cropCanvas.height = CROP_SIZE;

    // Draw the cropped area
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw the cropped image
    cropCtx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    
    // Create circular clipping path
    cropCtx.beginPath();
    cropCtx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, 2 * Math.PI);
    cropCtx.clip();

    // Calculate image dimensions and positioning for crop
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;
    let drawWidth = CANVAS_SIZE * scale;
    let drawHeight = CANVAS_SIZE * scale;

    if (imageAspectRatio > 1) {
      drawHeight = drawWidth / imageAspectRatio;
    } else {
      drawWidth = drawHeight * imageAspectRatio;
    }

    const drawX = (CANVAS_SIZE - drawWidth) / 2 + position.x;
    const drawY = (CANVAS_SIZE - drawHeight) / 2 + position.y;

    // Adjust for crop canvas
    const cropScale = CROP_SIZE / CANVAS_SIZE;
    const cropDrawX = (drawX - (CANVAS_SIZE - CROP_SIZE) / 2) * cropScale;
    const cropDrawY = (drawY - (CANVAS_SIZE - CROP_SIZE) / 2) * cropScale;

    cropCtx.drawImage(
      image,
      cropDrawX,
      cropDrawY,
      drawWidth * cropScale,
      drawHeight * cropScale
    );

    // Optimize the final image to reduce size
    const optimizedImageUrl = optimizeImage(cropCanvas, 150, 150, 0.8);
    onCropComplete(optimizedImageUrl);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[#023047] mb-2">Crop Your Photo</h3>
          <p className="text-sm text-gray-500">Drag to position, use buttons to zoom</p>
        </div>

        {/* Canvas Container */}
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="border border-gray-300 rounded-lg cursor-move touch-none"
              style={{ 
                width: CANVAS_SIZE, 
                height: CANVAS_SIZE,
                userSelect: 'none',
                touchAction: 'none'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </div>
        </div>

        {/* Hidden image for loading */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Crop source"
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          crossOrigin="anonymous"
        />

        {/* Controls */}
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          Scale: {scale.toFixed(1)}x
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleCropComplete}
            className="flex-1 bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Use Photo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
