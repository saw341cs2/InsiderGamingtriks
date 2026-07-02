import React, { useState, useEffect } from 'react';
import { User, Gamepad2, Map, Crosshair, Target, Shield, Save, Edit2, X, ArrowLeft, Globe, Calendar, Camera } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface ProfileData {
  avatarUrl: string;
  age: string;
  sexe: string;
  pays: string;
  ville: string;
  signe: string;
  game: string;
  level: string;
  jeux: string[];
  preferredMaps: string;
  favoriteWeapon: string;
  role: string;
  bio: string;
}

interface ProfilePageProps {
  onNavigate?: (section: string) => void;
}

const gameOptions = [
  { value: 'counter-strike', label: 'Counter-Strike 2' },
  { value: 'call-of-duty', label: 'Call of Duty' },
  { value: 'battlefield', label: 'Battlefield' },
  { value: 'valorant', label: 'Valorant' },
  { value: 'apex-legends', label: 'Apex Legends' },
  { value: 'fortnite', label: 'Fortnite' },
  { value: 'minecraft', label: 'Minecraft' },
  { value: 'league-of-legends', label: 'League of Legends' },
  { value: 'rocket-league', label: 'Rocket League' },
  { value: 'other', label: 'Autre' },
];

const levelOptions: Record<string, string[]> = {
  'counter-strike': ['Silver', 'Gold Nova', 'Master Guardian', 'Legendary Eagle', 'Global Elite', 'Semi-Pro', 'Pro'],
  'call-of-duty': ['Recrue', 'Soldat', 'Vétéran', 'Elite', 'Master', 'Pro League'],
  'battlefield': ['Recrue', 'Soldat', 'Veteran', 'Elite', 'Commandant', 'Pro'],
  'valorant': ['Fer', 'Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Ascendant', 'Immortel', 'Radiant'],
  'apex-legends': ['Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Master', 'Predator'],
  'fortnite': ['Recrue', 'Soldier', 'Elite', 'Champion', 'Contender', 'Dream Team'],
  'rocket-league': ['Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Champion', 'Grand Champion', 'Supersonic Legend'],
  'league-of-legends': ['Fer', 'Bronze', 'Argent', 'Or', 'Platine', 'Émeraude', 'Diamant', 'Maître', 'Grand Maître', 'Challenger'],
  'other': ['Débutant', 'Intermédiaire', 'Avancé', 'Expert', 'Pro'],
};

const roleOptions: Record<string, string[]> = {
  'counter-strike': ['Entry Fragger', 'Support', 'AWPer', 'Lurker', 'IGL (Leader)', 'Flex'],
  'call-of-duty': ['Assault', 'Support', 'Sniper', 'Objective', 'Slayer', 'Flex'],
  'battlefield': ['Infanterie', 'Tank', 'Pilote', 'Médecin', 'Ingénieur', 'Recon', 'Assaut'],
  'valorant': ['Duelist', 'Controller', 'Initiator', 'Sentinel', 'Flex'],
  'apex-legends': ['Assault', 'Skirmisher', 'Recon', 'Support', 'Controller', 'Flex'],
  'fortnite': ['Builder', 'Fragger', 'Support', 'IGL', 'Flex'],
  'other': ['Principal', 'Support', 'Leader', 'Flex'],
};

const paysOptions = [
  'France', 'Belgique', 'Suisse', 'Canada', 'Luxembourg', 'Maroc', 'Algérie', 'Tunisie',
  'Espagne', 'Italie', 'Allemagne', 'Portugal', 'Royaume-Uni', 'États-Unis', 'Autre',
];

const signeOptions = [
  { value: 'belier', label: '♈ Bélier', dates: '21 mars - 19 avril' },
  { value: 'taureau', label: '♉ Taureau', dates: '20 avril - 20 mai' },
  { value: 'gemeaux', label: '♊ Gémeaux', dates: '21 mai - 20 juin' },
  { value: 'cancer', label: '♋ Cancer', dates: '21 juin - 22 juillet' },
  { value: 'lion', label: '♌ Lion', dates: '23 juillet - 22 août' },
  { value: 'vierge', label: '♍ Vierge', dates: '23 août - 22 septembre' },
  { value: 'balance', label: '♎ Balance', dates: '23 septembre - 22 octobre' },
  { value: 'scorpion', label: '♏ Scorpion', dates: '23 octobre - 21 novembre' },
  { value: 'sagittaire', label: '♐ Sagittaire', dates: '22 novembre - 21 décembre' },
  { value: 'capricorne', label: '♑ Capricorne', dates: '22 décembre - 19 janvier' },
  { value: 'verseau', label: '♒ Verseau', dates: '20 janvier - 18 février' },
  { value: 'poissons', label: '♓ Poissons', dates: '19 février - 20 mars' },
];

