/**
 * Image upload utilities for accommodation images
 */

const UPLOAD_DIR = '/uploads/accommodations';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Ongeldig bestandstype. Alleen JPG, PNG en WebP zijn toegestaan.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Bestand is te groot. Maximum grootte is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
export function generateFilename(originalName: string, slug?: string): string {
  const timestamp = Date.now();
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';

  if (slug) {
    return `${timestamp}-${slug}.${ext}`;
  }

  // Sanitize original filename
  const sanitized = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${timestamp}-${sanitized}.${ext}`;
}

/**
 * Save image to server (client-side for now, converts to base64 in localStorage)
 * In production, this would upload to /public/uploads/accommodations/
 */
export async function saveImage(
  file: File,
  slug?: string
): Promise<UploadResult> {
  // Validate file
  const validation = validateImage(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    // For client-side storage, convert to base64
    // In production, you would upload to server via API
    const base64 = await fileToBase64(file);

    // Generate filename
    const filename = generateFilename(file.name, slug);

    // Store in localStorage with filename as key
    const imageData = {
      filename,
      data: base64,
      timestamp: Date.now(),
    };

    localStorage.setItem(`image-${filename}`, JSON.stringify(imageData));

    // Return the URL (for production, this would be /uploads/accommodations/filename)
    return {
      success: true,
      url: `${UPLOAD_DIR}/${filename}`,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Er is een fout opgetreden bij het uploaden van de afbeelding.',
    };
  }
}

/**
 * Convert file to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get image from localStorage by filename
 * This is used to retrieve base64 images stored client-side
 */
export function getImageData(filename: string): string | null {
  const key = `image-${filename.split('/').pop()}`;
  const stored = localStorage.getItem(key);

  if (!stored) return null;

  try {
    const imageData = JSON.parse(stored);
    return imageData.data;
  } catch {
    return null;
  }
}

/**
 * Delete image from localStorage
 */
export function deleteImage(filename: string): void {
  const key = `image-${filename.split('/').pop()}`;
  localStorage.removeItem(key);
}

/**
 * Get all uploaded images
 */
export function getAllImages(): string[] {
  const images: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('image-')) {
      images.push(key.replace('image-', ''));
    }
  }

  return images;
}
