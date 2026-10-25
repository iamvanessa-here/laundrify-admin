import React from 'react';
import Card from '../../ui/Card';
import { revenueChartData } from '../../../data/mockData';
import './RevenueChart.css';

const RevenueChart = () => {
  const { labels, datasets } = revenueChartData;

  // Find max value for scaling
  const allValues = datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allValues);

  // SVG chart dimensions
  const chartWidth = 700;
  const chartHeight = 280;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Generate points for each dataset
  const generatePath = (data) => {
    const points = data.map((value, index) => {
      const x = padding.left + (index / (data.length - 1)) * plotWidth;
      const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
      return { x, y };
    });

    // Create smooth curve
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = curr.x - (curr.x - prev.x) / 3;
      path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  };

  // Generate area fill path
  const generateAreaPath = (data) => {
    const linePath = generatePath(data);
    const lastX = padding.left + plotWidth;
    const firstX = padding.left;
    const bottomY = padding.top + plotHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Y-axis labels
  const yLabels = [0, 10, 20, 30, 40, 50];

  return (
    <Card className="revenue-chart" padding="md">
      <div className="revenue-chart__header">
        <div>
          <h3 className="revenue-chart__title">Grafik Pendapatan</h3>
          <p className="revenue-chart__subtitle">Perbandingan pendapatan bulanan</p>
        </div>
        <div className="revenue-chart__legend">
          <div className="revenue-chart__legend-item">
            <span className="revenue-chart__legend-dot" style={{ background: '#2563EB' }}></span>
            <span>2026</span>
          </div>
          <div className="revenue-chart__legend-item">
            <span className="revenue-chart__legend-dot" style={{ background: '#94A3B8' }}></span>
            <span>2025</span>
          </div>
        </div>
      </div>

      <div className="revenue-chart__body">
        <svg
          className="revenue-chart__svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {yLabels.map((label, index) => {
            const y = padding.top + plotHeight - (label / maxValue) * plotHeight;
            return (
              <g key={label}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray={index === 0 ? '0' : '4 4'}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="Inter"
                >
                  {label}Jt
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {labels.map((label, index) => {
            const x = padding.left + (index / (labels.length - 1)) * plotWidth;
            return (
              <text
                key={label}
                x={x}
                y={chartHeight - 10}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontFamily="Inter"
              >
                {label}
              </text>
            );
          })}

          {/* Area fills */}
          {datasets.map((dataset, index) => (
            <path
              key={`area-${index}`}
              d={generateAreaPath(dataset.data)}
              fill={dataset.color}
              opacity="0.08"
            />
          ))}

          {/* Lines */}
          {datasets.map((dataset, index) => (
            <path
              key={`line-${index}`}
              d={generatePath(dataset.data)}
              fill="none"
              stroke={dataset.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Data points for current year */}
          {datasets[0].data.map((value, index) => {
            if (value === 0) return null;
            const x = padding.left + (index / (datasets[0].data.length - 1)) * plotWidth;
            const y = padding.top + plotHeight - (value / maxValue) * plotHeight;
            return (
              <g key={`point-${index}`}>
                <circle cx={x} cy={y} r="4" fill="white" stroke={datasets[0].color} strokeWidth="2" />
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

export default RevenueChart;