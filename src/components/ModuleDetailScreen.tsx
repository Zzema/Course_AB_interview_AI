import React, { useEffect, useState } from 'react';
import { GameState } from '../types';
import { LEARNING_PATH_DATA, LearningModule } from '../data/learningPathData';
import { getModuleProgress, isModuleCompleted } from '../lib/learningPathManager';
import AppHeader from './AppHeader';
import { getCommonStyles, COLORS, GRADIENTS } from '../styles/commonStyles';

interface ModuleDetailScreenProps {
  gameState: GameState;
  moduleId: string;
  onBack: () => void;
  onStartQuestions: (moduleId: string) => void;
}

const ModuleDetailScreen: React.FC<ModuleDetailScreenProps> = ({
  gameState,
  moduleId,
  onBack,
  onStartQuestions
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [moduleId]);

  const commonStyles = getCommonStyles(isMobile);

  // Находим модуль
  const module = LEARNING_PATH_DATA.levels
    .flatMap(level => level.modules)
    .find(m => m.id === moduleId);

  if (!module) {
    return <div>Модуль не найден</div>;
  }

  const progress = getModuleProgress(gameState, moduleId);
  const isComplete = isModuleCompleted(progress, module);
  const completionPercentage = (progress.answeredQuestionIds.length / module.questionIds.length) * 100;

  const styles = {
    container: {
      ...commonStyles.pageContainer
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: isMobile ? '1.5rem' : '2rem'
    },
    moduleId: {
      ...commonStyles.badge,
      background: GRADIENTS.primary,
      marginBottom: '0.75rem'
    },
    title: {
      ...commonStyles.heading1,
      margin: 0,
      marginBottom: '0.5rem'
    },
    description: {
      ...commonStyles.bodyText,
      textAlign: 'center' as const,
      maxWidth: '800px',
      margin: '0 auto'
    },
    progressSection: {
      ...commonStyles.card,
      marginBottom: isMobile ? '1.5rem' : '2rem'
    },
    statsGrid: {
      ...commonStyles.grid3Col,
      marginTop: '1rem'
    },
    statCard: {
      textAlign: 'center' as const,
      padding: isMobile ? '0.75rem' : '1rem',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px'
    },
    statValue: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 700,
      color: COLORS.primary,
      marginBottom: '0.25rem'
    },
    statLabel: {
      ...commonStyles.smallText
    },
    theorySection: {
      ...commonStyles.card,
      marginBottom: isMobile ? '1.5rem' : '2rem'
    },
    theoryContent: {
      lineHeight: 1.8,
      color: COLORS.text.secondary
    },
    actionButton: {
      ...commonStyles.primaryButton,
      width: '100%',
      marginBottom: isMobile ? '1rem' : '1.5rem'
    }
  };

  // Парсим и рендерим markdown-like контент
  const renderTheoryContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Пустая строка
      if (line.trim() === '') {
        elements.push(<div key={key++} style={{ height: '0.75rem' }} />);
        continue;
      }

      // Заголовок H1 (###)
      if (line.startsWith('###')) {
        elements.push(
          <h3 key={key++} style={{
            ...commonStyles.heading3,
            marginTop: '1.5rem',
            marginBottom: '0.75rem',
            color: COLORS.primary
          }}>
            {line.replace(/^###\s*/, '')}
          </h3>
        );
        continue;
      }

      // Заголовок H2 (##)
      if (line.startsWith('##')) {
        elements.push(
          <h2 key={key++} style={{
            ...commonStyles.heading2,
            marginTop: '2rem',
            marginBottom: '1rem',
            color: COLORS.primary
          }}>
            {line.replace(/^##\s*/, '')}
          </h2>
        );
        continue;
      }

      // Заголовок H1 (#)
      if (line.startsWith('#')) {
        elements.push(
          <h1 key={key++} style={{
            ...commonStyles.heading1,
            marginTop: '2rem',
            marginBottom: '1rem',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}>
            {line.replace(/^#\s*/, '')}
          </h1>
        );
        continue;
      }

      // Список (начинается с •, -, или *)
      if (line.match(/^[•\-\*]\s/)) {
        const content = line.replace(/^[•\-\*]\s*/, '');
        const parts = parseInlineFormatting(content);
        
        elements.push(
          <div key={key++} style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            paddingLeft: '1rem'
          }}>
            <span style={{ color: COLORS.primary }}>•</span>
            <span style={commonStyles.bodyText}>{parts}</span>
          </div>
        );
        continue;
      }

      // Обычный текст
      const parts = parseInlineFormatting(line);
      elements.push(
        <p key={key++} style={{
          ...commonStyles.bodyText,
          marginBottom: '0.75rem'
        }}>
          {parts}
        </p>
      );
    }

    return elements;
  };

  // Парсим inline форматирование (жирный текст)
  const parseInlineFormatting = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let currentText = '';
    let i = 0;
    let partKey = 0;

    while (i < text.length) {
      // Жирный текст (**text**)
      if (text[i] === '*' && text[i + 1] === '*') {
        if (currentText) {
          parts.push(currentText);
          currentText = '';
        }
        
        const endIndex = text.indexOf('**', i + 2);
        if (endIndex !== -1) {
          const boldText = text.substring(i + 2, endIndex);
          parts.push(
            <strong key={`bold-${partKey++}`} style={{ color: 'white', fontWeight: 600 }}>
              {boldText}
            </strong>
          );
          i = endIndex + 2;
          continue;
        }
      }
      
      currentText += text[i];
      i++;
    }

    if (currentText) {
      parts.push(currentText);
    }

    return parts;
  };

  return (
    <>
      <AppHeader
        title={`Модуль ${moduleId}`}
        onBack={onBack}
        backLabel="← К модулям"
      />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.moduleId}>Модуль {module.id}</div>
          <h1 style={styles.title}>{module.title}</h1>
          <p style={styles.description}>{module.description}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onStartQuestions(moduleId)}
          style={styles.actionButton}
        >
          {progress.answeredQuestionIds.length === 0 
            ? '🚀 Начать практику' 
            : isComplete
            ? '🔄 Повторить практику'
            : '📝 Продолжить практику'}
        </button>

        {/* Progress Section */}
        <div style={styles.progressSection}>
          <h2 style={commonStyles.heading3}>📊 Прогресс</h2>
          
          <div style={{...commonStyles.progressBar, marginTop: '1rem', marginBottom: '0.5rem'}}>
            <div style={{ ...commonStyles.progressFill, width: `${completionPercentage}%` }} />
          </div>
          
          <p style={{...commonStyles.smallText, marginBottom: '1rem'}}>
            Пройдено вопросов: {progress.answeredQuestionIds.length} из {module.questionIds.length}
          </p>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>
                {progress.answeredQuestionIds.length}/{module.questionIds.length}
              </div>
              <div style={styles.statLabel}>Вопросов</div>
            </div>
            
            {progress.avgScore > 0 && (
              <div style={styles.statCard}>
                <div style={styles.statValue}>{progress.avgScore.toFixed(1)}/10</div>
                <div style={styles.statLabel}>Средний балл</div>
              </div>
            )}
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{module.checkpointCriteria.minAvgScore}/10</div>
              <div style={styles.statLabel}>Требуется</div>
            </div>
          </div>

          {isComplete && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: GRADIENTS.success,
              borderRadius: '8px',
              textAlign: 'center' as const,
              fontWeight: 600
            }}>
              ✅ Модуль завершен!
            </div>
          )}
        </div>

        {/* Theory Section */}
        <div style={styles.theorySection}>
          <h2 style={{...commonStyles.heading2, marginBottom: '1.5rem'}}>📚 Теория</h2>
          <div style={styles.theoryContent}>
            {renderTheoryContent(module.theoryContent)}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModuleDetailScreen;

