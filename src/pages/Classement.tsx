import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ClassementEntry {
  id: string;
  score: number;
  accuracy: number;
  created_at: string;
  pseudo: string | null;
}

export default function Classement() {
  const [entries, setEntries] = useState<ClassementEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data, error } = await supabase
        .from('aimrush_scores')
        .select('id, score, accuracy, created_at, user_id')
        .gte('created_at', startOfMonth)
        .order('score', { ascending: false });

      if (error) {
        console.error('Erreur chargement classement:', error);
        setLoading(false);
        return;
      }

      // Get the best score per user (first occurrence is highest due to ordering)
      const bestPerUser = new Map<string, typeof data[0]>();
      for (const row of data) {
        if (!bestPerUser.has(row.user_id)) {
          bestPerUser.set(row.user_id, row);
        }
      }

      // Fetch pseudos from profiles table
      const userIds = Array.from(bestPerUser.keys());
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, pseudo')
        .in('id', userIds);

      const profileMap = new Map<string, string | null>();
      if (profiles) {
        for (const p of profiles) {
          profileMap.set(p.id, p.pseudo);
        }
      }

      const formatted: ClassementEntry[] = Array.from(bestPerUser.values()).map((row) => ({
        id: row.id,
        score: row.score,
        accuracy: row.accuracy,
        created_at: row.created_at,
        pseudo: profileMap.get(row.user_id) || null,
      }));

      setEntries(formatted);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-2">🏆 Classement du mois</h1>
        <p className="text-center text-gray-400 mb-8">
          Seul ton meilleur score compte. Joue et grimpe dans le classement !
        </p>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-400">Chargement du classement...</p>
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Aucun score enregistré ce mois-ci.</p>
            <p className="text-gray-500">Sois le premier à jouer et à marquer des points !</p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const isWinner = index === 0;
              return (
                <div
                  key={entry.id}
                  className={`rounded-xl p-5 flex items-center gap-4 border transition-all ${
                    isWinner
                      ? 'bg-gradient-to-r from-yellow-900/40 to-amber-900/20 border-yellow-600/50 shadow-lg shadow-yellow-900/20'
                      : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {/* Position */}
                  <div className="flex-shrink-0 w-10 text-center">
                    {isWinner ? (
                      <span className="text-3xl">🏆</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    )}
                  </div>

                  {/* Pseudo */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isWinner ? 'text-yellow-400 text-lg' : 'text-white'}`}>
                      {entry.pseudo || 'Joueur anonyme'}
                    </p>
                    {isWinner && (
                      <p className="text-yellow-500 text-sm font-semibold mt-0.5">
                        Gagnant du mois — Premium offert
                      </p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <p className={`font-bold text-lg ${isWinner ? 'text-yellow-400' : 'text-orange-500'}`}>
                      {entry.score}
                    </p>
                    <p className="text-xs text-gray-500">{entry.accuracy}% précision</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}