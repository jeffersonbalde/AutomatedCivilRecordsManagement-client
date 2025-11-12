// src/pages/Admin/Reports/components/RegistrationTrendChart.jsx - IMPROVED VERSION
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RegistrationTrendChart = ({ data, period, recordType }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-chart-line fa-3x text-muted opacity-50 mb-3"></i>
        <p className="text-muted">No data available for the selected period and record type</p>
        <small className="text-muted">
          Try selecting a different year or record type
        </small>
      </div>
    );
  }

  // Group data by type
  const types = [...new Set(data.map(item => item.type))];
  
  // Get all unique periods
  const allPeriods = [...new Set(data.map(item => item.period))].sort();
  
  const chartData = {
    labels: allPeriods,
    datasets: types.map((type, index) => {
      const typeData = data.filter(item => item.type === type);
      const colors = ['#018181', '#e83e8c', '#6c757d', '#ffc107', '#20c997'];
      
      // Create data array with zeros for all periods
      const datasetData = allPeriods.map(period => {
        const item = typeData.find(d => d.period === period);
        return item ? item.count : 0;
      });
      
      return {
        label: type,
        data: datasetData,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        tension: 0.4,
        fill: false,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Registrations'
        }
      },
      x: {
        title: {
          display: true,
          text: period === 'yearly' ? 'Year' : 'Month'
        }
      }
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RegistrationTrendChart;