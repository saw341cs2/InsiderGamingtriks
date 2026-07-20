import { useNavigate } from 'react-router-dom';

// Maps every nav/footer section id to its real, dedicated URL.
export const sectionRoutes: Record<string, string> = {
  accueil: '/',
  astuces: '/astuces',
  videos: '/videos',
  communaute: '/communaute',
  membres: '/membres',
  premium: '/premium',
  forum: '/forum',
  aimrush: '/aimrush',
  classement: '/classement',
};

export function useSectionNavigate() {
  const navigate = useNavigate();

  return (section: string) => {
    const path = sectionRoutes[section];
    if (path) {
      navigate(path);
    }
  };
}