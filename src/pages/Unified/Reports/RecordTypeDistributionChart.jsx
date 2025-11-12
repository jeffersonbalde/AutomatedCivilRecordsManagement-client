// src/pages/Admin/Reports/components/RecordTypeDistributionChart.jsx
import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RecordTypeDistributionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-chart-pie fa-3x text-muted opacity-50 mb-3"></i>
        <p className="text-muted">No record type distribution data available</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map(item => item.color),
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

  // Calculate totals and percentages
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div>
      <div style={{ height: '250px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="row text-center mt-3">
        {data.map((item, index) => (
          <div key={index} className="col-4">
            <div className="fw-bold" style={{ color: item.color }}>
              {item.count}
            </div>
            <small className="text-muted">
              {item.type} ({total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%)
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordTypeDistributionChart;