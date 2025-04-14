// QuestionTypeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface QuestionTypeContextProps {
  selectedTypes: (string | null)[];
  setSelectedTypes: (types: (string | null)[]) => void;
  editedQuestions: string[];
  setEditedQuestions: (questions: string[]) => void;
  requiredQuestions: boolean[];
  setRequiredQuestions: (required: boolean[]) => void;
  followUpQuestions: string[];
  setFollowUpQuestions: (followUps: string[]) => void;
  questionOrder: number[];
  setQuestionOrder: (order: number[]) => void;
  uniqueQuestions: string[];
  setUniqueQuestions: (questions: string[]) => void;
  questionTexts: string[];
  setQuestionTexts: (texts: string[]) => void;
}

const QuestionTypeContext = createContext<QuestionTypeContextProps | undefined>(undefined);

export const QuestionTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTypes, setSelectedTypes] = useState<(string | null)[]>([]);
  const [editedQuestions, setEditedQuestions] = useState<string[]>([]);
  const [requiredQuestions, setRequiredQuestions] = useState<boolean[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [uniqueQuestions, setUniqueQuestions] = useState<string[]>([]);
  const [questionTexts, setQuestionTexts] = useState<string[]>([]);

  return (
    <QuestionTypeContext.Provider
      value={{
        selectedTypes,
        setSelectedTypes,
        editedQuestions,
        setEditedQuestions,
        requiredQuestions,
        setRequiredQuestions,
        followUpQuestions,
        setFollowUpQuestions,
        questionOrder,
        setQuestionOrder,
        uniqueQuestions,
        setUniqueQuestions,
        questionTexts,
        setQuestionTexts,
      }}
    >
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