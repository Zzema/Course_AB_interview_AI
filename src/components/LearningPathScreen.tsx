import React, { useMemo, useEffect, useState } from 'react';
import { GameState } from '../types';
import { LEARNING_PATH_DATA } from '../data/learningPathData';
import { 
  isModuleUnlocked, 
  isModuleCompleted, 
  getModuleProgress,
  calculateOverallProgress 
} from '../lib/learningPathManager';
import AppHeader from './AppHeader';
import { getCommonStyles, COLORS, GRADIENTS, SHADOWS } from '../styles/commonStyles';

interface LearningPathScreenProps {
  gameState: GameState;
  onSelectModule: (moduleId: string) => void;
  onStartTheory: (moduleId: string) => void;
  onBack: () => void;
}

const LearningPathScreen: React.FC<LearningPathScreenProps> = ({ 
  gameState, 
  onSelectModule,
  onStartTheory,
  onBack 
}) => {
  const learningProgress = gameState.learningProgress!;
  const overallProgress = useMemo(() => calculateOverallProgress(learningProgress), [learningProgress]);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const commonStyles = getCommonStyles(isMobile);

  const styles = {
    container: {
      ...commonStyles.pageContainer,
      paddingTop: isMobile ? 'calc(56px + 0.5rem)' : 'calc(64px + 1rem)' // Меньше отступ
    },
    progressSection: {
      marginBottom: isMobile ? '1.5rem' : '2rem',
      textAlign: 'center' as const
    },
    subtitle: {
      ...commonStyles.bodyText,
      textAlign: 'center' as const,
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    levelSection: {
      marginBottom: isMobile ? '2rem' : '3rem'
    },
    levelHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    levelTitle: {
      ...commonStyles.heading2,
      margin: 0
    },
    modulesGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: isMobile ? '1rem' : '1.5rem'
    },
    moduleCard: {
      ...commonStyles.card,
      cursor: 'pointer',
      position: 'relative' as const
    },
    moduleCardLocked: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    moduleCardCompleted: {
      border: `1px solid ${COLORS.success}`,
      boxShadow: `0 0 20px rgba(16, 185, 129, 0.2)`
    },
    moduleHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '0.5rem' : '0.75rem'
    },
    moduleId: {
      ...commonStyles.badge,
      background: GRADIENTS.primary
    },
    moduleStatus: {
      fontSize: '1.5rem'
    },
    moduleTitle: {
      ...commonStyles.heading3,
      margin: 0,
      marginBottom: isMobile ? '0.5rem' : '0.75rem'
    },
    moduleDescription: {
      ...commonStyles.smallText,
      marginBottom: isMobile ? '0.75rem' : '1rem'
    },
    moduleStats: {
      display: 'flex',
      gap: '1rem',
      marginBottom: isMobile ? '0.75rem' : '1rem'
    },
    moduleStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      color: COLORS.text.secondary
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    theoryButton: {
      ...commonStyles.secondaryButton,
      padding: isMobile ? '0.5rem' : '0.75rem',
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      background: 'rgba(102, 126, 234, 0.2)',
      border: '1px solid rgba(102, 126, 234, 0.4)'
    },
    practiceButton: {
      ...commonStyles.primaryButton,
      padding: isMobile ? '0.5rem' : '0.75rem',
      fontSize: isMobile ? '0.85rem' : '0.9rem'
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
    <>
      <AppHeader
        title="Структурированное обучение"
        onBack={onBack}
        backLabel="← К Free Practice"
      />
      
      <div style={styles.container}>
        {/* Progress Section */}
        <div style={styles.progressSection}>
          <p style={styles.subtitle}>
            Пройди все модули от основ до экспертного уровня
          </p>
          
          <div style={commonStyles.progressBar}>
            <div 
              style={{
                ...commonStyles.progressFill,
                width: `${overallProgress}%`
              }}
            />
          </div>
          <p style={{...commonStyles.smallText, marginTop: '0.5rem'}}>
            Общий прогресс: {overallProgress.toFixed(0)}% 
            ({learningProgress.completedModuleIds.length} из {LEARNING_PATH_DATA.levels.reduce((sum, level) => sum + level.modules.length, 0)} модулей)
          </p>
        </div>

        {/* Levels and Modules */}
        {LEARNING_PATH_DATA.levels.map(level => {
          const completedInLevel = level.modules.filter(m => 
            learningProgress.completedModuleIds.includes(m.id)
          ).length;

          return (
            <div key={level.id} style={styles.levelSection}>
              <div style={styles.levelHeader}>
                <h2 style={styles.levelTitle}>
                  {level.name}
                </h2>
                <span style={commonStyles.badge}>
                  {completedInLevel}/{level.modules.length}
                </span>
              </div>
              
              <div style={styles.modulesGrid}>
                {level.modules.map(module => {
                  const isUnlocked = isModuleUnlocked(learningProgress, module.id);
                  const progress = getModuleProgress(gameState, module.id);
                  const isComplete = isModuleCompleted(progress, module);
                  const statusIcon = getModuleStatusIcon(module.id);
                  const isHovered = hoveredModule === module.id;

                  return (
                    <div
                      key={module.id}
                      style={{
                        ...styles.moduleCard,
                        ...(isComplete ? styles.moduleCardCompleted : {}),
                        ...(!isUnlocked ? styles.moduleCardLocked : {}),
                        ...(isHovered && isUnlocked ? commonStyles.cardHover : {})
                      }}
                      onMouseEnter={() => isUnlocked && setHoveredModule(module.id)}
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
                          📚 {module.questionIds.length} вопросов
                        </div>
                        {progress.avgScore > 0 && (
                          <div style={styles.moduleStat}>
                            ⭐ {progress.avgScore.toFixed(1)}/10
                          </div>
                        )}
                      </div>

                      {isUnlocked && (
                        <div style={styles.actionButtons}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartTheory(module.id);
                            }}
                            style={styles.theoryButton}
                          >
                            📖 Теория
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectModule(module.id);
                            }}
                            style={styles.practiceButton}
                          >
                            {progress.answeredQuestionIds.length === 0 
                              ? '🚀 Начать' 
                              : isComplete
                              ? '🔄 Повторить'
                              : '📝 Продолжить'}
                          </button>
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
    </>
  );
};

export default LearningPathScreen;

