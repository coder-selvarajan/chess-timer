import logo from "./logo.svg";
import "./App.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function App() {
  const [timedOut, setTimedOut] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [interval30, setInterval30] = useState(null);
  const [interval1, setInterval1] = useState(null);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [turnSeconds, setTurnSeconds] = useState(59);
  const [player1, setPlayer1] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getOneMinuteTime = (oneMinTarget) => {
    const time = oneMinTarget - Date.now();

    setTurnSeconds(Math.floor((time / 1000) % 60));

    if (Math.floor((time / 1000) % 60) <= 0) {
      clearInterval(interval1);
      setTimedOut(true);
      setTurnSeconds(0);
    }
  };

  const getThirtyMinuteTime = (thirtyMinTarget) => {
    const time = thirtyMinTarget - Date.now();

    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));

    if (
      Math.floor((time / 1000 / 60) % 60) <= 0 &&
      Math.floor((time / 1000) % 60) <= 0
    ) {
      clearInterval(interval30);
      setGameOver(true);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const side1Click = () => {
    if (!player1) {
      return;
    }
    clearInterval(interval1);

    setPlayer1(false);
    setTurnSeconds(59);
    const targetDate = new Date(Date.now() + 60000);
    const id = setInterval(() => getOneMinuteTime(targetDate), 500);
    setInterval1(id);
  };

  const side2Click = () => {
    if (player1) {
      return;
    }
    clearInterval(interval1);

    setPlayer1(true);
    setTurnSeconds(59);
    const targetDate = new Date(Date.now() + 60000);
    const id = setInterval(() => getOneMinuteTime(targetDate), 500);
    setInterval1(id);
  };

  const cancelClick = () => {
    setShow(false);
    clearInterval(interval30);
    clearInterval(interval1);

    setMinutes(30);
    setSeconds(0);
    setTurnSeconds(59);

    setGameStarted(false);
  };
  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
    setTimedOut(false);
    clearInterval(interval1);
    clearInterval(interval30);

    setPlayer1(true);

    const targetDate = new Date(Date.now() + 30 * 60000);
    const id = setInterval(() => getThirtyMinuteTime(targetDate), 1000);
    setInterval30(id);

    //start 1 min
    setPlayer1(true);
    setTurnSeconds(59);
    const dat = new Date(Date.now() + 60000);
    const id2 = setInterval(() => getOneMinuteTime(dat), 1000);
    setInterval1(id2);
  };

  const formatNumber = (num) => {
    if (num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  };

  useEffect(() => {
    if (gameOver || timedOut || !gameStarted) {
      clearInterval(interval1);
      clearInterval(interval30);
    }
    // return () => clearInterval(interval);
  }, [gameStarted, gameOver, timedOut]);

  return (
    <div className='App'>
      <Container>
        <Row
          className={`side1 ${player1 ? "side1On" : "side1Off"}`}
          onClick={side1Click}>
          <Col>
            <div>{player1 ? "00:" + formatNumber(turnSeconds) : "01:00"}</div>
          </Col>
        </Row>
        <Row className='middleSide'>
          <Col>
            <Button variant='warning' size='lg' active>
              {formatNumber(minutes)} : {formatNumber(seconds)}
            </Button>
          </Col>
          <Col>
            <Button variant='outline-danger' size='lg' onClick={handleShow}>
              STOP
            </Button>
          </Col>
        </Row>
        <Row
          className={`side2 ${player1 ? "side2Off" : "side2On"}`}
          onClick={side2Click}>
          <Col>
            <div>{player1 ? "01:00" : "00:" + formatNumber(turnSeconds)}</div>
          </Col>
        </Row>
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Stop Game?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to stop the game?</Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={cancelClick}>
            Yes
          </Button>
          <Button variant='dark' onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      {/* {timedOut && (
        <div className='timeout'>
          <div>
            <span>Time up!</span>
            <br />
            <br />
            <Button variant='primary' size='lg' onClick={cancelClick}>
              Start Over?
            </Button>
            <br />
            <Button variant='light' size='lg' onClick={cancelClick}>
              &nbsp;RESUME?&nbsp;
            </Button>
          </div>
        </div>
      )} */}

      {(!gameStarted || timedOut || gameOver) && (
        <div className='welcome'>
          <div className='wrapperDiv'>
            <span className='title'>
              D4t4 Solutions <br /> Chess Tournament 2022
            </span>
            <br />
            {gameOver && (
              <div>
                <hr />
                <div className='msg'>GAME OVER!</div>
                <hr />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  Start Again
                </Button>
              </div>
            )}
            {timedOut && (
              <div>
                <hr />
                <div className='msg'>Player Timed Out!</div>
                <hr />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  Restart
                </Button>
              </div>
            )}
            {!gameStarted && (
              <div>
                <br />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  Start the Game
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
