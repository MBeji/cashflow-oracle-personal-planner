import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getMonthName } from '@/utils/cashflow';

interface CashFlowChartProps {
  data: MonthlyData[];
  alertThreshold: number;
}

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
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width="100%" height={chartHeight + 40} className="overflow-visible">
            {/* Ligne d'alerte */}
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
              stroke="url(#alertPattern)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Ligne de tendance */}
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
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
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill={isAlert ? "#ef4444" : "#22c55e"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  
                  {/* Étiquette du montant */}
                  <text
                    x={`${x}%`}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-xs font-medium fill-foreground"
                    style={{
                      textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white'
                    }}
                  >
                    {formatCurrency(month.endingBalance)}
                  </text>
                  
                  {/* Tooltip au survol */}
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="10"
                    fill="transparent"
                    className="cursor-pointer hover:fill-black hover:fill-opacity-10"
                  >
                    <title>
                      {getMonthName(month.month)} {month.year}: {formatCurrency(month.endingBalance)}
                    </title>
                  </circle>
                </g>
              );
            })}
            
            {/* Labels des mois (affichage simplifié) */}
            {data.filter((_, index) => index % Math.ceil(data.length / 8) === 0).map((month, displayIndex, filteredData) => {
              const originalIndex = data.indexOf(month);
              const x = (originalIndex / (data.length - 1)) * 100;
              
              return (
                <text
                  key={originalIndex}
                  x={`${x}%`}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {getMonthName(month.month).substring(0, 3)} {month.year.toString().substring(2)}
                </text>
              );
            })}
          </svg>
          
          {/* Légende */}
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Solde positif</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span>Solde en alerte</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-0.5 bg-destructive border-dashed border border-destructive"></div>
              <span>Seuil d'alerte ({formatCurrency(alertThreshold)})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
