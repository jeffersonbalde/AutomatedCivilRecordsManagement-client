// src/pages/Admin/Reports/components/GenderDistributionChart.jsx
import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderDistributionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-venus-mars fa-3x text-muted opacity-50 mb-3"></i>
        <p className="text-muted">No gender distribution data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.sex),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          '#018181', // Male - teal
          '#e83e8c', // Female - pink
          '#6c757d', // Other - gray
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Calculate totals
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const maleCount = data.find(item => item.sex === 'Male')?.count || 0;
  const femaleCount = data.find(item => item.sex === 'Female')?.count || 0;

  return (
    <div>
      <div style={{ height: '250px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="row text-center mt-3">
        <div className="col-6">
          <div className="fw-bold text-primary">{maleCount}</div>
          <small className="text-muted">Male ({total > 0 ? ((maleCount / total) * 100).toFixed(1) : 0}%)</small>
        </div>
        <div className="col-6">
          <div className="fw-bold text-pink">{femaleCount}</div>
          <small className="text-muted">Female ({total > 0 ? ((femaleCount / total) * 100).toFixed(1) : 0}%)</small>
        </div>
      </div>
    </div>
  );
};

export default GenderDistributionChart;