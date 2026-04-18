import React, { useState } from 'react';
import { Lock, Search, Filter, Star, Eye, Crosshair, Target, Bomb, Download, Unlock, X, ChevronRight } from 'lucide-react';

interface AstucesSectionProps {
  onNavigate: (section: string) => void;
}

type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
type GameFilter = 'all' | 'counter-strike' | 'battlefield' | 'call-of-duty';

interface Astuce {
  id: number;
  title: string;
  game: string;
  gameId: GameFilter;
  difficulty: Difficulty;
  isPremium: boolean;
  downloads: number;
  views: number;
  rating: number;
  description: string;
  category: string;
  image?: string;
}

const astuces: Astuce[] = [
  {
    id: 1,
    title: 'Crosshair Placement + Pré-Aim',
    game: 'CS2', gameId: 'counter-strike', difficulty: 'Débutant', isPremium: false,
    downloads: 1850, views: 7200, rating: 4.8, category: 'Aim',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    description: "Travaille ton crosshair placement pour gagner tes duels plus facilement sur CS2.\n\nLe principe
      
