'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getAccommodations } from '@/lib/accommodations';

export default function ExportDataPage() {
    const [jsonOutput, setJsonOutput] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Load data from localStorage (via getAccommodations)
        const data = getAccommodations();
        setJsonOutput(JSON.stringify(data, null, 2));
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Export Data voor Deploy</h1>
                <p className="mb-4 text-gray-600">
                    Kopieer deze data en plak het in het bestand <code>data/accommodations.json</code> in je project.
                    Zo wordt jouw lokale data zichtbaar in de live versie.
                </p>

                <div className="relative">
                    <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        {copied ? 'Gekopieerd!' : 'Kopieer JSON'}
                    </button>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px] border border-gray-300 text-sm">
                        {jsonOutput}
                    </pre>
                </div>
            </div>
        </AdminLayout>
    );
}
