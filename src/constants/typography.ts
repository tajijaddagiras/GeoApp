// Typography System - Geo-Contextual App
export const Typography = {
  // Font Families (will use system defaults, can be replaced with custom fonts)
  primary: 'System',
  heading: 'System',
  
  // Font Sizes
  sizes: {
    hero: 32,
    title: 22,
    heading: 20,
    subheading: 14,
    body: 15,
    caption: 12,
  },
  
  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
