import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface SolidityEditorProps {
    code: string;
    onChange?: (value: string | undefined) => void;
    readOnly?: boolean;
}

export const SolidityEditor: React.FC<SolidityEditorProps> = ({ code, onChange, readOnly = false }) => {
    return (
        <MonacoEditor
            height="100%"
            defaultLanguage="sol"
            value={code}
            onChange={onChange}
            theme="vs-dark"
            options={{ readOnly }}
        />
    );
};
