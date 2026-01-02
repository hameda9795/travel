/**
 * Content image upload utilities
 */

const UPLOAD_DIR = '/uploads/content';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Validate image file
 */
export function validateContentImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Ongeldig bestandstype. Alleen JPG, PNG, WebP en GIF zijn toegestaan.',
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
export function generateContentFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';

  // Sanitize original filename
  const sanitized = originalName
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-z0-9]+/g, '-') // Replace special chars with dash
    .substring(0, 30); // Limit length

  return `${timestamp}-${random}-${sanitized}.${ext}`;
}

/**
 * Upload content image (client-side simulation)
 * In production, this should call an API endpoint
 */
import { saveFile } from '@/app/actions/upload';

/**
 * Upload content image (server-side storage)
 */
export async function uploadContentImage(file: File): Promise<UploadResult> {
  // Validate file
  const validation = validateContentImage(file);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const result = await saveFile(formData);

    if (result.success && result.url) {
      return {
        success: true,
        url: result.url,
        path: result.url // for compatibility
      }
    } else {
      return {
        success: false,
        error: result.error || 'Upload failed'
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload mislukt',
    };
  }
}

/**
 * Convert file to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get uploaded image from localStorage
 */
export function getUploadedImage(path: string): string | null {
  const storageKey = `upload-${path}`;
  return localStorage.getItem(storageKey);
}

/**
 * Delete uploaded image
 */
export function deleteUploadedImage(path: string): void {
  const storageKey = `upload-${path}`;
  localStorage.removeItem(storageKey);
}
