import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function App() {
  const STAGE = {
    NotStarted: 1,
    Started: 2,
    Timeout: 3,
    Ended: 4,
    Stopped: 5,
  };
  const PLAYER = {
    One: 1,
    Two: 2,
  };

  const [status, setStatus] = useState(STAGE.NotStarted);
  const [who, setWho] = useState(PLAYER.One);

  const [interval30, setInterval30] = useState(null);
  const [interval1, setInterval1] = useState(null);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [turnSeconds, setTurnSeconds] = useState(59);

  // for modal popup
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getOneMinuteTime = (oneMinTarget) => {
    const time = oneMinTarget - Date.now();

    setTurnSeconds(Math.floor((time / 1000) % 60));

    if (Math.floor((time / 1000) % 60) <= 0) {
      clearInterval(interval1);
      setStatus(STAGE.Timeout);
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
      setStatus(STAGE.Ended);
      setMinutes(0);
      setSeconds(0);
    }
  };

  const side1Click = () => {
    if (who === PLAYER.Two) {
      return;
    }
    clearInterval(interval1);

    setWho(PLAYER.Two);
    setTurnSeconds(59);
    const targetDate = new Date(Date.now() + 60000);
    const id = setInterval(() => getOneMinuteTime(targetDate), 500);
    setInterval1(id);
  };

  const side2Click = () => {
    if (who === PLAYER.One) {
      return;
    }
    clearInterval(interval1);

    setWho(PLAYER.One);
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

    setStatus(STAGE.Stopped);
  };
  const startGame = () => {
    setStatus(STAGE.Started);
    clearInterval(interval1);
    clearInterval(interval30);

    const targetDate = new Date(Date.now() + 30 * 60000);
    const id = setInterval(() => getThirtyMinuteTime(targetDate), 1000);
    setInterval30(id);

    //start 1 min
    setWho(PLAYER.One);
    setTurnSeconds(59);
    const dat = new Date(Date.now() + 60000);
    const id2 = setInterval(() => getOneMinuteTime(dat), 1000);
    setInterval1(id2);
  };

  const continueGame = () => {
    setStatus(STAGE.Started);
    clearInterval(interval1);

    //start 1 min
    setWho(who === PLAYER.One ? PLAYER.Two : PLAYER.One);
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
    if (
      status === STAGE.Stopped ||
      status === STAGE.Ended ||
      status === STAGE.NotStarted
    ) {
      clearInterval(interval1);
      clearInterval(interval30);
    }

    if (status === STAGE.Timeout) {
      clearInterval(interval1);
    }

    // return () => clearInterval(interval);
  }, [status]);

  return (
    <div className='App'>
      <Container>
        <Row
          className={`side1 ${who === PLAYER.One ? "side1On" : "side1Off"}`}
          onClick={side1Click}>
          <Col>
            <div>
              {who === PLAYER.One ? "00:" + formatNumber(turnSeconds) : "01:00"}
            </div>
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
          className={`side2 ${who === PLAYER.One ? "side2Off" : "side2On"}`}
          onClick={side2Click}>
          <Col>
            <div>
              {who === PLAYER.One ? "01:00" : "00:" + formatNumber(turnSeconds)}
            </div>
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

      {status !== STAGE.Started && (
        <div className='welcome'>
          <div className='wrapperDiv'>
            <span className='title'>
              D4t4 Solutions <br /> Chess Tournament 2022
            </span>
            <br />
            {status === STAGE.Ended && (
              <div>
                <hr />
                <div className='msg'>GAME OVER!</div>
                <hr />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  Start Another Game
                </Button>
              </div>
            )}
            {status === STAGE.Timeout && (
              <div>
                <hr />
                <div className='msg'>Player-{who} Timed Out!</div>
                <hr />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  StartOver
                </Button>
                &nbsp; &nbsp;
                <Button variant='warning' size='lg' onClick={continueGame}>
                  Resume
                </Button>
              </div>
            )}
            {status === STAGE.NotStarted && (
              <div>
                <br />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  Start the Game
                </Button>
              </div>
            )}
            {status === STAGE.Stopped && (
              <div>
                <hr />
                <div className='msg'>Game Stopped!</div>
                <hr />
                <br />
                <Button variant='primary' size='lg' onClick={startGame}>
                  Start Another Game
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
