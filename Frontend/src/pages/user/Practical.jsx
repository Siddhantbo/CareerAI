import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "../../component/LanguageSelector";
import { CODE_SNIPPETS } from "../../constants";
import Output from "../../component/PracticalOutput";

const Practical = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const clearCode = () => {
    setValue(""); // Clear the code in the editor
    if (editorRef.current) {
      editorRef.current.setValue(""); // Clear the editor's value
    }
  };

  return (
    <div className="">
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 relative">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
              },
              scrollBeyondLastLine: false,
              overviewRulerLanes: 0,
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
          <button
            className="absolute bottom-0 right-0 flex items-center justify-center gap-3 shadow-md h-10 px-6 rounded-lg m-2 bg-white hover:bg-gray-200 border border-black text-[black] bold font-semibold text-sm"
            onClick={clearCode}
          >
            Clear Code
          </button>
        </div>
        {/* Right Panel */}
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default Practical;