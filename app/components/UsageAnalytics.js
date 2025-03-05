import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const dateRangeOptions = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 365 days", value: 365 },
];

export default function UsageAnalytics({ apiKeys }) {
  const [selectedRange, setSelectedRange] = useState(7);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate total usage
  const totalUsage = apiKeys.reduce((sum, key) => sum + key.usage, 0);

  // Calculate usage by key
  const usageByKey = apiKeys.map((key) => ({
    name: key.name,
    usage: key.usage,
    percentage: (key.usage / totalUsage) * 100,
  }));

  // Fetch usage data from Supabase
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate the start date based on selected range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - selectedRange);

        // Fetch usage data from Supabase
        const { data, error } = await supabase
          .from("api_usage")
          .select("date, usage_count")
          .gte("date", startDate.toISOString().split("T")[0])
          .lte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true });

        if (error) throw error;

        // Process the data
        const processedData = data.reduce((acc, curr) => {
          const date = new Date(curr.date);
          const dateStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          // If we already have data for this date, add to it
          const existingIndex = acc.findIndex((item) => item.date === dateStr);
          if (existingIndex !== -1) {
            acc[existingIndex].usage += curr.usage_count;
          } else {
            acc.push({
              date: dateStr,
              usage: curr.usage_count,
            });
          }
          return acc;
        }, []);

        setUsageData(processedData);
      } catch (err) {
        console.error("Error fetching usage data:", err);
        setError("Failed to load usage data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [selectedRange]);

  // Generate date labels based on selected range
  const getDateLabels = (days) => {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
    }
    return labels;
  };

  const dateLabels = getDateLabels(selectedRange);

  // Map the usage data to match the date labels
  const dailyUsage = dateLabels.map((label) => {
    const dataPoint = usageData.find((d) => d.date === label);
    return dataPoint ? dataPoint.usage : 0;
  });

  const lineChartData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Daily API Usage",
        data: dailyUsage,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: usageByKey.map((key) => key.name),
    datasets: [
      {
        data: usageByKey.map((key) => key.usage),
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "API Usage Analytics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Usage by API Key",
      },
    },
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-dark-primary p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-1">
            Total API Calls
          </h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {totalUsage.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-dark-primary p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-1">
            Active API Keys
          </h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {apiKeys.length}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-dark-primary p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted mb-1">
            Average Usage per Key
          </h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {Math.round(totalUsage / apiKeys.length).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 dark:bg-dark-primary p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-dark-muted">
              Usage Over Time
            </h3>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(Number(e.target.value))}
              className="text-sm bg-white dark:bg-dark-secondary border border-gray-300 dark:border-dark-muted rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              {error}
            </div>
          ) : (
            <Line options={chartOptions} data={lineChartData} />
          )}
        </div>
        <div className="bg-gray-50 dark:bg-dark-primary p-4 rounded-lg">
          <Doughnut options={doughnutOptions} data={doughnutChartData} />
        </div>
      </div>
    </div>
  );
}
