import React, { useState, useEffect } from 'react';
import { User, Gamepad2, Map, Crosshair, Target, Shield, Save, Edit2, Check, X, ArrowLeft } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface ProfileData {
  game: string;
  level: string;
  preferredMaps: string;
  favoriteWeapon: string;
  role: string;
  forumRole: string;
  discordRole: string;
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
  { value: 'other', label: 'Autre' },
];

const levelOptions: Record<string, string[]> = {
  'counter-strike': ['Silver', 'Gold Nova', 'Master Guardian', 'Legendary Eagle', 'Global Elite', 'Semi-Pro', 'Pro'],
  'call-of-duty': ['Recrue', 'Soldat', 'Vétéran', 'Elite', 'Master', 'Pro League'],
  'battlefield': ['Recrue', 'Soldat', 'Veteran', 'Elite', 'Commandant', 'Pro'],
  'valorant': ['Fer', 'Bronze', 'Argent', 'Or', 'Platine', 'Diamant', 'Ascendant', 'Immortel', 'Radiant'],
  'apex-legends': ['Rookie', 'Predator', 'Master', 'Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'],
  'fortnite': ['Recrue', 'Soldier', 'Elite', 'Champion', 'Contender', 'Dream Team'],
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

const forumRoleOptions = ['Membre', 'Vétéran', 'Modérateur', 'Administrateur', 'Fondateur'];
const discordRoleOptions = ['Membre', 'Partner', 'Modérateur', 'Admin', 'Owner'];

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    game: '',
    level: '',
    preferredMaps: '',
    favoriteWeapon: '',
    role: '',
    forumRole: '',
    discordRole: '',
    bio: '',
  });

  useEffect(() => {
    if (user?.user_metadata) {
      setProfile({
        game: user.user_metadata.game || '',
        level: user.user_metadata.level || '',
        preferredMaps: user.user_metadata.preferredMaps || '',
        favoriteWeapon: user.user_metadata.favoriteWeapon || '',
        role: user.user_metadata.role || '',
        forumRole: user.user_metadata.forumRole || '',
        discordRole: user.user_metadata.discordRole || '',
        bio: user.user_metadata.bio || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await (window as any).supabase?.auth.updateUser({
        data: {
          game: profile.game,
          level: profile.level,
          preferredMaps: profile.preferredMaps,
          favoriteWeapon: profile.favoriteWeapon,
          role: profile.role,
          forumRole: profile.forumRole,
          discordRole: profile.discordRole,
          bio: profile.bio,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profil mis à jour",
        description: "Tes informations ont été sauvegardées avec succès!",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getLevels = () => levelOptions[profile.game] || levelOptions['other'];
  const getRoles = () => roleOptions[profile.game] || roleOptions['other'];

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connecte-toi pour voir ton profil</h2>
          <p className="text-gray-400">Tu dois être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      {/* Back Button */}
      {onNavigate && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <button
            onClick={() => onNavigate('accueil')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{user.user_metadata?.username || 'Joueur'}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              isEditing 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            {isEditing ? (
              <>
                {isSaving ? 'Sauvegarde...' : <><Save className="w-4 h-4" /> Sauvegarder</>}
              </>
            ) : (
              <><Edit2 className="w-4 h-4" /> Modifier</>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Gamepad2 className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Jeu</p>
            <p className="text-white font-bold text-sm">{gameOptions.find(g => g.value === profile.game)?.label || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Niveau</p>
            <p className="text-white font-bold text-sm">{profile.level || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rôle Jeu</p>
            <p className="text-white font-bold text-sm">{profile.role || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Forum</p>
            <p className="text-white font-bold text-sm">{profile.forumRole || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Discord</p>
            <p className="text-white font-bold text-sm">{profile.discordRole || 'Non défini'}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <Crosshair className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Arme</p>
            <p className="text-white font-bold text-sm">{profile.favoriteWeapon || 'Non défini'}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Informations du Profil</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Gamepad2 className="w-4 h-4 inline mr-2" />
                Jeu Principal
              </label>
              {isEditing ? (
                <select
                  value={profile.game}
                  onChange={(e) => setProfile({ ...profile, game: e.target.value, level: '', role: '' })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Sélectionne un jeu</option>
                  {gameOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white py-3">{gameOptions.find(g => g.value === profile.game)?.label || 'Non défini'}</p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Niveau / Rang
              </label>
              {isEditing ? (
                <select
                  value={profile.level}
                  onChange={(e) => setProfile({ ...profile, level: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Sélectionne un niveau</option>
                  {getLevels().map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white py-3">{profile.level || 'Non défini'}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Rôle / Poste
              </label>
              {isEditing ? (
                <select
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Sélectionne un rôle</option>
                  {getRoles().map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white py-3">{profile.role || 'Non défini'}</p>
              )}
            </div>

            {/* Forum Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Rôle Forum
              </label>
              {isEditing ? (
                <select
                  value={profile.forumRole}
                  onChange={(e) => setProfile({ ...profile, forumRole: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Sélectionne un rôle</option>
                  {forumRoleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white py-3">{profile.forumRole || 'Non défini'}</p>
              )}
            </div>

            {/* Discord Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Rôle Discord
              </label>
              {isEditing ? (
                <select
                  value={profile.discordRole}
                  onChange={(e) => setProfile({ ...profile, discordRole: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">Sélectionne un rôle</option>
                  {discordRoleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white py-3">{profile.discordRole || 'Non défini'}</p>
              )}
            </div>

            {/* Favorite Weapon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Crosshair className="w-4 h-4 inline mr-2" />
                Arme Favorite
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.favoriteWeapon}
                  onChange={(e) => setProfile({ ...profile, favoriteWeapon: e.target.value })}
                  placeholder="AK-47, AWP,kar98..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white py-3">{profile.favoriteWeapon || 'Non défini'}</p>
              )}
            </div>

            {/* Preferred Maps */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Map className="w-4 h-4 inline mr-2" />
                Maps / Cartes Préférées
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.preferredMaps}
                  onChange={(e) => setProfile({ ...profile, preferredMaps: e.target.value })}
                  placeholder="Mirage, Dust2, Nuke, Favela..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              ) : (
                <p className="text-white py-3">{profile.preferredMaps || 'Non défini'}</p>
              )}
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Parle-nous de toi..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                />
              ) : (
                <p className="text-gray-300 py-3">{profile.bio || 'Pas de bio définie'}</p>
              )}
            </div>
          </div>

          {/* Cancel button */}
          {isEditing && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          )}
        </div>

        {/* Member since */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;