import { useEffect } from 'react';

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function useSEO(title: string, description: string, keywords?: string, noIndex?: boolean) {
  useEffect(() => {
    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    return () => {
      // Remet l'indexation par défaut quand on quitte une page noindex (ex: profil)
      if (noIndex) {
        setMetaTag('name', 'robots', 'index, follow');
      }
    };
  }, [title, description, keywords, noIndex]);
}
