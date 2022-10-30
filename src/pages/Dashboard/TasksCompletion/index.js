import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import apiClient from "src/helpers/axios/apiClient";
import { Grid, Box } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import CheckIcon from "@mui/icons-material/Check";

import formatHttpApiError from "src/helpers/formatHttpApiError";
import getCommonOptions from "src/helpers/axios/getCommonOptions";
import StatCard from "./StatCard";
export default function TasksCompletion() {
  const [isLoading, setIsLoading] = useState(false);
  const [completionStats, setCompletionStats] = useState({
    completed: null,
    pending: null,
  });

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("api/dashboard/tasks-completion/", getCommonOptions())
      .then((res) => {
        const { data } = res;
        if (data) {
          const stats = {};
          data.forEach((d) => {
            if (d.completed === true) {
              stats.completed = d.count;
              return;
            }
            if (d.completed === false) {
              stats.pending = d.count;
            }
          });

          setCompletionStats(stats);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        const formattedError = formatHttpApiError(error);
        enqueueSnackbar(formattedError);
        setIsLoading(false);
      });
  }, [enqueueSnackbar, setIsLoading]);

  const totalTasksCount =
    (completionStats.pending || 0) + (completionStats.completed || 0);
  return (
    <Box sx={{ flexGrow: 1, mb: (theme) => theme.spacing(2) }}>
      <Grid container spacing={3}>
        <StatCard
          title="Total Tasks"
          value={totalTasksCount}
          loading={false}
          icon={<AssignmentIcon fontSize="small" />}
        />
        <StatCard
          title="Tasks Due"
          value={completionStats.pending}
          loading={false}
          icon={<AssignmentLateIcon fontSize="small" />}
        />
        <StatCard
          title="Tasks Completed"
          value={completionStats.completed}
          loading={false}
          icon={<CheckIcon fontSize="small" />}
        />
      </Grid>
    </Box>
  );
}
