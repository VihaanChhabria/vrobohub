import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import { getClimbLevel, getClimbSide } from "./rebuiltAnalyticsUtils";
import PieChartCard from "./PieChartCard";

const ClimbDistributionRow = ({
  matchScoutingData,
  pitData,
  selectedTeam,
  tbaEventMatchesData,
}) => {
  const {
    attemptedClimbsData,
    climbLevelsData,
    partnerClimbsData,
  } = useMemo(() => {
    const basePie = {
      attemptedClimbsData: null,
      climbLevelsData: null,
      partnerClimbsData: null,
    };

    if (!Array.isArray(matchScoutingData) || matchScoutingData.length === 0) {
      return basePie;
    }

    const attemptedCounts = {
      "Outpost-Success": 0,
      "Outpost-Failure": 0,
      "Middle-Success": 0,
      "Middle-Failure": 0,
      "Depot-Success": 0,
      "Depot-Failure": 0,
    };

    const levelCounts = {
      "No Climb": 0,
      L1: 0,
      L2: 0,
      L3: 0,
    };

    matchScoutingData.forEach((m) => {
      const level = getClimbLevel(m.climbPosition, m.climbFailed);
      const side = getClimbSide(m.climbPosition);
      const success = !m.climbFailed && level > 0;

      if (side) {
        const key = `${side}-${success ? "Success" : "Failure"}`;
        if (attemptedCounts[key] != null) {
          attemptedCounts[key] += 1;
        }
      }

      if (level === 0) levelCounts["No Climb"] += 1;
      else if (level === 1) levelCounts.L1 += 1;
      else if (level === 2) levelCounts.L2 += 1;
      else if (level === 3) levelCounts.L3 += 1;
    });

    const attemptedTotal = Object.values(attemptedCounts).reduce(
      (sum, v) => sum + v,
      0,
    );
    const levelTotal = Object.values(levelCounts).reduce(
      (sum, v) => sum + v,
      0,
    );

    const attemptedClimbsData =
      attemptedTotal > 0
        ? {
            labels: Object.keys(attemptedCounts),
            datasets: [
              {
                data: Object.values(attemptedCounts),
                backgroundColor: [
                  "rgba(0, 150, 0, 0.85)",
                  "rgba(0, 150, 0, 0.35)",
                  "rgba(220, 120, 0, 0.85)",
                  "rgba(220, 120, 0, 0.35)",
                  "rgba(90, 0, 160, 0.85)",
                  "rgba(90, 0, 160, 0.35)",
                ],
              },
            ],
          }
        : null;

    const climbLevelsData =
      levelTotal > 0
        ? {
            labels: Object.keys(levelCounts),
            datasets: [
              {
                data: Object.values(levelCounts),
                backgroundColor: [
                  "rgba(120, 120, 120, 0.7)",
                  "rgba(0, 120, 255, 0.7)",
                  "rgba(0, 180, 120, 0.7)",
                  "rgba(255, 160, 0, 0.7)",
                ],
              },
            ],
          }
        : null;

    let withPartner = 0;
    let solo = 0;

    if (
      Array.isArray(tbaEventMatchesData) &&
      tbaEventMatchesData.length > 0 &&
      Array.isArray(pitData)
    ) {
      const pitByTeam = {};
      pitData.forEach((p) => {
        if (p.teamNumber != null) {
          pitByTeam[Number(p.teamNumber)] = p;
        }
      });

      const capable = (teamNum) => {
        const pit = pitByTeam[Number(teamNum)];
        if (!pit || pit.climbingAbility == null) return false;
        const s = String(pit.climbingAbility).toLowerCase();
        return s !== "none" && s !== "no climb";
      };

      const matchByNumber = {};
      tbaEventMatchesData.forEach((m) => {
        if (!m || !m.match) return;
        matchByNumber[m.match] = m;
      });

      matchScoutingData.forEach((m) => {
        const level = getClimbLevel(m.climbPosition, m.climbFailed);
        const success = level > 0;
        if (!success) return;
        const matchKeySuffix = m.match_key
          ? String(m.match_key).replace(`${m.event_key}_`, "")
          : null;
        const matchId = matchKeySuffix || String(m.matchNumber || "");
        if (!matchId) return;

        const tbaMatch = matchByNumber[matchId];
        if (!tbaMatch) return;

        const myTeam = Number(selectedTeam);
        const alliance = tbaMatch.red.includes(myTeam)
          ? tbaMatch.red
          : tbaMatch.blue.includes(myTeam)
            ? tbaMatch.blue
            : null;
        if (!alliance) return;

        const partners = alliance.filter((t) => t !== myTeam);
        const hasCapablePartner = partners.some((t) => capable(t));

        if (hasCapablePartner) withPartner += 1;
        else solo += 1;
      });
    }

    const partnerTotal = withPartner + solo;
    const partnerClimbsData =
      partnerTotal > 0
        ? {
            labels: ["With Partner", "Solo / No Capable Partner"],
            datasets: [
              {
                data: [withPartner, solo],
                backgroundColor: [
                  "rgba(0, 180, 120, 0.8)",
                  "rgba(200, 0, 0, 0.6)",
                ],
              },
            ],
          }
        : null;

    return { attemptedClimbsData, climbLevelsData, partnerClimbsData };
  }, [matchScoutingData, pitData, selectedTeam, tbaEventMatchesData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <PieChartCard
          title="Attempted Climbs"
          chartData={attemptedClimbsData}
          emptyMessage="No climb attempts recorded."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <PieChartCard
          title="Climb Levels"
          chartData={climbLevelsData}
          emptyMessage="No climb level data recorded."
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <PieChartCard
          title="Partner Climbs"
          chartData={partnerClimbsData}
          emptyMessage="No successful climbs with alliance context available."
        />
      </Grid>
    </Grid>
  );
};

export default ClimbDistributionRow;
