const DEFAULT_IMAGES = [
  {
    keywords: ['holi', 'festival', 'colors', 'rangoli'],
    url: 'https://images.unsplash.com/photo-1519305878406-6c9d8f97bb7a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['dj', 'concert', 'music', 'nightlife', 'club'],
    url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['technology', 'tech', 'ai', 'coding', 'startup', 'innovation'],
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['food', 'cuisine', 'dining', 'gourmet', 'festival'],
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['fashion', 'runway', 'style', 'model', 'designer'],
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['literature', 'books', 'authors', 'reading', 'poetry'],
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['business', 'networking', 'meeting', 'conference', 'summit'],
    url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['arts', 'art', 'gallery', 'exhibition', 'culture'],
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    keywords: ['health', 'wellness', 'yoga', 'meditation', 'retreat'],
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
];

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';

const getDefaultImageByCategory = (category = '', title = '') => {
  const normalized = `${category} ${title}`.toLowerCase();
  for (const item of DEFAULT_IMAGES) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      return item.url;
    }
  }
  return DEFAULT_FALLBACK;
};

module.exports = { getDefaultImageByCategory };
