export const getDynamicEventImage = (event) => {
  const title = (event.title || '').toLowerCase();
  const category = (event.category || '').toLowerCase();

  const imageMap = [
    { keywords: ['holi'], url: 'https://images.unsplash.com/photo-1519305878406-6c9d8f97bb7a?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['dj', 'concert', 'night', 'music festival', 'club', 'dance'], url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['food', 'festival', 'gourmet', 'culinary', 'dining'], url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['fashion', 'runway', 'style', 'model'], url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['yoga', 'wellness', 'meditation', 'retreat'], url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['startup', 'business', 'conference', 'summit'], url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['art', 'exhibition', 'gallery'], url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80' },
    { keywords: ['sports'], url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80' },
  ];

  const text = `${title} ${category}`;
  for (const item of imageMap) {
    for (const keyword of item.keywords) {
      if (text.includes(keyword)) {
        return item.url;
      }
    }
  }

  return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';
};
