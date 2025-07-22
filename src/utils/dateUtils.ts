// Utilitaires pour la gestion des dates et de l'archivage

export const getMonthName = (month: number): string => {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return monthNames[month - 1] || '';
};

export const getNextMonth = (month: number, year: number): { month: number; year: number } => {
  if (month === 12) {
    return { month: 1, year: year + 1 };
  }
  return { month: month + 1, year };
};

export const isEndOfMonth = (daysBeforeEnd: number = 3): boolean => {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysUntilEndOfMonth = lastDayOfMonth.getDate() - now.getDate();
  
  return daysUntilEndOfMonth <= daysBeforeEnd;
};

export const getDaysUntilEndOfMonth = (): number => {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDayOfMonth.getDate() - now.getDate();
};

export const isCurrentMonth = (month: number, year: number): boolean => {
  const now = new Date();
  return month === now.getMonth() + 1 && year === now.getFullYear();
};

export const formatArchiveDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
