import React, { useState, useEffect } from "react";

function ChessTimer() {
  const [time, setTime] = useState({ white: 1500, black: 1500 });
  const [intervalId, setIntervalId] = useState(null);

  function startTimer() {
    const id = setInterval(() => {
      setTime((time) => {
        // Decrement the time for the current player
        const newTime = { ...time };
        newTime[time.currentPlayer]--;
        return newTime;
      });
    }, 1000);
    setIntervalId(id);
  }

  function stopTimer() {
    clearInterval(intervalId);
  }

  function togglePlayer() {
    setTime((time) => {
      const newTime = { ...time };
      newTime.currentPlayer =
        time.currentPlayer === "white" ? "black" : "white";
      return newTime;
    });
  }

  return (
    <div>
      <TimeDisplay player='White' time={time.white} />
      <TimeDisplay player='Black' time={time.black} />
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={togglePlayer}>Toggle Player</button>
    </div>
  );
}

function TimeDisplay({ player, time }) {
  return (
    <div>
      {player}: {time}
    </div>
  );
}

export default ChessTimer;
