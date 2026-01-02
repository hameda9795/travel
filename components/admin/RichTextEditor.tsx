'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, Palette, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className = '' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Initialize content
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if significantly different to avoid cursor jumps
            // This is a naive check; for production a better diff is needed or just initial load
            if (value === '' && editorRef.current.innerHTML === '<br>') return;
            editorRef.current.innerHTML = value;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            handleInput(); // Trigger update
        }
    };

    const addLink = () => {
        const url = prompt('Voer URL in:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const colors = [
        '#000000', '#4B5563', '#DC2626', '#EA580C', '#D97706',
        '#16A34A', '#2563EB', '#7C3AED', '#DB2777'
    ];

    return (
        <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                <button onClick={() => execCommand('bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Vetgedrukt">
                    <Bold className="w-4 h-4" />
                </button>
                <button onClick={() => execCommand('italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Cursief">
                    <Italic className="w-4 h-4" />
                </button>
                <button onClick={() => execCommand('underline')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Onderstreept">
                    <Underline className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button onClick={() => execCommand('justifyLeft')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Links uitlijnen">
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button onClick={() => execCommand('justifyCenter')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Centreren">
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button onClick={() => execCommand('justifyRight')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Rechts uitlijnen">
                    <AlignRight className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button onClick={() => execCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Opsomming">
                    <List className="w-4 h-4" />
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Genummerde lijst">
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1" />

                <button onClick={addLink} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Link invoegen">
                    <LinkIcon className="w-4 h-4" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-700 relative"
                        title="Tekstkleur"
                    >
                        <Palette className="w-4 h-4" />
                    </button>

                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border border-gray-200 grid grid-cols-5 gap-1 z-50 w-40">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        execCommand('foreColor', color);
                                        setShowColorPicker(false);
                                    }}
                                    className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                className="p-4 min-h-[150px] outline-none max-h-[600px] overflow-y-auto prose prose-sm max-w-none"
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                dangerouslySetInnerHTML={{ __html: value }} // Initial render
            />
        </div>
    );
}
