import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RingChartCard({ records }) {
  const categories = [...new Set(records.map(r => r.category))];
  const amounts = categories.map(cat =>
    records
      .filter(r => r.category === cat)
      .reduce((sum, r) => sum + r.amount, 0)
  );

  // More vibrant + soft palette
  const colors = [
    "rgba(255, 199, 44, 0.95)",
    "rgba(255, 114, 94, 0.9)",
    "rgba(137, 207, 240, 0.9)",
    "rgba(186, 255, 201, 0.9)",
    "rgba(255, 173, 214, 0.9)",
    "rgba(255, 240, 150, 0.9)",
    "rgba(204, 153, 255, 0.9)",
    "rgba(255, 177, 109, 0.9)",
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255,255,255,0.85)",
          font: { size: 12 },
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.6)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <div
      className="
        w-64 h-64 mx-auto p-4 rounded-3xl
        bg-white/10 backdrop-blur-xl border border-white/10
        shadow-[0_0_40px_rgba(255,255,255,0.05)]
      "
    >
      <Doughnut data={data} options={options} />
    </div>
  );
}
