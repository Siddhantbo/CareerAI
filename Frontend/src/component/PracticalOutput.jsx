import { useState } from "react";
import { executeCode } from "../api";

const PracticalOutput = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.error(
        "Error running code:",
        error.message || "Unable to run code"
      );
      alert("An error occurred: " + (error.message || "Unable to run code"));
    } finally {
      setIsLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput(null); // Clear the output state
    setIsError(false); // Reset error state
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      <div className="flex space-x-2 mb-3">
        <button
          className={`font-semibold h-10 px-6 rounded-md transition-all duration-300 shadow-md ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151]"
            }`}
          disabled={isLoading}
          onClick={runCode}
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>

      </div>
      <div
        className={`h-[50vh] lg:h-[75vh] p-4 overflow-y-auto rounded-md border ${isError ? "border-red-500 text-red-400" : "border-[black] relative"
          }`}
      >
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}

        <div>
          <button
            className="absolute flex items-center justify-center gap-3 shadow-md h-10 px-6 rounded-lg m-2 bg-[rgb(46,46,46)] hover:bg-gray-800 bold font-semibold text-sm text-[white] right-0 bottom-0"
            onClick={clearOutput}
          >
            Clear Output
          </button>
        </div>
      </div>

    </div>
  );
};

export default PracticalOutput;