import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyArchiveModal } from '@/components/MonthlyArchiveModal';
import { MonthlyData, ArchivedMonth } from '@/types/cashflow';
import { isEndOfMonth, getDaysUntilEndOfMonth, isCurrentMonth, getMonthName } from '@/utils/dateUtils';
import { Archive, Calendar, Clock } from 'lucide-react';

interface ArchiveManagerProps {
  currentMonthData: MonthlyData;
  onArchive: (archivedMonth: ArchivedMonth) => void;
  onArchiveComplete?: () => void; // Callback appelé après archivage réussi
  className?: string;
}

export function ArchiveManager({ currentMonthData, onArchive, onArchiveComplete, className }: ArchiveManagerProps) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);

  const handleArchiveSuccess = (archivedMonth: ArchivedMonth) => {
    onArchive(archivedMonth);
    setShowArchiveModal(false);
    // Appeler le callback pour revenir à la page principale
    if (onArchiveComplete) {
      onArchiveComplete();
    }
  };
  const getCurrentMonthName = () => {
    return getMonthName(currentMonthData.month);
  };

  const isRealCurrentMonth = () => {
    const now = new Date();
    return currentMonthData.month === now.getMonth() + 1 && 
           currentMonthData.year === now.getFullYear();
  };

  // Ne pas afficher si ce n'est pas le mois courant ou si le mois est déjà archivé
  if (!isRealCurrentMonth() || currentMonthData.isArchived) {
    return null;
  }

  return (
    <div className={className}>
      {isEndOfMonth() && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Archive className="h-5 w-5" />
              Fin de mois approche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Calendar className="h-4 w-4" />
                <span>
                  Plus que {getDaysUntilEndOfMonth()} jour{getDaysUntilEndOfMonth() > 1 ? 's' : ''} avant la fin de {getCurrentMonthName()}
                </span>
              </div>
              
              <p className="text-sm text-orange-600">
                Il est temps de vérifier vos revenus et dépenses réels, puis d'archiver ce mois 
                pour passer automatiquement au mois suivant.
              </p>
              
              <Button 
                onClick={() => setShowArchiveModal(true)}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Archive className="h-4 w-4 mr-2" />
                Archiver {getCurrentMonthName()} {currentMonthData.year}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bouton d'archivage manuel toujours disponible */}
      <div className="flex justify-end mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowArchiveModal(true)}
          className="text-muted-foreground"
        >
          <Clock className="h-4 w-4 mr-2" />
          Archivage manuel
        </Button>
      </div>      <MonthlyArchiveModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        monthData={currentMonthData}
        onArchive={handleArchiveSuccess}
      />
    </div>
  );
}
