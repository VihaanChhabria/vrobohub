import React from "react";
import ToggleButtonGroup from "./ToggleButtonGroup";

const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  const options = [
    { value: "team-specific", label: "Team Specific", ariaLabel: "team specific" },
    { value: "overall", label: "Overall", ariaLabel: "overall" },
  ];

  return (
    <ToggleButtonGroup
      value={viewMode}
      onChange={onViewModeChange}
      options={options}
      exclusive={true}
      ariaLabel="view mode"
    />
  );
};

export default ViewModeToggle;

