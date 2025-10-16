import React from "react";

const riddles = [
  { question: "The language that makes websites dynamic without being compiled. " },
  { question: "Uses virtual DOM and components to render UI efficiently. " },
  { question: "A backend-less approach, avoiding endpoints entirely. " },
  { question: "Enables JavaScript to run outside the browser.   " },
  { question: "What developers write to make software work." },
  { question: "Graduates of an institution. " },
  { question: "Not executable, but essential for the browser to understand content." },
  { question: " A short term often used for removing the last element in a stack." },
  { question: " Instructions executed sequentially, often interpreted rather than compiled." },
  { question: "A reusable code collection that doesn’t tell you how to use it. " },
];

const Riddles = () => {
  return (
    <div className="p-4 bg-black mt-16 min-h-screen">
      {/* Header */}
      <div className="relative text-center bg-red-950 text-white py-4 rounded-xl bg-opacity-0 shadow-md">  
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-wide">
          Your Hints to Reach the Treasure's Keys
        </h1>
      </div>

      {/* Riddle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {riddles.map((riddle, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-xl hover:scale-[1.03] transition-transform duration-300"
          >
            {/* Background image */}
            <img
              src="../../../image.jpg"
              alt={`Riddle ${index + 1}`}
              className="w-full h-64 object-cover opacity-60"
            />

            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <h2 className="text-[#1FC8E9] font-extrabold text-lg mb-2">
                Riddle {index + 1}
              </h2>
              <p className="text-white text-sm sm:text-base lg:text-lg font-small leading-snug">
                {riddle.question}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Riddles;