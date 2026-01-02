import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ACCOMMODATIONS_FILE = path.join(DATA_DIR, 'accommodations.json');

export async function getDatabaseAccommodations() {
    try {
        const data = await fs.readFile(ACCOMMODATIONS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading accommodations database:', error);
        return [];
    }
}

export async function saveDatabaseAccommodations(accommodations: any[]) {
    try {
        await fs.writeFile(ACCOMMODATIONS_FILE, JSON.stringify(accommodations, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing accommodations database:', error);
        return false;
    }
}
