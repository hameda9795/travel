'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function saveFile(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const originalName = file.name;
        const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';

        // Sanitize filename
        const sanitized = originalName
            .toLowerCase()
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-z0-9]+/g, '-')
            .substring(0, 30);

        const filename = `${timestamp}-${random}-${sanitized}.${ext}`;

        // Ensure directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'content');
        await mkdir(uploadDir, { recursive: true });

        // Save file
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        // Return public URL
        const url = `/uploads/content/${filename}`;
        return { success: true, url };

    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'File save failed' };
    }
}
