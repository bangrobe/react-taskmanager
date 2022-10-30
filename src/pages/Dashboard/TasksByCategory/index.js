import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import apiClient from "src/helpers/axios/apiClient";

import getCommonOptions from "src/helpers/axios/getCommonOptions";
import formatHttpApiError from "src/helpers/formatHttpApiError";
import StatChart from "./StatChart";
import Filters from "./Filters";
// const tableData = [
//   {
//     label: "Feature",
//     color: "#ff0000",
//     count: 5,
//   },
//   {
//     label: "Bug",
//     color: "#cccccc",
//     count: 2,
//   },
// ];

// const chartData = {
//   datasets: [
//     {
//       backgroundColor: ["#ff0000", "#cccccc"],
//       borderColor: ["#ff0000", "#cccccc"],
//       borderWidth: 1,
//       data: [2, 5],
//     },
//   ],
//   labels: ["Feature", "Bug"],
// };

const generateChartData = (data = []) => {
  let chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };

  data.forEach((d) => {
    chartData.labels.push(d.name);
    chartData.datasets[0].data.push(d.count);
    chartData.datasets[0].backgroundColor.push(`#${d.color}`);
    chartData.datasets[0].borderColor.push(`#${d.color}`);
  });
  return chartData;
};

const generateTableData = (data = []) => {
  const dataForTable = data.map((d) => {
    return {
      label: d.name,
      color: `#${d.color}`,
      count: d.count,
    };
  });
  return dataForTable;
};

const baseAPIUrl = "/api/dashboard/tasks-by-category/";

const TasksByCategory = () => {
  const { enqueueSnackBar } = useSnackbar();
  const [queries, setQueries] = useState({ completed: "False" });
  const [apiUrl, setApiUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (queries.completed === "True" || queries.completed === "False") {
      setApiUrl(`${baseAPIUrl}?completed=${queries.completed}`);
      return;
    }

    setApiUrl(baseAPIUrl);
  }, [queries]);

  useEffect(() => {
    if (!apiUrl) {
      return;
    }
    setIsLoading(true);
    apiClient
      .get(apiUrl, getCommonOptions())
      .then((res) => {
        const data = res.data;
        if (data) {
          setTableData(generateTableData(data));
          setChartData(generateChartData(data));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        const formattedError = formatHttpApiError(error);
        enqueueSnackBar(formattedError);
      });
  }, [enqueueSnackBar, setIsLoading, setTableData, setChartData, apiUrl]);
  return (
    <div>
      <StatChart
        tableData={tableData}
        chartData={chartData}
        isLoading={isLoading}
        filters={<Filters setQueries={setQueries} />}
      />
    </div>
  );
};

export default TasksByCategory;
