import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DailyLoginsChart = ({ dailyLogins }) => {
  // Prepare data for the chart
  const data = {
    labels: [], // Will hold the labels for the x-axis
    datasets: [
      {
        label: 'Daily Logins', // Label for the dataset
        data: [], // Will hold the count data
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area under the line color
        fill: true, // Fill the area under the line
        borderWidth: 4, // Increase line thickness (change this value as needed)
        tension: 0.5, // Adjust the curve of the line (0 = straight line, 1 = very smooth)
      },
    ],
  };

  // Get the current date and calculate the start of the week (Sunday)
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Set to Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6); // End of the week (Saturday)

  // Initialize an array for the weekly logins data
  const weeklyLogins = Array(7).fill(0); // 7 days in a week

  // Map daily logins to the current week
  dailyLogins.forEach(login => {
    const loginDate = new Date(login.date);
    if (loginDate >= startOfWeek && loginDate <= endOfWeek) {
      const dayIndex = loginDate.getDay(); // Get day index (0-6)
      weeklyLogins[dayIndex] += login.count; // Aggregate count for each day
    }
  });

  // Prepare labels and data for the chart
  for (let i = 0; i < 7; i++) {
    const dateLabel = new Date(startOfWeek);
    dateLabel.setDate(startOfWeek.getDate() + i); // Get the date for each day
    data.labels.push(dateLabel.toLocaleDateString()); // Format the date as needed
    data.datasets[0].data.push(weeklyLogins[i]); // Add the count for the corresponding day
  }

  // Chart options
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Set tick step size for y-axis
        },
      },
    },
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default DailyLoginsChart;