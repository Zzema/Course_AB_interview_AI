// Общие стили для всего приложения
// Используются для унификации дизайна и переиспользования кода

export const HEADER_HEIGHT = {
  mobile: '56px',
  desktop: '64px'
};

export const getCommonStyles = (isMobile: boolean) => ({
  // Layout
  pageContainer: {
    padding: isMobile ? '1rem' : '2rem',
    paddingTop: isMobile ? 'calc(56px + 1rem)' : 'calc(64px + 2rem)', // Header height + padding
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '100vh'
  },

  // Cards
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: isMobile ? '12px' : '16px',
    padding: isMobile ? '1rem' : '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease'
  },

  cardHover: {
    background: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
  },

  // Buttons
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
    color: 'white',
    fontSize: isMobile ? '0.9rem' : '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    textAlign: 'center' as const
  },

  secondaryButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
    color: 'white',
    fontSize: isMobile ? '0.9rem' : '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center' as const
  },

  // Typography
  heading1: {
    fontSize: isMobile ? '1.5rem' : '2.5rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: isMobile ? '0.5rem' : '1rem'
  },

  heading2: {
    fontSize: isMobile ? '1.25rem' : '2rem',
    fontWeight: 600,
    color: 'white',
    marginBottom: isMobile ? '0.75rem' : '1rem'
  },

  heading3: {
    fontSize: isMobile ? '1.1rem' : '1.5rem',
    fontWeight: 600,
    color: 'white',
    marginBottom: isMobile ? '0.5rem' : '0.75rem'
  },

  bodyText: {
    fontSize: isMobile ? '0.9rem' : '1rem',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.8)'
  },

  smallText: {
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)'
  },

  // Progress bars
  progressBar: {
    width: '100%',
    height: isMobile ? '8px' : '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    overflow: 'hidden' as const
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '6px',
    transition: 'width 0.5s ease'
  },

  // Badge
  badge: {
    display: 'inline-block',
    padding: isMobile ? '0.25rem 0.75rem' : '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: isMobile ? '0.75rem' : '0.85rem',
    fontWeight: 600,
    background: 'rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    border: '1px solid rgba(102, 126, 234, 0.4)'
  },

  successBadge: {
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.4)'
  },

  warningBadge: {
    background: 'rgba(245, 158, 11, 0.2)',
    color: '#f59e0b',
    border: '1px solid rgba(245, 158, 11, 0.4)'
  },

  // Grid layouts
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: isMobile ? '1rem' : '1.5rem'
  },

  grid3Col: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '1rem' : '1.5rem'
  },

  // Spacing
  spacing: {
    xs: isMobile ? '0.25rem' : '0.5rem',
    sm: isMobile ? '0.5rem' : '0.75rem',
    md: isMobile ? '1rem' : '1.5rem',
    lg: isMobile ? '1.5rem' : '2rem',
    xl: isMobile ? '2rem' : '3rem'
  }
});

// Colors
export const COLORS = {
  primary: '#667eea',
  primaryDark: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  text: {
    primary: 'rgba(255, 255, 255, 1)',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)'
  },
  background: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    overlay: 'rgba(255, 255, 255, 0.05)',
    overlayHover: 'rgba(255, 255, 255, 0.08)'
  },
  border: 'rgba(255, 255, 255, 0.1)',
  borderBright: 'rgba(255, 255, 255, 0.2)'
};

// Gradients
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
};

// Shadows
export const SHADOWS = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 8px rgba(0, 0, 0, 0.2)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
  primary: '0 4px 12px rgba(102, 126, 234, 0.4)'
};

