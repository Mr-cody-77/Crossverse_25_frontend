import React from "react";
// import "./Riddles.css";

const riddles = [
  { question: "Two metal fighters, bold and fast,Clashing hard, will one outlast? Sparks may fly, but strength will score, What’s this battle of bots at war? " },
  { question: "No legs to run, no hands to throw, Yet they chase the ball with a perfect flow. One goal to win, the crowd stands tall, What’s this game of bots and ball ?" },
  { question: "Through the water, swift and true, A bot must race, cutting through.A maze to solve, no time to waste,   What’s this challenge of speed and grace?" },
  { question: "A twisting path beneath the waves, A racer glides, the time it craves. No human hands, just code and speed, What’s this race where bots take the lead?" },
  { question: "Through dirt and dust, we make our mark, With roaring speed, we ignite the spark. Built for the rough, ready to soar,Which team conquers and asks for more?" },
  { question: "Bouncing high on rugged ground, Through mud and rocks, we tear around. Built to endure, wild and free, What’s this beast of off-road speed?" },
  {
    question:
      "A tiny bot, so quick and bright, Through walls and turns, it finds the light. Four big mazes, time runs fast, What’s this race where brains outlast?",
  },
  {
    question:
      "Left or right, which way to go? A thinking bot must always know. Find the path and beat the clock,What’s this game of brain and stock?",
  },
  {
    question:
      "Engines tuned, the race is near, Gears and bolts, no room for fear. Fix, refine, make it right, What’s this stop before the flight?",
  },
  { question: "Where torque meets skill and engines hum, A home for speed, where builders come. Machines are prepped to rule the way,What’s this zone where motors stay?" },
];

const Riddles = () => {
  return (
    <div className="p-4 bg-black mt-16 ">
      <div className=" relative text-center bg-red-950 text-white py-4 rounded-xl bg-opacity-50">  
        <h1 className=" text-2xl lg:text-3xl font-extrabold">
          Your Hints to Reach the Treasure's Keys
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 bg-black">
        {riddles.map((riddle, index) => (
          <div key={index} className=" relative  rounded-xl overflow-hidden ">
            <img
              src="../../../Riddlepng.png"
              alt="Riddle"
              className="w-full  object-center"
            />
            <div className=" absolute top-[15%] lg:top-[25%]  left-0 w-full h-full text-center text-black p-2">
              <p className="text-sm sm:text-xl text-black font-semibold lg:font-bold">
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
