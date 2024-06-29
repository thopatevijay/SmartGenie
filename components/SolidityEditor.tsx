import React, { useEffect } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface SolidityEditorProps {
    code: string;
    onChange?: (value: string | undefined) => void;
    readOnly?: boolean;
}

export const SolidityEditor: React.FC<SolidityEditorProps> = ({ code, onChange, readOnly = false }) => {
    useEffect(() => {
        loader.init().then((monaco) => {
            monaco.languages.register({ id: 'sol' });

            monaco.languages.setMonarchTokensProvider('sol', {
                tokenizer: {
                    root: [
                        [/[a-z_$][\w$]*/, 'identifier'],
                        [/[A-Z][\w$]*/, 'type.identifier'],
                        { include: '@whitespace' },
                        [/[{}()\[\]]/, '@brackets'],
                        [/[<>](?!@symbols)/, '@brackets'],
                        [/@symbols/, 'delimiter'],
                        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                        [/\d+/, 'number'],
                        [/[;,.]/, 'delimiter'],
                        [/"([^"\\]|\\.)*$/, 'string.invalid'],
                        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                        [/'[^\\']'/, 'string'],
                        [/'/, 'string.invalid'],
                    ],
                    string: [
                        [/[^\\"]+/, 'string'],
                        [/\\./, 'string.escape.invalid'],
                        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                    ],
                    whitespace: [
                        [/[ \t\r\n]+/, 'white'],
                        [/(\/\*([\s\S]*?)\*\/)/, 'comment'],
                        [/\/\/.*$/, 'comment']
                    ],
                }
            });

            monaco.languages.setLanguageConfiguration('sol', {
                comments: {
                    lineComment: '//',
                    blockComment: ['/*', '*/']
                },
                brackets: [
                    ['{', '}'],
                    ['[', ']'],
                    ['(', ')']
                ],
                autoClosingPairs: [
                    { open: '{', close: '}' },
                    { open: '[', close: ']' },
                    { open: '(', close: ')' },
                    { open: '"', close: '"' },
                    { open: '\'', close: '\'' }
                ],
                surroundingPairs: [
                    { open: '{', close: '}' },
                    { open: '[', close: ']' },
                    { open: '(', close: ')' },
                    { open: '"', close: '"' },
                    { open: '\'', close: '\'' }
                ]
            });

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
                            label: 'pragma',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'pragma solidity ^0.8.0;',
                            documentation: 'Specifies the version of Solidity.',
                            range: range
                        },
                        {
                            label: 'contract',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'contract ${1:ContractName} {\n\t$0\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Defines a new contract.',
                            range: range
                        },
                        {
                            label: 'function',
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            insertText: 'function ${1:functionName}(${2}) public {\n\t$0\n}',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Defines a new function.',
                            range: range
                        },
                        {
                            label: 'msg.sender',
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: 'msg.sender',
                            documentation: 'The sender of the message (current call).',
                            range: range
                        },
                        {
                            label: 'msg.value',
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: 'msg.value',
                            documentation: 'Number of wei sent with the message.',
                            range: range
                        },
                        {
                            label: 'block.timestamp',
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: 'block.timestamp',
                            documentation: 'Current block timestamp as seconds since unix epoch.',
                            range: range
                        },
                        {
                            label: 'block.difficulty',
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: 'block.difficulty',
                            documentation: 'Current block difficulty.',
                            range: range
                        },
                        {
                            label: 'block.number',
                            kind: monaco.languages.CompletionItemKind.Field,
                            insertText: 'block.number',
                            documentation: 'Current block number.',
                            range: range
                        },
                    ];
                    return { suggestions: suggestions };
                }
            });

            monaco.languages.registerHoverProvider('sol', {
                provideHover: (model, position) => {
                    return {
                        contents: [
                            { value: '**Solidity**' },
                            { value: 'Solidity is a contract-oriented, high-level language for implementing smart contracts.' }
                        ]
                    };
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
        />
    );
};
