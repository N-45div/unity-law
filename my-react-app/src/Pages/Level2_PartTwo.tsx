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
    const selectedText = range.toString();

    if (selectedText.startsWith("[") && selectedText.endsWith("]")) {
      if (selectedText.length >= 35 && label === "Edit PlaceHolder") {
        return;
      }
      if ((selectedText.length < 35 || selectedText.length > 450) && label === "Small Condition") {
        return;
      }
      if (selectedText.length < 450 && label === "Big Condition") {
        return;
      }
      const textWithoutBrackets = selectedText.slice(1, -1);
      addHighlightedText(textWithoutBrackets);
      let highlightColor = "yellow";
      if (label === "Small Condition") highlightColor = "lightblue";
      if (label === "Big Condition") highlightColor = "lightgreen";
      const span = document.createElement("span");
      span.style.backgroundColor = highlightColor;
      span.textContent = selectedText;

      range.deleteContents();
      range.insertNode(span);
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