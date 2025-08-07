// Image optimization utilities
export const optimizeImage = (
  canvas: HTMLCanvasElement, 
  maxWidth: number = 200, 
  maxHeight: number = 200, 
  quality: number = 0.7
): string => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Create a new canvas for the optimized image
  const optimizedCanvas = document.createElement('canvas');
  const optimizedCtx = optimizedCanvas.getContext('2d');
  if (!optimizedCtx) return '';

  // Calculate new dimensions maintaining aspect ratio
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = maxWidth;
  let newHeight = maxHeight;

  if (aspectRatio > 1) {
    newHeight = newWidth / aspectRatio;
  } else {
    newWidth = newHeight * aspectRatio;
  }

  // Set canvas size
  optimizedCanvas.width = newWidth;
  optimizedCanvas.height = newHeight;

  // Draw the resized image
  optimizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

  // Convert to optimized data URL
  return optimizedCanvas.toDataURL('image/jpeg', quality);
};

export const optimizeImageFromFile = (
  file: File, 
  maxWidth: number = 200, 
  maxHeight: number = 200, 
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate new dimensions
      const aspectRatio = img.width / img.height;
      let newWidth = maxWidth;
      let newHeight = maxHeight;

      if (aspectRatio > 1) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw and optimize
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(optimizedDataUrl);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};
