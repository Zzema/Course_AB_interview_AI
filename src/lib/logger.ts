/**
 * ============================================================================
 * REMOTE LOGGER - Система логирования для мобильной отладки
 * ============================================================================
 * Сохраняет логи в localStorage для просмотра через Eruda Console
 * или Safari Web Inspector
 */

export interface LogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  data?: any;
  userAgent: string;
  url: string;
  viewport: {
    width: number;
    height: number;
  };
}

class RemoteLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Храним последние 100 логов
  private storageKey = 'ab_debug_logs';

  constructor() {
    // Загружаем существующие логи при инициализации
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      // Храним только последние maxLogs записей
      const logsToSave = this.logs.slice(-this.maxLogs);
      localStorage.setItem(this.storageKey, JSON.stringify(logsToSave));
    } catch (error) {
      console.error('Failed to save logs to storage:', error);
    }
  }

  private createEntry(
    level: LogEntry['level'],
    message: string,
    data?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  log(message: string, data?: any) {
    const entry = this.createEntry('log', message, data);
    console.log(`[Logger] ${message}`, data);
    this.logs.push(entry);
    this.saveToStorage();
  }

  warn(message: string, data?: any) {
    const entry = this.createEntry('warn', message, data);
    console.warn(`[Logger] ${message}`, data);
    this.logs.push(entry);
    this.saveToStorage();
  }

  error(message: string, data?: any) {
    const entry = this.createEntry('error', message, data);
    console.error(`[Logger] ${message}`, data);
    this.logs.push(entry);
    this.saveToStorage();
  }

  info(message: string, data?: any) {
    const entry = this.createEntry('info', message, data);
    console.info(`[Logger] ${message}`, data);
    this.logs.push(entry);
    this.saveToStorage();
  }

  /**
   * Получить все логи
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Получить логи за последние N минут
   */
  getRecentLogs(minutes: number = 5): LogEntry[] {
    const now = Date.now();
    const cutoff = now - minutes * 60 * 1000;
    
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= cutoff;
    });
  }

  /**
   * Получить логи по уровню
   */
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Очистить все логи
   */
  clear() {
    this.logs = [];
    localStorage.removeItem(this.storageKey);
    console.log('[Logger] Logs cleared');
  }

  /**
   * Экспортировать логи в JSON для отправки разработчику
   */
  export(): string {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Копировать логи в буфер обмена
   */
  async copyToClipboard(): Promise<boolean> {
    try {
      const exported = this.export();
      await navigator.clipboard.writeText(exported);
      console.log('[Logger] Logs copied to clipboard');
      return true;
    } catch (error) {
      console.error('[Logger] Failed to copy logs:', error);
      return false;
    }
  }

  /**
   * Получить статистику логов
   */
  getStats() {
    const levelCounts = {
      log: 0,
      warn: 0,
      error: 0,
      info: 0
    };

    this.logs.forEach(log => {
      levelCounts[log.level]++;
    });

    return {
      total: this.logs.length,
      levels: levelCounts,
      oldestLog: this.logs[0]?.timestamp,
      newestLog: this.logs[this.logs.length - 1]?.timestamp
    };
  }
}

// Singleton instance
export const logger = new RemoteLogger();

/**
 * Глобальные функции для быстрого доступа (опционально)
 * Можно использовать в Eruda Console:
 * 
 * window.debugLogs()        - показать все логи
 * window.debugExport()      - экспорт в JSON
 * window.debugClear()       - очистить логи
 * window.debugStats()       - статистика
 */
if (typeof window !== 'undefined') {
  (window as any).debugLogs = () => {
    console.table(logger.getLogs());
    return logger.getLogs();
  };

  (window as any).debugExport = () => {
    const exported = logger.export();
    console.log(exported);
    return exported;
  };

  (window as any).debugClear = () => {
    logger.clear();
    return 'Logs cleared';
  };

  (window as any).debugStats = () => {
    const stats = logger.getStats();
    console.log(stats);
    return stats;
  };

  (window as any).debugRecent = (minutes: number = 5) => {
    console.table(logger.getRecentLogs(minutes));
    return logger.getRecentLogs(minutes);
  };
}

