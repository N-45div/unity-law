import { FaPenToSquare } from "react-icons/fa6";
import { TbSettingsMinus, TbSettingsPlus } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useHighlightedText } from "../context/HighlightedTextContext";
import EmploymentAgreement from "../utils/EmploymentAgreement";

const icons = [
  { icon: <FaPenToSquare />, label: "Edit PlaceHolder" },
  { icon: <TbSettingsMinus />, label: "Small Condition" },
  { icon: <TbSettingsPlus />, label: "Big Condition" },
  { icon: <ImLoop2 />, label: "Loop" },
];

const LevelTwoPart_Two = () => {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { addHighlightedText } = useHighlightedText();

  const handleIconClick = (label: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();

    if (selectedText.startsWith("[") && selectedText.endsWith("]")) {
      const textWithoutBrackets = selectedText.slice(1, -1);

      if (label === "Edit PlaceHolder") {
        if (selectedText.length >= 35) return;
        addHighlightedText(textWithoutBrackets);
        const span = document.createElement("span");
        span.style.backgroundColor = "yellow";
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
      } else if (label === "Small Condition") {
        if (selectedText.length < 35 || selectedText.length > 450) return;
        addHighlightedText(textWithoutBrackets);
        const span = document.createElement("span");
        span.style.backgroundColor = "lightblue";
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
      } else if (label === "Big Condition") {
        if (selectedText.length < 450) return;
        addHighlightedText(textWithoutBrackets);
        const span = document.createElement("span");
        span.style.backgroundColor = "lightgreen";
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);

        // Specific handling for probationary period clause
        const probationClause = "[The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.]";
        if (selectedText === probationClause) {
          // Ensure the question is set to radio type for this specific clause
          addHighlightedText("Probation Period Length"); // Use a key to associate with the clause
        }
      } else if (label === "Loop") {
        addHighlightedText(textWithoutBrackets);
        const span = document.createElement("span");
        span.style.backgroundColor = "yellow";
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-green-100 via-purple-100 to-blue-100">
      <Navbar />
      <div className="flex justify-end px-6 py-3 space-x-6 relative">
        {icons.map(({ icon, label }, index) => (
          <div key={index} className="relative flex items-center">
            <button
              className="p-2 rounded-full bg-lime-300 hover:bg-lime-400 transition-colors duration-200 flex items-center justify-center text-2xl"
              onMouseEnter={() => setTooltip(label)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => handleIconClick(label)}
            >
              {icon}
            </button>
            {tooltip === label && (
              <div className="absolute -left-10 top-full mt-2 px-3 py-1 text-sm text-white bg-gray-800 rounded shadow-md whitespace-nowrap">
                {label}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto mt-12 px-8 pb-16">
        <EmploymentAgreement />
      </div>
    </div>
  );
};

export default LevelTwoPart_Two;