import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChartCard({ records }) {
  const categories = [...new Set(records.map(r => r.category))];
  const dataPoints = categories.map(cat =>
    records.filter(r => r.category === cat).reduce((sum, r) => sum + r.amount, 0)
  );

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: dataPoints,
        borderColor: "rgba(255, 199, 44, 0.95)",    // Yellow warm glow
        borderWidth: 3,
        backgroundColor: "rgba(255,199,44,0.15)",
        tension: 0.45,
        pointRadius: 4,
        pointBackgroundColor: "rgba(255,199,44,1)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.6)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255,255,255,0.7)",
          font: { weight: "500" },
        },
        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },
      x: {
        ticks: {
          color: "rgba(255,255,255,0.7)",
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div
      className="
        w-full h-60 p-4 rounded-3xl 
        bg-white/10 backdrop-blur-xl border border-white/10
        shadow-[0_0_40px_rgba(255,255,255,0.05)]
      "
    >
      <Line data={data} options={options} />
    </div>
  );
}
