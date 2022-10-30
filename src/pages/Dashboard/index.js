import React from "react";
import TasksCompletion from "./TasksCompletion";
import TasksByCategory from "./TasksByCategory";
import Seo from "src/components/SEO";
const Dashboard = () => {
  return (
    <div>
      <Seo title="Dashboard" />
      <TasksCompletion />
      <TasksByCategory />
    </div>
  );
};

export default Dashboard;
