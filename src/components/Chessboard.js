import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { Chess } from 'chess.js';

// Definimos la posición inicial en formato FEN
const initialPositionFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const ChessboardComponent = () => {
  const [game, setGame] = useState(new Chess(initialPositionFEN));
  const [position, setPosition] = useState(initialPositionFEN);
  const [turn, setTurn] = useState('w'); // Usamos 'w' para blanco y 'b' para negro en FEN
  const socketRef = useRef(null);

  // Aplicamos el movimiento en la posición actual
  const applyMove = useCallback((move) => {
    const newGame = new Chess(game.fen());
    newGame.move({ from: move.from, to: move.to });

    if (newGame.fen() !== game.fen()) {
      setGame(newGame);
      return newGame.fen();
    }
    return game.fen();
  }, [game]);

  // Manejar movimientos locales
  const handleLocalMove = (sourceSquare, targetSquare) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      turn: turn,
    };

    // Usamos chess.js para verificar si el movimiento es legal
    const newGame = new Chess(game.fen());
    const isLegal = newGame.move({ from: sourceSquare, to: targetSquare });

    if (isLegal) {
      console.log('Local Move:', move);
      const newPosition = applyMove(move);
      setPosition(newPosition);
      socketRef.current.emit('move', move);
      setTurn((prevTurn) => (prevTurn === 'w' ? 'b' : 'w'));
    } else {
      console.log('Invalid Move:', move);
    }
  };

  // Manejar movimientos remotos recibidos a través de WebSocket
  const handleRemoteMove = useCallback((move) => {
    const newPosition = applyMove(move);
    setPosition(newPosition);
    setTurn((prevTurn) => (prevTurn === 'w' ? 'b' : 'w'));
  }, [applyMove]);

  // Configuración del WebSocket
  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('move', handleRemoteMove);

    return () => {
      socket.disconnect();
    };
  }, [handleRemoteMove]);

  return (
    <div>
      <h2>Chessboard Component</h2>
      <Chessboard
        id="basic-board"
        draggable={true}
        position={position}
        onPieceDrop={handleLocalMove}
      />
      <p>Turn: {turn === 'w' ? 'White' : 'Black'}</p>
    </div>
  );
};

export default ChessboardComponent;
