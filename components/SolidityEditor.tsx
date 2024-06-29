import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface SolidityEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    readOnly?: boolean;
}

const SolidityEditor: React.FC<SolidityEditorProps> = ({ code, onChange, readOnly = false }) => {
    return (
        <MonacoEditor
            height="40vh"
            defaultLanguage="sol"
            value={code}
            onChange={onChange}
            theme="vs-dark"
            options={{ readOnly }}
        />
    );
};

export default SolidityEditor;
