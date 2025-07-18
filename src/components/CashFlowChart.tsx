import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getMonthName } from '@/utils/cashflow';

interface CashFlowChartProps {
  data: MonthlyData[];
  alertThreshold: number;
}

// Fonction pour formater les montants en milliers (k) sans unité
const formatToK = (amount: number): string => {
  if (Math.abs(amount) >= 1000) {
    return (amount / 1000).toFixed(1) + 'k';
  }
  return amount.toString();
};

export function CashFlowChart({ data, alertThreshold }: CashFlowChartProps) {
  if (data.length === 0) return null;

  const maxBalance = Math.max(...data.map(month => month.endingBalance));
  const minBalance = Math.min(...data.map(month => month.endingBalance));
  const range = maxBalance - minBalance;
  const padding = range * 0.1;
  const chartHeight = 200;

  const getYPosition = (balance: number) => {
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((balance - minBalance + padding) / (range + 2 * padding)) * chartHeight;
  };

  const getAlertLineY = () => getYPosition(alertThreshold);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Évolution du solde</CardTitle>
      </CardHeader>      <CardContent>
        <div className="relative">
          <svg width="100%" height={chartHeight + 60} className="overflow-visible" style={{ marginLeft: '40px', marginRight: '20px' }}>
            {/* Axe Y avec graduations */}
            <g>
              {/* Ligne de l'axe Y */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={chartHeight}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              
              {/* Graduations de l'axe Y */}
              {Array.from({ length: 5 }, (_, i) => {
                const value = minBalance + (i / 4) * range;
                const y = getYPosition(value);
                
                return (
                  <g key={i}>
                    {/* Ligne de grille horizontale */}
                    <line
                      x1="0"
                      y1={y}
                      x2="100%"
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                    
                    {/* Étiquette de valeur */}
                    <text
                      x="-5"
                      y={y + 3}
                      textAnchor="end"
                      className="text-xs fill-muted-foreground"
                    >
                      {formatToK(value)}
                    </text>
                  </g>
                );
              })}
            </g>            {/* Ligne d'alerte */}
            <defs>
              <pattern id="alertPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                <rect width="4" height="4" fill="none"/>
                <path d="M0,4 L4,0" stroke="#ef4444" strokeWidth="1"/>
              </pattern>
            </defs>
            
            <line
              x1="0"
              y1={getAlertLineY()}
              x2="100%"
              y2={getAlertLineY()}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.7"
            />
            
            {/* Étiquette pour la ligne d'alerte */}
            <text
              x="100%"
              y={getAlertLineY() - 5}
              textAnchor="end"
              className="text-xs fill-destructive font-medium"
              style={{
                textShadow: '0 0 3px white, 0 0 3px white'
              }}
            >
              Seuil: {formatToK(alertThreshold)}
            </text>
              {/* Ligne de tendance */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={data.map((month, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = getYPosition(month.endingBalance);
                return `${x}%,${y}`;
              }).join(' ')}
            />
              {/* Points */}
            {data.map((month, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = getYPosition(month.endingBalance);
              const isAlert = month.endingBalance < alertThreshold;
              
              return (
                <g key={index}>                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="5"
                    fill={isAlert ? "#ef4444" : "#3b82f6"}
                    stroke="white"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                    {/* Étiquette du montant */}
                  <text
                    x={`${x}%`}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-xs font-bold fill-foreground"
                    style={{
                      textShadow: '0 0 4px white, 0 0 4px white, 0 0 4px white, 0 0 4px white'
                    }}
                  >
                    {formatToK(month.endingBalance)}
                  </text>
                    {/* Tooltip au survol */}
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer hover:fill-black hover:fill-opacity-5"
                  >
                    <title>
                      {getMonthName(month.month)} {month.year}: {formatCurrency(month.endingBalance)}
                    </title>
                  </circle>
                </g>
              );
            })}
              {/* Labels des mois (affichage simplifié) */}
            {data.filter((_, index) => index % Math.ceil(data.length / 6) === 0 || index === data.length - 1).map((month, displayIndex, filteredData) => {
              const originalIndex = data.indexOf(month);
              const x = (originalIndex / (data.length - 1)) * 100;
              
              return (
                <text
                  key={originalIndex}
                  x={`${x}%`}
                  y={chartHeight + 35}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground font-medium"
                >
                  {getMonthName(month.month).substring(0, 3)} {month.year.toString().substring(2)}
                </text>
              );
            })}
          </svg>
            {/* Légende */}
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Évolution du solde</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span>Solde en alerte</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-destructive border-dashed border border-destructive"></div>
              <span>Seuil d'alerte ({formatToK(alertThreshold)})</span>
            </div>
            <div className="text-xs text-muted-foreground">
              📊 Montants en milliers (k)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
