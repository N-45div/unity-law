import React, { createContext, useState, useContext, ReactNode } from "react";

interface QuestionTypeContextProps {
    selectedTypes: (string | null)[];
    setSelectedTypes: (types: (string | null)[]) => void;
}

interface QuestionTypeProviderProps {
    children: ReactNode;
}

const QuestionTypeContext = createContext<QuestionTypeContextProps | undefined>(undefined);

export const QuestionTypeProvider: React.FC<QuestionTypeProviderProps> = ({ children }) => {
    const [selectedTypes, setSelectedTypes] = useState<(string | null)[]>([]);

    return (
        <QuestionTypeContext.Provider value={{ selectedTypes, setSelectedTypes }}>
            {children}
        </QuestionTypeContext.Provider>
    );
};

export const useQuestionType = () => {
    const context = useContext(QuestionTypeContext);
    if (!context) {
        throw new Error("useQuestionType must be used within a QuestionTypeProvider");
    }
    return context;
};