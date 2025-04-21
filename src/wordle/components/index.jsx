import React, { use, useCallback, useEffect, useState } from "react";
import { Container, Button, Modal, Form, Row, Col, InputGroup, ListGroup } from "react-bootstrap";

import { WORD_LENGTH, ALPHABETS, LINK } from '../constants';
import { useWordleSolver, useGuesses } from '../hooks'

import EasterEgg from "./EasterEgg";

import 'bootstrap/dist/css/bootstrap.min.css';


const DisplayWord = ({ wordState, getCharClickHandler }) => {
  console.debug('DisplayWord rendered')

  const getButtonStyle = (charState) => {
    return {
      // backgroundColor: charState.color,
      // borderStyle: 'solid',
      borderWidth: '0px',
      // borderColor: charState.borderColor,
      // color: 'black',
      height: '50px',
      width: '50px',
      margin: '2px',
      fontWeight: 'bold'
    }
  }

  return (
    <div>
      {
        wordState.chars.map(({ char, state }, charIndex) => (
          <Button variant={state.bootstrapVariant} 
            style={getButtonStyle(state)}
            key={charIndex}
            onClick={getCharClickHandler(charIndex)}
          >
            {char.toUpperCase()}
          </Button>
        ))
      }
    </div>
  )
}

const WordsSuggestionList = ({ isVisible, onHide, wordList, onWordSelect }) => {
  console.debug('WordsSuggestionList rendered')

  const [filterQuery, setFilterQuery] = useState('')
  wordList = wordList.filter(word => {
    const lowerWord = word.toLowerCase();
    const query = filterQuery.toLowerCase();
    if (query.includes(" ")) {
      // Replace each space with a regex that matches exactly one alphabet character.
      const pattern = query
        .split('')
        .map(ch => ch === ' ' ? '[a-z]' : ch)
        .join('');
      const regex = new RegExp(pattern);
      return regex.test(lowerWord);
    }
    return lowerWord.includes(query);
  })

  return (
    <Modal show={isVisible} onHide={onHide} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Suggestions</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center bg-light" >
        <ListGroup variant="flush">
          {wordList.map((word, si) => <Button variant="light" onClick={() => onWordSelect(word)} key={si}>{word}</Button>)}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Form.Control type="text" size="md" value={filterQuery} onChange={(e) => {
          e.preventDefault()
          setFilterQuery(e.target.value)
        }} placeholder="Filter list (add <space> for wildcard character match)" />
      </Modal.Footer>
    </Modal>
  )
}


const WordleContainer = () => {
  console.debug('WordleContainer rendered')

  const [userMessage, setUserMessage] = useState('Make your first guess on Wordle')
  const [currentWord, setCurrentWord] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { addWord, updateCharState, resetWordStates, wordStates } = useGuesses()
  const wordleSolver = useWordleSolver()

  const handleWordSubmit = useCallback((event) => {
    event.preventDefault();
    const word = currentWord
    if (word.length < WORD_LENGTH) {
      setUserMessage(`Word must be ${WORD_LENGTH} characters long`)
      return
    }
    if (!wordleSolver.isPossibleWord(word)) {
      setUserMessage(`Word does not exist!`)
      return
    }
    setUserMessage(`Word added!`)
    addWord(word.toLowerCase())
    setCurrentWord('')
  }, [currentWord])

  const handleWordInput = useCallback((event) => {
    event.preventDefault();
    const word = event.target.value.toLowerCase()
    if (word.length <= WORD_LENGTH && [...word].every(c => ALPHABETS.has(c))) {
      setCurrentWord(word)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (wordStates.length > 0) {
        setUserMessage("Tap on character to change it's color")
      } else {
        setUserMessage("Enter your guess here")
      }
    }, 3000)
    wordleSolver.solveForStates(wordStates)
  }, [wordStates])

  return (
    <Container className="mb-5" style={{ maxWidth: '800px' }}>
      <Container className="shadow-sm p-5 mb-4" >
        <EasterEgg />
        <Row className="justify-content-center">
        <Col>
          <Button variant="outline-dark" href={LINK.WORDLE_TODAY} target="_blank">Play Today's Wordle</Button>
          </Col>
          <Col>
          <Button variant="outline-dark" href={LINK.WORDLE_ARCHIVE} target="_blank">Check out Past Wordle</Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="justify-content-center">
          <Col>
            <Container className="shadow-sm p-4 mb-4" style={{ minWidth: `350px`, }} >
              <p className="mt-2">
                {userMessage}
              </p>
              {
                wordStates.map((wordState, wordIndex) => <DisplayWord
                  key={wordIndex}
                  wordState={wordState}
                  getCharClickHandler={(charIndex) => () => updateCharState(wordIndex, charIndex)}
                />)
              }
            </Container>
          </Col>
          <Col>
            <Container className="shadow-sm p-4 mb-4" style={{ minWidth: '350px' }}>
              <InputGroup className="mx-auto">
                <Form className="my-1 mx-1" onSubmit={handleWordSubmit}>
                  <Form.Control type="text" size="md" value={currentWord} onChange={handleWordInput} placeholder="Enter your Guess" autoFocus />
                </Form>
              </InputGroup>
                {
                  wordStates.length > 0 &&
                  <InputGroup className="mt-3 mx-auto">
                    <Button 
                      className="my-1 mx-1" variant="outline-danger" 
                      onClick={() => resetWordStates() && wordleSolver.reset()}>
                      Reset All
                    </Button>
                    <Button 
                      className="my-1 mx-1" variant="outline-primary" 
                      onClick={() => resetWordStates(-1)} >
                      Undo Word
                    </Button>
                  </InputGroup>
                }
            </Container>
          </Col>
        </Row>
        {/* <Button className="m-1" onClick={() => {
        wordleSolver.messify()
        console.log('Messed up suggestions 😛')
      }}>Mess around</Button> */}

        <Button 
          variant={wordStates.length > 0 ? 'primary' : 'outline-secondary'} 
          size={wordStates.length > 0 && "lg"}
          onClick={() => setShowSuggestions(true)} 
        >
          {
            `View ${wordleSolver.getSuggestions().length} Possible Words`
          }
        </Button>
        { showSuggestions && 
          <WordsSuggestionList
            isVisible={showSuggestions}
            onHide={() => setShowSuggestions(false)}
            wordList={wordleSolver.getSuggestions()}
            onWordSelect={(word) => {
              addWord(word)
              setShowSuggestions(false)
            }}
          />
        }
      </Container>
    </Container>

  )
}

export default WordleContainer;
