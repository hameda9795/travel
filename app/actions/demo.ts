'use server';

import { getDatabaseAccommodations } from '@/lib/db';

export async function getDemoData() {
    const data = await getDatabaseAccommodations();
    return data;
}
