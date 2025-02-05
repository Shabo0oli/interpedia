"use client";

import { useState, useEffect } from 'react';

export default function StepsApp() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 indicates the initial page
  const [errorMessage, setErrorMessage] = useState("");
  const [wikiLink, setWikiLink] = useState("");
  const [stepsData, setStepsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const API_KEY = "app-6Hs0TlnpBjz3jl78NoolZYWL"; // Replace with your actual API key

  const handleNextStep = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrorMessage(""); // Clear error message on next step
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      handleNextStep();
    } else {
      setErrorMessage("غلطه غلط غلوطه غلطه. برو دوباره بخون و بیا.");
      setTimeout(() => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
        setErrorMessage(""); // Clear error message after going back
      }, 2000); // 2-second delay before moving back
    }
  };

  const handleStart = async () => {
    setIsLoading(true);
    if (wikiLink.trim() !== "") {
      try {
        const response = await fetch("https://api.dify.ai/v1", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          mode: "cors",
          body: JSON.stringify({
            inputs: { wikipedia_url: wikiLink },
            response_mode: "blocking",
            user: "ShahabKarimi"
          })
        });

        const data_response = await response.json();
        const finalStep = {
          heading: "ایزی ایزی تامام تامام",
          content: "تبریک. با موفقیت تمومش کردی. میتونی بری یه چیز جدید یاد بگیری."
        };
        setStepsData([...data_response.data.outputs.result, finalStep]);
        setCurrentStep(0);
      } catch (error) {
        setErrorMessage("به مشکلی خوردیم. دوباره امتحان کن.");
      }
      finally{
        setIsLoading(false);
      }
    } else {
      setErrorMessage("یه لینک درست بفرست.");
    }
  };

  const handleDone = () => {
    setCurrentStep(-1);
    setWikiLink("");
    setErrorMessage("");
    setStepsData([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-2">
      <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-sm sm:max-w-md text-center">
        {currentStep === -1 ? (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-3">یه لینک ویکیپدیا بده</h1>
            <input
              type="text"
              value={wikiLink}
              onChange={(e) => setWikiLink(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="w-full p-2 mb-3 border rounded-lg shadow-sm text-sm sm:text-base"
              style={{direction: "ltr"}}
            />
            <button
              onClick={handleStart}
              className="w-full py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "لطفاً صبر کنید..." : "تعاملی یاد بگیر!"}
            </button>
            {isLoading && (
              <div className="flex justify-center items-center mt-3">
                <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {errorMessage && (
              <p className="mt-3 text-red-500 text-sm font-semibold">{errorMessage}</p>
            )}
          </div>
        ) : (
          <div>
            {stepsData[currentStep].heading && (
              <h1 className="text-xl sm:text-2xl font-bold mb-3">{stepsData[currentStep].heading}</h1>
            )}
            {stepsData[currentStep].content && (
              <p className="text-base sm:text-lg mb-4">{stepsData[currentStep].content}</p>
            )}

           

            {stepsData[currentStep].question && stepsData[currentStep].options ? (
              <div>
                <p className="mb-3 font-semibold text-sm sm:text-base">{stepsData[currentStep].question}</p>
                {stepsData[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option.isCorrect)}
                    className="w-full py-2 mb-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 text-sm sm:text-base"
                  >
                    {option.answer}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={currentStep === stepsData.length - 1 ? handleDone : handleNextStep}
                className="w-full py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 text-sm sm:text-base"
              >
                {currentStep === stepsData.length - 1 ? "اتمام" : "گام بعدی"}
              </button>
            )}
            
            {errorMessage && (
              <p className="mb-3 text-red-500 text-sm font-semibold">{errorMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}