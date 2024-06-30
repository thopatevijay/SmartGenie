import React, { useEffect } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';

interface SolidityEditorProps {
    code: string;
    onChange?: (value: string | undefined) => void;
    readOnly?: boolean;
    defaultValue?: string;
}

export const SolidityEditor: React.FC<SolidityEditorProps> = ({ code, onChange, readOnly = false, defaultValue }) => {
    useEffect(() => {
        loader.init().then((monaco) => {
            monaco.languages.registerCompletionItemProvider('sol', {
                provideCompletionItems: (model, position) => {
                    const word = model.getWordUntilPosition(position);
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn,
                    };

                    const suggestions = [
                        {
                            label: '@Genie',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: '// @Genie: ',
                            documentation: 'Use @Genie to add instructions for the Genie to modify the code.',
                            range: range
                        }
                    ];
                    return { suggestions: suggestions };
                }
            });
        });
    }, []);

    return (
        <MonacoEditor
            height="100%"
            defaultLanguage="sol"
            value={code}
            onChange={onChange}
            theme="vs-dark"
            options={{ readOnly }}
            defaultValue={defaultValue}

        />
    );
};
