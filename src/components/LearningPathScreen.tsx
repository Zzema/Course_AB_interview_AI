import React, { useMemo, useEffect } from 'react';
import { GameState } from '../types';
import { LEARNING_PATH_DATA } from '../data/learningPathData';
import { 
  isModuleUnlocked, 
  isModuleCompleted, 
  getModuleProgress,
  calculateOverallProgress 
} from '../lib/learningPathManager';

interface LearningPathScreenProps {
  gameState: GameState;
  onSelectModule: (moduleId: string) => void;
  onBack: () => void;
}

const LearningPathScreen: React.FC<LearningPathScreenProps> = ({ 
  gameState, 
  onSelectModule,
  onBack 
}) => {
  const learningProgress = gameState.learningProgress!;
  const overallProgress = useMemo(() => calculateOverallProgress(learningProgress), [learningProgress]);
  
  // Определяем мобильное устройство
  const isMobile = window.innerWidth <= 768;
  
  // Состояние для hover эффекта
  const [hoveredModule, setHoveredModule] = React.useState<string | null>(null);

  // Скроллим к началу при монтировании компонента
  useEffect(() => {
    // МАКСИМАЛЬНО агрессивный сброс скролла
    const forceScrollToTop = () => {
      // Сначала пробуем скроллить к первому модулю
      const firstModule = document.getElementById('first-module');
      if (firstModule) {
        firstModule.scrollIntoView({ behavior: 'instant', block: 'start' });
        console.log('📍 Scrolled to first module using scrollIntoView');
      }
      
      // Затем дополнительно сбрасываем весь скролл
      window.scrollTo({top: 0, left: 0, behavior: 'instant'});
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
      console.log('📍 Force scroll to top executed');
    };
    
    // Немедленно
    forceScrollToTop();
    
    // Через requestAnimationFrame (до следующего рендера)
    requestAnimationFrame(forceScrollToTop);
    
    // Через короткие таймауты для надежности
    const timer1 = setTimeout(forceScrollToTop, 0);
    const timer2 = setTimeout(forceScrollToTop, 10);
    const timer3 = setTimeout(forceScrollToTop, 50);
    const timer4 = setTimeout(forceScrollToTop, 100);
    const timer5 = setTimeout(forceScrollToTop, 200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const styles = {
    container: {
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '2rem'
    },
    backButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '1rem',
      fontWeight: 600
    },
    title: {
      fontSize: isMobile ? '1.75rem' : '2.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: isMobile ? '0.9rem' : '1.1rem',
      color: '#666',
      marginBottom: '1rem',
      lineHeight: '1.4'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      background: '#e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginTop: '1rem'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      transition: 'width 0.3s ease'
    },
    progressText: {
      fontSize: '0.9rem',
      color: '#666',
      marginTop: '0.5rem'
    },
    levelSection: {
      marginBottom: '3rem'
    },
    levelHeader: {
      fontSize: isMobile ? '1.4rem' : '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    levelBadge: {
      fontSize: '2rem'
    },
    modulesGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: isMobile ? '1rem' : '1.5rem'
    },
    moduleCard: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent'
    },
    moduleCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
      borderColor: '#667eea'
    },
    moduleCardLocked: {
      opacity: 0.5,
      cursor: 'not-allowed',
      background: '#f5f5f5'
    },
    moduleCardCompleted: {
      borderColor: '#10b981',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
    },
    moduleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '0.75rem'
    },
    moduleId: {
      fontSize: '0.85rem',
      color: '#666',
      fontWeight: 600
    },
    moduleStatus: {
      fontSize: '1.5rem'
    },
    moduleTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#333'
    },
    moduleDescription: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '1rem'
    },
    moduleStats: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.85rem',
      color: '#666'
    },
    moduleStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem'
    }
  };

  const getLevelBadge = (levelId: number) => {
    switch(levelId) {
      case 1: return '🎓';
      case 2: return '🚀';
      case 3: return '👑';
      default: return '📚';
    }
  };

  const getModuleStatusIcon = (moduleId: string) => {
    if (learningProgress.completedModuleIds.includes(moduleId)) {
      return '✅';
    }
    if (!isModuleUnlocked(learningProgress, moduleId)) {
      return '🔒';
    }
    const progress = learningProgress.moduleProgress[moduleId];
    if (progress && progress.answeredQuestionIds.length > 0) {
      return '📝';
    }
    return '⭐';
  };

  return (
    <div style={{
      ...styles.container, 
      paddingTop: 0, 
      position: 'relative', 
      top: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Назад к Free Practice
        </button>
        
        <h1 style={styles.title}>Структурированное обучение A/B Testing</h1>
        <p style={styles.subtitle}>
          Пройди все модули от основ до экспертного уровня
        </p>
        
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${overallProgress}%`
            }}
          />
        </div>
        <p style={styles.progressText}>
          Общий прогресс: {overallProgress.toFixed(0)}% 
          ({learningProgress.completedModuleIds.length} из {LEARNING_PATH_DATA.levels.reduce((sum, level) => sum + level.modules.length, 0)} модулей)
        </p>
      </div>

      {LEARNING_PATH_DATA.levels.map(level => {
        const completedInLevel = level.modules.filter(m => 
          learningProgress.completedModuleIds.includes(m.id)
        ).length;

        return (
          <div key={level.id} style={styles.levelSection}>
            <h2 style={styles.levelHeader}>
              <span style={styles.levelBadge}>{getLevelBadge(level.id)}</span>
              {level.title}
              <span style={{ fontSize: '1rem', color: '#666', marginLeft: '1rem' }}>
                ({completedInLevel}/{level.modules.length})
              </span>
            </h2>
            
            <div style={styles.modulesGrid}>
              {level.modules.map((module, moduleIndex) => {
                const isUnlocked = isModuleUnlocked(learningProgress, module.id);
                const progress = getModuleProgress(gameState, module.id);
                const isComplete = isModuleCompleted(progress, module);
                const statusIcon = getModuleStatusIcon(module.id);
                const isHovered = hoveredModule === module.id;
                const isFirstModule = module.id === '1.1';

                return (
                  <div
                    key={module.id}
                    id={isFirstModule ? 'first-module' : undefined}
                    style={{
                      ...styles.moduleCard,
                      ...(isComplete ? styles.moduleCardCompleted : {}),
                      ...(!isUnlocked ? styles.moduleCardLocked : {}),
                      ...(isHovered && isUnlocked ? styles.moduleCardHover : {})
                    }}
                    onClick={() => isUnlocked && onSelectModule(module.id)}
                    onMouseEnter={() => setHoveredModule(module.id)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <div style={styles.moduleHeader}>
                      <span style={styles.moduleId}>Модуль {module.id}</span>
                      <span style={styles.moduleStatus}>{statusIcon}</span>
                    </div>
                    
                    <h3 style={styles.moduleTitle}>{module.title}</h3>
                    <p style={styles.moduleDescription}>{module.description}</p>
                    
                    <div style={styles.moduleStats}>
                      <div style={styles.moduleStat}>
                        <span>📊</span>
                        <span>{progress.answeredQuestionIds.length}/{module.questionIds.length} вопросов</span>
                      </div>
                      {progress.avgScore > 0 && (
                        <div style={styles.moduleStat}>
                          <span>⭐</span>
                          <span>{progress.avgScore.toFixed(1)}/10</span>
                        </div>
                      )}
                    </div>

                    {!isUnlocked && module.unlockRequirements && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#999' }}>
                        🔒 Завершите модуль {module.unlockRequirements[0]}
                      </div>
                    )}

                    {isComplete && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                        ✅ Модуль завершен!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LearningPathScreen;

