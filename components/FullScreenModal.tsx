import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { SolidityEditor } from './SolidityEditor';

interface FullScreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    code: string;
    onChange?: (value: string | undefined) => void;
    defaultValue: string;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({
    isOpen,
    onClose,
    code,
    onChange,
    defaultValue,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-darkbg bg-opacity-95 flex items-center justify-center z-50">
            <div className="relative w-full h-full p-4">
                <button
                    onClick={onClose}
                    className="absolute top-0 right-4 p-2 bg-darkfg text-neon border border-neon rounded-full"
                >
                    <FaTimes size={24} />
                </button>
                <div className="w-full h-full bg-darkfg border border-neon p-4">
                    <SolidityEditor
                        code={code}
                        onChange={onChange}
                        defaultValue={defaultValue}
                    />
                </div>
            </div>
        </div>
    );
};
