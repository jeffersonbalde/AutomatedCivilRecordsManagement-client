// src/pages/Admin/Reports/components/MonthlySummaryChart.jsx - FIXED VERSION
import React from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySummaryChart = ({ data }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-chart-bar fa-3x text-muted opacity-50 mb-3"></i>
        <p className="text-muted">No monthly data available</p>
      </div>
    );
  }

  // Ensure we have data for all 12 months
  const monthlyData = Array(12).fill({ births: 0, marriages: 0, deaths: 0 });
  data.forEach(item => {
    if (item.month >= 1 && item.month <= 12) {
      monthlyData[item.month - 1] = {
        births: item.births || 0,
        marriages: item.marriages || 0,
        deaths: item.deaths || 0
      };
    }
  });

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Births',
        data: monthlyData.map(item => item.births),
        backgroundColor: 'rgba(1, 129, 129, 0.8)',
        borderColor: '#018181',
        borderWidth: 1,
      },
      {
        label: 'Marriages',
        data: monthlyData.map(item => item.marriages),
        backgroundColor: 'rgba(232, 62, 140, 0.8)',
        borderColor: '#e83e8c',
        borderWidth: 1,
      },
      {
        label: 'Deaths',
        data: monthlyData.map(item => item.deaths),
        backgroundColor: 'rgba(108, 117, 125, 0.8)',
        borderColor: '#6c757d',
        borderWidth: 1,
      },
    ],
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
          text: 'Months'
        }
      }
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlySummaryChart;