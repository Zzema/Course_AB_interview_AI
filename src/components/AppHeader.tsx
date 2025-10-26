import React from 'react';

interface AppHeaderProps {
  user?: {
    name: string;
    given_name?: string;
    family_name?: string;
  };
  title?: string;
  onBack?: () => void;
  onLogout?: () => void;
  onShowStats?: () => void;
  onShowLearningPath?: () => void;
  backLabel?: string;
  showHomeButton?: boolean;
  moduleFilter?: string;
  onExitModule?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  title,
  onBack,
  onLogout,
  onShowStats,
  onShowLearningPath,
  backLabel = '← Назад',
  showHomeButton = false,
  moduleFilter,
  onExitModule
}) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    header: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '0.5rem' : '1rem',
      flex: 1
    },
    centerSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: isMobile ? 2 : 1,
      textAlign: 'center' as const
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '0.5rem' : '0.75rem',
      flex: 1,
      justifyContent: 'flex-end'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: isMobile ? '0.5rem 0.75rem' : '0.6rem 1rem',
      color: 'white',
      cursor: 'pointer',
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      fontWeight: 500,
      transition: 'all 0.2s',
      whiteSpace: 'nowrap' as const,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    iconButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: isMobile ? '0.5rem' : '0.6rem',
      color: 'white',
      cursor: 'pointer',
      fontSize: isMobile ? '1rem' : '1.1rem',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: isMobile ? '36px' : '40px',
      minHeight: isMobile ? '36px' : '40px'
    },
    title: {
      margin: 0,
      fontSize: isMobile ? '1rem' : '1.25rem',
      fontWeight: 600,
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const
    },
    moduleButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none'
    }
  };

  const buttonHoverStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-1px)'
  };

  return (
    <header style={styles.header}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        {onBack && (
          <button 
            onClick={onBack} 
            style={styles.button}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
            title={backLabel}
          >
            {isMobile ? '←' : backLabel}
          </button>
        )}
      </div>

      {/* Center Section */}
      <div style={styles.centerSection}>
        {title && <h1 style={styles.title}>{title}</h1>}
        {user && !title && (
          <h1 style={styles.title}>
            {isMobile 
              ? user.given_name || user.name
              : user.family_name ? `${user.family_name} ${user.given_name}` : user.name
            }
          </h1>
        )}
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        {moduleFilter && onExitModule && (
          <button
            onClick={onExitModule}
            style={{...styles.iconButton, ...styles.moduleButton}}
            title={`Выйти из модуля ${moduleFilter}`}
          >
            {isMobile ? moduleFilter : `← ${moduleFilter}`}
          </button>
        )}
        
        {onShowLearningPath && !moduleFilter && (
          <button
            onClick={onShowLearningPath}
            style={{...styles.iconButton, ...styles.moduleButton}}
            title="Структурированное обучение"
          >
            🎓
          </button>
        )}

        {onShowStats && (
          <button
            onClick={onShowStats}
            style={styles.iconButton}
            title="Статистика"
          >
            📊
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            style={styles.iconButton}
            title="Выйти"
          >
            ↩
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;

