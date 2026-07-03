import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage SEO Meta tags, Title, and OpenGraph parameters.
 */
export function useSEO({ title, description, canonical, robots }) {
  useEffect(() => {
    // 1. Set Title
    const formattedTitle = title ? `${title} | README Forge` : 'README Forge | AI GitHub Profile README Builder';
    document.title = formattedTitle;

    // Helper function to upsert meta tag
    const updateOrCreateMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Set Description
    updateOrCreateMeta('description', description || 'Generate custom, visually rich GitHub profile READMEs in minutes with Google Gemini AI integration.');
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('twitter:description', description);

    // 3. Set OpenGraph / Twitter titles
    updateOrCreateMeta('og:title', formattedTitle, true);
    updateOrCreateMeta('twitter:title', formattedTitle);

    // 4. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonical);
    }

    // 5. Set Robots config
    if (robots) {
      updateOrCreateMeta('robots', robots);
    }

    // 6. Set OpenGraph Types / Images
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:image', 'https://forge-readme.vercel.app/logo.png', true);
    updateOrCreateMeta('twitter:card', 'summary_large_image');
    
  }, [title, description, canonical, robots]);
}

export default useSEO;
