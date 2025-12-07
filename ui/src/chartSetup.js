// Central Chart.js registration to ensure controllers/elements/plugins
// are available before any React components render charts.
import { Chart as ChartJS } from "chart.js";
import {
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";

// Register commonly used controllers/elements/plugins
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  // boxplot plugin
  BoxPlotController,
  BoxAndWiskers
);

export default ChartJS;
