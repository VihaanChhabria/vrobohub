export const DEFAULT_MAX_HOPPER_CAPACITY = 100;

export const getTeamPitRow = (pitData, teamNumber) => {
  if (!Array.isArray(pitData) || teamNumber == null) return null;
  const num = Number(teamNumber);
  return (
    pitData.find((p) => Number(p.teamNumber) === num) ||
    pitData.find((p) => String(p.teamNumber) === String(teamNumber)) ||
    null
  );
};

export const normalizeFuelPercent = (val) => {
  if (val == null) return null;
  if (typeof val === "number") {
    if (val > 1) return val / 100;
    if (val >= 0) return val;
    return null;
  }
  const s = String(val).trim().replace(/%$/, "");
  const n = Number(s);
  if (Number.isNaN(n)) return null;
  return n > 1 ? n / 100 : n;
};

export const classifyAction = (source) => {
  if (!source) return "hub";
  const s = String(source).toLowerCase();
  if (s.includes("shuttle") || s.includes("feeder") || s.includes("source")) {
    return "shuttle";
  }
  return "hub";
};

export const getClimbLevel = (climbPosition, climbFailed) => {
  if (climbFailed) return 0;
  if (!climbPosition) return 0;
  const s = String(climbPosition).toLowerCase();
  if (s.includes("l3") || s.includes("high")) return 3;
  if (s.includes("l2") || s.includes("mid")) return 2;
  if (s.includes("l1") || s.includes("low")) return 1;
  return 0;
};

export const getClimbSide = (climbPosition) => {
  if (!climbPosition) return null;
  const s = String(climbPosition).toLowerCase();
  if (s.includes("outpost")) return "Outpost";
  if (s.includes("middle") || s.includes("center")) return "Middle";
  if (s.includes("depot")) return "Depot";
  return null;
};