const avatarPresets = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix&backgroundColor=b91c1c',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Viper&backgroundColor=1e40af',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Shadow&backgroundColor=15803d',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Ghost&backgroundColor=6d28d9',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Reaper&backgroundColor=ea580c',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Blaze&backgroundColor=0891b2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja&backgroundColor=b91c1c',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sniper&backgroundColor=1e40af',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rogue&backgroundColor=15803d',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ace&backgroundColor=6d28d9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Storm&backgroundColor=ea580c',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Frost&backgroundColor=0891b2',
];

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, username } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    avatarUrl: '',
    age: '',
    sexe: '',
    pays: '',
    ville: '',
    signe: '',
    game: '',
    level: '',
    jeux: [],
    preferredMaps: '',
    favoriteWeapon: '',
    role: '',
    bio: '',
  });

  useEffect(() => {
    if (user?.user_metadata) {
      setProfile({
        avatarUrl: user.user_metadata.avatarUrl || '',
        age: user.user_metadata.age || '',
        sexe: user.user_metadata.sexe || '',
        pays: user.user_metadata.pays || '',
        ville: user.user_metadata.ville || '',
        signe: user.user_metadata.signe || '',
        game: user.user_metadata.game || '',
        level: user.user_metadata.level || '',
        jeux: user.user_metadata.jeux || [],
        preferredMaps: user.user_metadata.preferredMaps || '',
        favoriteWeapon: user.user_metadata.favoriteWeapon || '',
        role: user.user_metadata.role || '',
        bio: user.user_metadata.bio || '',
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connecte-toi pour voir ton profil</h2>
          <p className="text-gray-400">Tu dois être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  if (!user.email_confirmed_at) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Confirmez votre email</h2>
          <p className="mb-4 text-gray-400">Vérifiez votre boîte mail et cliquez sur le lien de confirmation.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          avatarUrl: profile.avatarUrl,
          age: profile.age,
          sexe: profile.sexe,
          pays: profile.pays,
          ville: profile.ville,
          signe: profile.signe,
          game: profile.game,
          level: profile.level,
          jeux: profile.jeux,
          preferredMaps: profile.preferredMaps,
          favoriteWeapon: profile.favoriteWeapon,
          role: profile.role,
          bio: profile.bio,
        }
      });
      if (error) throw error;
      toast({ title: "Profil mis à jour", description: "Tes informations ont été sauvegardées !" });
      setIsEditing(false);
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le profil", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleJeu = (jeu: string) => {
    setProfile(prev => ({
      ...prev,
      jeux: prev.jeux.includes(jeu) ? prev.jeux.filter(j => j !== jeu) : [...prev.jeux, jeu],
    }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "La photo doit faire moins de 3 Mo", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, cacheControl: '3600' });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
      setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
      setShowAvatarPicker(false);
      toast({ title: "Photo mise à jour", description: "N'oublie pas de cliquer sur Sauvegarder !" });
    } catch (err) {
      toast({ title: "Erreur d'upload", description: "Impossible d'envoyer la photo. Réessaie.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const getLevels = () => levelOptions[profile.game] || levelOptions['other'];
  const getRoles = () => roleOptions[profile.game] || roleOptions['other'];

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      {onNavigate && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <button onClick={() => onNavigate('accueil')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center overflow-hidden relative">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-900 hover:bg-gray-700"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

            {showAvatarPicker && (
              <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowAvatarPicker(false)}>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Choisir un avatar</h3>
                    <button onClick={() => setShowAvatarPicker(false)} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <label className={`flex items-center justify-center gap-2 w-full px-4 py-3 mb-4 rounded-lg font-semibold text-sm cursor-pointer transition-colors ${isUploading ? 'bg-gray-700 text-gray-400' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                    <Camera className="w-4 h-4" />
                    {isUploading ? 'Envoi en cours...' : 'Envoyer une photo depuis mon appareil'}
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploading} className="hidden" />
                  </label>

                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Ou choisis un avatar gaming</p>
                  <div className="grid grid-cols-4 gap-3">
                    {avatarPresets.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => { setProfile(prev => ({ ...prev, avatarUrl: url })); setShowAvatarPicker(false); }}
                        className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${profile.avatarUrl === url ? 'border-red-500' : 'border-gray-700'}`}
                      >
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h1 className="text-3xl font-black text-white">{username || user.user_metadata?.username || 'Joueur'}</h1>
              <p className="text-gray-400">{user.email}</p>
              {profile.pays && <p className="text-gray-500 text-sm">{profile.pays}</p>}
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
          >
            {isEditing ? (isSaving ? 'Sauvegarde...' : <><Save className="w-4 h-4" /> Sauvegarder</>) : <><Edit2 className="w-4 h-4" /> Modifier</>}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Âge</p>
            <p className="text-white font-bold">{profile.age ? `${profile.age} ans` : 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <User className="w-6 h-6 text-pink-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sexe</p>
            <p className="text-white font-bold">{profile.sexe || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Globe className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pays</p>
            <p className="text-white font-bold text-sm">{profile.pays || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Niveau</p>
            <p className="text-white font-bold text-sm">{profile.level || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <span className="block text-2xl mb-1">{signeOptions.find(s => s.value === profile.signe)?.label.split(' ')[0] || '✨'}</span>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Signe</p>
            <p className="text-white font-bold text-sm">{signeOptions.find(s => s.value === profile.signe)?.label.split(' ')[1] || 'Non défini'}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Informations du Profil</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4 inline mr-2" />Ville</label>
              {isEditing ? (
                <input type="text" value={profile.ville} onChange={(e) => setProfile({ ...profile, ville: e.target.value })}
                  placeholder="Ta ville" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              ) : <p className="text-white py-3">{profile.ville || 'Non défini'}</p>}
            </div>

            {/* Signe astrologique */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Calendar className="w-4 h-4 inline mr-2" />Signe astrologique</label>
              {isEditing ? (
                <select value={profile.signe} onChange={(e) => setProfile({ ...profile, signe: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500">
                  <option value="">Sélectionne ton signe</option>
                  {signeOptions.map(s => <option key={s.value} value={s.value}>{s.label} ({s.dates})</option>)}
                </select>
              ) : <p className="text-white py-3">{signeOptions.find(s => s.value === profile.signe)?.label || 'Non défini'}</p>}
            </div>

            {/* Âge */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Calendar className="w-4 h-4 inline mr-2" />Âge</label>
              {isEditing ? (
                <input type="number" min="10" max="99" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Ton âge" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              ) : <p className="text-white py-3">{profile.age ? `${profile.age} ans` : 'Non défini'}</p>}
            </div>

            {/* Sexe */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><User className="w-4 h-4 inline mr-2" />Sexe</label>
              {isEditing ? (
                <select value={profile.sexe} onChange={(e) => setProfile({ ...profile, sexe: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500">
                  <option value="">Sélectionne</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
              ) : <p className="text-white py-3">{profile.sexe || 'Non défini'}</p>}
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Globe className="w-4 h-4 inline mr-2" />Pays</label>
              {isEditing ? (
                <select value={profile.pays} onChange={(e) => setProfile({ ...profile, pays: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500">
                  <option value="">Sélectionne un pays</option>
                  {paysOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              ) : <p className="text-white py-3">{profile.pays || 'Non défini'}</p>}
            </div>

            {/* Jeu Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Gamepad2 className="w-4 h-4 inline mr-2" />Jeu Principal</label>
              {isEditing ? (
                <select value={profile.game} onChange={(e) => setProfile({ ...profile, game: e.target.value, level: '', role: '' })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500">
                  <option value="">Sélectionne un jeu</option>
                  {gameOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : <p className="text-white py-3">{gameOptions.find(g => g.value === profile.game)?.label || 'Non défini'}</p>}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Target className="w-4 h-4 inline mr-2" />Niveau / Rang</label>
              {isEditing ? (
                <select value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500">
                  <option value="">Sélectionne un niveau</option>
                  {getLevels().map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              ) : <p className="text-white py-3">{profile.level || 'Non défini'}</p>}
            </div>

            {/* Rôle / Poste */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Shield className="w-4 h-4 inline mr-2" />Rôle / Poste</label>
              {isEditing ? (
                <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500">
                  <option value="">Sélectionne un rôle</option>
                  {getRoles().map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              ) : <p className="text-white py-3">{profile.role || 'Non défini'}</p>}
            </div>

            {/* Arme Favorite */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Crosshair className="w-4 h-4 inline mr-2" />Arme Favorite</label>
              {isEditing ? (
                <input type="text" value={profile.favoriteWeapon} onChange={(e) => setProfile({ ...profile, favoriteWeapon: e.target.value })}
                  placeholder="AK-47, AWP, kar98..." className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              ) : <p className="text-white py-3">{profile.favoriteWeapon || 'Non défini'}</p>}
            </div>

            {/* Maps */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2"><Map className="w-4 h-4 inline mr-2" />Maps Préférées</label>
              {isEditing ? (
                <input type="text" value={profile.preferredMaps} onChange={(e) => setProfile({ ...profile, preferredMaps: e.target.value })}
                  placeholder="Mirage, Dust2, Nuke..." className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              ) : <p className="text-white py-3">{profile.preferredMaps || 'Non défini'}</p>}
            </div>

            {/* Jeux joués */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2"><Gamepad2 className="w-4 h-4 inline mr-2" />Jeux joués</label>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {gameOptions.map(opt => (
                    <button key={opt.value} type="button" onClick={() => toggleJeu(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${profile.jeux.includes(opt.value) ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 py-2">
                  {profile.jeux.length > 0 ? profile.jeux.map(j => (
                    <span key={j} className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-lg text-sm text-red-400">
                      {gameOptions.find(g => g.value === j)?.label || j}
                    </span>
                  )) : <p className="text-gray-500">Non défini</p>}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2"><User className="w-4 h-4 inline mr-2" />Bio</label>
              {isEditing ? (
                <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Parle-nous de toi..." rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none" />
              ) : <p className="text-gray-300 py-3">{profile.bio || 'Pas de bio définie'}</p>}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                <X className="w-4 h-4" /> Annuler
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
