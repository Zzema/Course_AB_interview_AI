import React, { useEffect } from 'react';
import { GameState } from '../types';
import { getModuleById } from '../data/learningPathData';
import { getModuleProgress } from '../lib/learningPathManager';

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
  const module = getModuleById(moduleId);
  const progress = getModuleProgress(gameState, moduleId);
  const isMobile = window.innerWidth <= 768;

  // Скроллим к началу при открытии модуля
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [moduleId]);

  if (!module) {
    return <div>Модуль не найден</div>;
  }

  const completionPercentage = (progress.answeredQuestionIds.length / module.questionIds.length) * 100;
  const isCompleted = progress.checkpointCompleted;

  // Функция для рендеринга markdown-подобного контента
  const renderTheoryContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: (string | React.ReactNode[])[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} style={{ marginLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.8', listStyleType: 'disc' }}>
            {listItems.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', marginLeft: '0.5rem' }}>
                {Array.isArray(item) ? item : item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeLines.length > 0) {
        elements.push(
          <pre key={elements.length} style={{
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            marginBottom: '1rem',
            border: '1px solid #e0e0e0'
          }}>
            {codeLines.join('\n')}
          </pre>
        );
        codeLines = [];
      }
    };

    lines.forEach((line, index) => {
      // Пустая строка
      if (line.trim() === '') {
        flushList();
        if (!inCodeBlock) {
          elements.push(<div key={elements.length} style={{ height: '0.5rem' }} />);
        } else {
          codeLines.push('');
        }
        return;
      }

      // Разделитель
      if (line.trim() === '---') {
        flushList();
        elements.push(<hr key={elements.length} style={{ margin: '1.5rem 0', border: 'none', borderTop: '2px solid #e0e0e0' }} />);
        return;
      }

      // Заголовок H1 (без лидирующих пробелов)
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={elements.length} style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1rem' }}>
            {trimmedLine.substring(2)}
          </h1>
        );
        return;
      }

      // Заголовок H2
      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={elements.length} style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
            {trimmedLine.substring(3)}
          </h2>
        );
        return;
      }

      // Заголовок H3
      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={elements.length} style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>
            {trimmedLine.substring(4)}
          </h3>
        );
        return;
      }

      // Список
      if (trimmedLine.startsWith('• ') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const content = trimmedLine.startsWith('* ') ? trimmedLine.substring(2) : trimmedLine.substring(2);
        // Обработка жирного текста в списках
        const boldRegex = /\*\*(.+?)\*\*/g;
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;
        
        while ((match = boldRegex.exec(content)) !== null) {
          if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
          }
          parts.push(<strong key={match.index}>{match[1]}</strong>);
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
        }
        
        listItems.push(parts.length > 0 ? parts : content);
        return;
      }

      // Код блок
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Обычный текст
      flushList();
      
      // Обработка жирного текста **text**
      let processedLine = line;
      const boldRegex = /\*\*(.+?)\*\*/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      elements.push(
        <p key={elements.length} style={{ marginBottom: '0.75rem', lineHeight: '1.7' }}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });

    flushList();
    flushCodeBlock();

    return elements;
  };

  const styles = {
    container: {
      padding: isMobile ? '1rem' : '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      paddingBottom: isMobile ? '6rem' : '2rem'
    },
    backButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '1.5rem',
      fontWeight: 600
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: isMobile ? '1.5rem' : '2rem',
      marginBottom: '2rem',
      color: 'white'
    },
    moduleId: {
      fontSize: '0.9rem',
      opacity: 0.9,
      marginBottom: '0.5rem'
    },
    title: {
      fontSize: isMobile ? '1.75rem' : '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    description: {
      fontSize: '1.1rem',
      opacity: 0.95
    },
    progressSection: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    progressBar: {
      width: '100%',
      height: '12px',
      background: '#e0e0e0',
      borderRadius: '6px',
      overflow: 'hidden',
      marginTop: '1rem',
      marginBottom: '0.5rem'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      transition: 'width 0.3s ease'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
      gap: '1rem',
      marginTop: '1rem'
    },
    statCard: {
      textAlign: 'center' as const,
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    statValue: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#667eea',
      marginBottom: '0.25rem'
    },
    statLabel: {
      fontSize: '0.85rem',
      color: '#666'
    },
    theorySection: {
      background: 'white',
      borderRadius: '12px',
      padding: isMobile ? '1rem' : '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      lineHeight: '1.7'
    },
    theoryContent: {
      fontSize: '1rem',
      color: '#333',
      whiteSpace: 'pre-wrap' as const
    },
    actionButtons: {
      position: isMobile ? 'fixed' as const : 'relative' as const,
      bottom: isMobile ? 0 : 'auto',
      left: isMobile ? 0 : 'auto',
      right: isMobile ? 0 : 'auto',
      padding: isMobile ? '1rem' : 0,
      background: isMobile ? 'white' : 'transparent',
      boxShadow: isMobile ? '0 -2px 8px rgba(0,0,0,0.1)' : 'none',
      zIndex: isMobile ? 100 : 1,
      display: 'flex',
      gap: '1rem',
      flexDirection: isMobile ? 'column' as const : 'row' as const
    },
    startButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: 700,
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      transition: 'all 0.3s ease',
      flex: isMobile ? '1' : '0'
    },
    completedBadge: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        ← Назад к модулям
      </button>

      <div style={styles.header}>
        <div style={styles.moduleId}>Модуль {module.id}</div>
        <h1 style={styles.title}>{module.title}</h1>
        <p style={styles.description}>{module.description}</p>
      </div>

      <div style={styles.progressSection}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📊 Прогресс</h2>
        
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${completionPercentage}%` }} />
        </div>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Пройдено вопросов: {progress.answeredQuestionIds.length} из {module.questionIds.length}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
          Для завершения модуля: ответить на {module.checkpointCriteria.minQuestionsCompleted} вопросов с средним баллом {module.checkpointCriteria.minAvgScore}/10
        </p>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{progress.answeredQuestionIds.length}/{module.questionIds.length}</div>
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

        {isCompleted && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={styles.completedBadge}>
              ✅ Модуль завершен!
            </span>
          </div>
        )}
      </div>

      <div style={styles.theorySection}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📚 Теория</h2>
        <div style={styles.theoryContent}>
          {renderTheoryContent(module.theoryContent)}
        </div>
      </div>

      <div style={styles.actionButtons}>
        {!isCompleted && (
          <button 
            onClick={() => onStartQuestions(moduleId)}
            style={styles.startButton}
          >
            {progress.answeredQuestionIds.length === 0 
              ? '🚀 Начать изучение' 
              : '📝 Продолжить изучение'}
          </button>
        )}
        {isCompleted && (
          <button 
            onClick={() => onStartQuestions(moduleId)}
            style={{
              ...styles.startButton,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            🔄 Повторить модуль
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailScreen;

