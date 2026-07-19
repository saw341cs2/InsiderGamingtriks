import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

interface Target {
  id: number;
  x: number;
  y: number;
}

const GAME_DURATION = 30;
const TARGET_SIZE = 60;

export default function AimRush() {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const areaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const scoreRef = useRef(0);
  const missesRef = useRef(0);

  const spawnTarget = useCallback(() => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    const maxX = rect.width - TARGET_SIZE;
    const maxY = rect.height - TARGET_SIZE;
    const newTarget: Target = {
      id: targetIdRef.current++,
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    };
    setTargets([newTarget]);
  }, []);

  const startGame = () => {
    setScore(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    spawnTarget();
  }, [gameState, spawnTarget]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (timeLeft <= 0) {
      // Save final score from refs before clearing state
      const finalScore = scoreRef.current;
      const finalMisses = missesRef.current;
      const finalAccuracy = finalScore + finalMisses > 0
        ? Math.round((finalScore / (finalScore + finalMisses)) * 100)
        : 0;

      if (user && finalScore > 0) {
        supabase.from('aimrush_scores').insert({
          user_id: user.id,
          score: finalScore,
          accuracy: finalAccuracy,
        }).then(({ error }) => {
          if (error) {
            console.error('Erreur sauvegarde score (détail):', JSON.stringify(error));
          } else {
            console.log('Score sauvegardé:', finalScore, 'Précision:', finalAccuracy);
          }
        }).catch((err) => {
          console.error('Exception sauvegarde score:', err);
        });
      }

      setGameState('finished');
      setTargets([]);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [gameState, timeLeft, user]);

  const handleTargetClick = (id: number) => {
    setScore((s) => { scoreRef.current = s + 1; return s + 1; });
    setTargets((prev) => prev.filter((t) => t.id !== id));
    spawnTarget();
  };

  const handleAreaClick = () => {
    if (gameState === 'playing') setMisses((m) => { missesRef.current = m + 1; return m + 1; });
  };

  const accuracy = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Connecte-toi pour jouer</h2>
          <p className="text-gray-400 mb-6">
            Connecte-toi pour jouer et tenter de gagner ton abonnement Premium !
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 mb-8 text-center text-white shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-1">
          🎮 Jeu gratuit
        </h2>
        <p className="text-base md:text-lg font-semibold mb-1">
          Grimpe au classement et gagne ton abonnement Pro chaque mois !
        </p>
        <p className="text-sm opacity-90">
          Tout le monde peut jouer et tenter sa chance
        </p>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">Jeu gratuit</h1>

      {gameState === 'idle' && (
        <div className="text-center">
          <p className="mb-6 text-gray-400">
            Vise et clique un maximum de cibles en {GAME_DURATION} secondes.
          </p>
          <button
            onClick={startGame}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
          >
            Jouer
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div>
          <div className="flex justify-between mb-4 text-lg font-semibold">
            <span>⏱ {timeLeft}s</span>
            <span>🎯 Score : {score}</span>
          </div>
          <div
            ref={areaRef}
            onClick={handleAreaClick}
            className="relative w-full h-[420px] bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden cursor-crosshair"
          >
            {targets.map((target) => (
              <button
                key={target.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTargetClick(target.id);
                }}
                style={{
                  left: target.x,
                  top: target.y,
                  width: TARGET_SIZE,
                  height: TARGET_SIZE,
                }}
                className="absolute rounded-full bg-orange-500 hover:bg-orange-400 border-2 border-white shadow-lg transition-transform hover:scale-105"
              />
            ))}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="text-center bg-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">Partie terminée !</h3>
          <p className="text-lg mb-1">Score : <span className="font-bold text-orange-500">{score}</span></p>
          <p className="text-lg mb-6">Précision : <span className="font-bold text-orange-500">{accuracy}%</span></p>
          <button
            onClick={startGame}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition"
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
}