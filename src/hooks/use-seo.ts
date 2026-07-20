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

function setCanonical(path: string) {
  const url = `https://insidertricks.fr${path}`;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
  setMetaTag('property', 'og:url', url);
}

export function useSEO(
  title: string,
  description: string,
  keywords?: string,
  noIndex?: boolean,
  path: string = '/',
) {
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
    setCanonical(path);

    return () => {
      // Remet l'indexation par défaut quand on quitte une page noindex (ex: profil)
      if (noIndex) {
        setMetaTag('name', 'robots', 'index, follow');
      }
    };
  }, [title, description, keywords, noIndex, path]);
}