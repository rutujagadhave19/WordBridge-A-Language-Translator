import React, { useState } from "react";
import "./App.css";
import { TRANSLATE_API_END_POINT } from "./utils/constant.js";
import axios from "axios";
import language from "./utils/data";
import { Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [source, setSource] = useState("en-GB");
  const [target, setTarget] = useState("hi-IN");
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `https://wordbridge-a-language-translator-1.onrender.com`,
        { source, target, text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      let final_response = res.data.translatedText;
      if (!final_response) {
        const msg =
          "Sorry, but we're unable to convert this text at the moment.";
        setTranslation(msg);
        return;
      }

      setTranslation(final_response);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("error in submitHandler", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center h-screen justify-center bg-[url('./assets/6056043.jpg')] bg-cover ">
        <div className="flex items-center justify-center bg-blue-100 text-black w-[400px] h-[80px] rounded-lg shadow-lg">
          <p className="text-xl font-bold">Let's Translate</p>
        </div>

        <div className="flex mt-10 space-x-6">
          <div className="bg-[#AADDF6] h-[300px] w-[400px] p-4 rounded-lg shadow-md flex flex-col items-center text-gray-700  text-lg font-semibold">
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              {Object.entries(language).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <textarea
              className="w-full h-full mt-4"
              name="text"
              placeholder="Write text here"
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div className="bg-[#AADDF6] h-[300px] w-[400px] p-4 rounded-lg shadow-md flex flex-col items-center text-gray-700  text-lg font-semibold">
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              {Object.entries(language).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <textarea
              className="w-full h-full mt-4"
              name="text"
              readOnly={true}
              value={translation}
            ></textarea>
          </div>
        </div>

        {loading ? (
          <button
            onClick={submitHandler}
            className="mt-6 bg-[#ffaa00] flex  text-white px-6 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-[#FF8000]"
          >
            <p className="mr-2">Please Wait...</p>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          </button>
        ) : (
          <button
            onClick={submitHandler}
            className="mt-6  bg-[#ffaa00] text-black px-6 py-3 rounded-lg shadow-md text-lg font-semibold hover:bg-[#FF8000]"
          >
            Translate
          </button>
        )}
      </div>
    </>
  );
}

export default App;
