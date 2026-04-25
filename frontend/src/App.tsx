import React from 'react';
import './styles/globals.css';
import { GamePage } from './pages/GamePage';
import { useGameStore } from './stores/gameStore';

function App() {
  const initializeGame = useGameStore(state => state.initializeGame);

  React.useEffect(() => {
    void initializeGame();
  }, [initializeGame]);

  return <GamePage />;
}

export default App;
