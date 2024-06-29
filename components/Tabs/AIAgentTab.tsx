import React from 'react';

interface AIAgentTabProps {
}

export const AIAgentTab: React.FC<AIAgentTabProps> = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-xl mb-4">AI Agent Tab Content</h2>
            <p>This is where the AI Agent functionality would be displayed.</p>
        </div>
    );
};
