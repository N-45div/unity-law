import React, { createContext, useState, useContext, ReactNode } from "react";

interface QuestionTypeContextProps {
    firstSelectedType: string | null;
    secondSelectedType: string | null;
    setFirstSelectedType: (type: string | null) => void;
    setSecondSelectedType: (type: string | null) => void;
}

interface QuestionTypeProviderProps {
  children: ReactNode;
}

const QuestionTypeContext = createContext<QuestionTypeContextProps | undefined>(undefined);

export const QuestionTypeProvider: React.FC<QuestionTypeProviderProps> = ({ children }) => {
    // Set default to null
    const [firstSelectedType, setFirstSelectedType] = useState<string | null>(null);
    const [secondSelectedType, setSecondSelectedType] = useState<string | null>(null);

    return (
        <QuestionTypeContext.Provider value={{ firstSelectedType, secondSelectedType, setFirstSelectedType, setSecondSelectedType }}>
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
