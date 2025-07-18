// Utilitaire pour sauvegarder et charger les données dans localStorage
export const StorageService = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return defaultValue;
    }
  },

  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  },

  export: () => {
    const data = {
      settings: StorageService.load('cashflow-settings', null),
      customExpenses: StorageService.load('cashflow-custom-expenses', []),
      vacationExpenses: StorageService.load('cashflow-vacation-expenses', {}),
      chantierExpenses: StorageService.load('cashflow-chantier-expenses', {}),
      customMonthlyExpenses: StorageService.load('cashflow-monthly-expenses', {}),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  import: (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};
