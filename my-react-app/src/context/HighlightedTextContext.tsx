  import { createContext, useContext, useState, ReactNode } from "react";

  interface HighlightedTextContextType {
    highlightedTexts: string[];
    addHighlightedText: (text: string) => void;
  }

  const HighlightedTextContext = createContext<HighlightedTextContextType | undefined>(undefined);

  export const HighlightedTextProvider = ({ children }: { children: ReactNode }) => {
    const [highlightedTexts, setHighlightedTexts] = useState<string[]>([]);

    const addHighlightedText = (text: string) => {
      setHighlightedTexts((prev) => [...prev, text]);
    };

    return (
      <HighlightedTextContext.Provider value={{ highlightedTexts, addHighlightedText }}>
        {children}
      </HighlightedTextContext.Provider>
    );
  };

  export const useHighlightedText = () => {
    const context = useContext(HighlightedTextContext);
    if (!context) {
      throw new Error("useHighlightedText must be used within a HighlightedTextProvider");
    }
    return context;
  };
