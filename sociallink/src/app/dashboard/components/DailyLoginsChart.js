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
        pointRadius: 5, // Increase the point size for better visibility
        pointHoverRadius: 8, // Make the hover area around the dot larger
      },
    ],
  };

  // Get the current date and calculate the start and end of the week
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const distanceToMonday = day === 0 ? 6 : day - 1; // Calculate distance to Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - distanceToMonday);
  startOfWeek.setHours(0, 0, 0, 0); // Normalize to midnight

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday of the same week
  endOfWeek.setHours(23, 59, 59, 999); // End of day

  // Initialize an array for the weekly logins data
  const weeklyLogins = Array(7).fill(0); // 7 days in a week

  // Map daily logins to the current week
  dailyLogins.forEach((login) => {
    const loginDate = new Date(login.date); // Parse the login date
    loginDate.setHours(0, 0, 0, 0); // Normalize to midnight

    if (loginDate >= startOfWeek && loginDate <= endOfWeek) {
      const dayIndex = (loginDate.getDay() + 6) % 7; // Adjust Sunday (0) to the last index (6)
      weeklyLogins[dayIndex] += login.count;
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
      tooltip: {
        mode: 'nearest', // Show the tooltip for the nearest point
        intersect: false, // Allow hovering near a dot, not just directly on it
      },
    },
    interaction: {
      mode: 'nearest', // Interactions are triggered by the nearest point
      axis: 'xy', // Consider both x and y axes
      intersect: false, // No need to directly intersect the dot
    },
  };

  return <Line data={data} options={options} />;
};

export default DailyLoginsChart;