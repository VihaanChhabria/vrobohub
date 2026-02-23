const DEFAULT_MAX_HOPPER_SIZE = 100;

const safeParseJson = (value) => {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/** Parse "80%" or "80" to 0.8; returns null if invalid. */
const parsePercentToDecimal = (val) => {
  if (val == null || val === "") return null;
  const s = String(val).trim().replace(/%$/, "");
  const n = Number(s);
  if (Number.isNaN(n)) return null;
  return n > 1 ? n / 100 : n;
};

const transformItemWithPercentage = (item, maxHopperSize) => {
  if (item == null || typeof item !== "object") return item;
  const hopper = maxHopperSize ?? DEFAULT_MAX_HOPPER_SIZE;

  let percentage = null;
  if ("percentage" in item) {
    percentage = Number(item.percentage);
    if (Number.isNaN(percentage)) percentage = null;
  }
  if (percentage == null && "hopperPercent" in item) {
    percentage = parsePercentToDecimal(item.hopperPercent);
  }
  if (percentage == null && "shotsPercent" in item) {
    percentage = parsePercentToDecimal(item.shotsPercent);
  }

  if (percentage == null) return item;

  const fuelShot = Math.round(percentage * hopper * 100) / 100;
  const { percentage: _p, hopperPercent: _h, shotsPercent: _s, ...rest } = item;
  return { ...rest, fuelShot };
};

/** Transform nested shotInfo { hopperPercent, shotsPercent } -> fuelShot. */
const transformShotInfo = (shotInfo, maxHopperSize) => {
  if (shotInfo == null || typeof shotInfo !== "object") return shotInfo;
  const hopper = maxHopperSize ?? DEFAULT_MAX_HOPPER_SIZE;
  const hopperPct = parsePercentToDecimal(shotInfo.hopperPercent);
  const shotsPct = parsePercentToDecimal(shotInfo.shotsPercent);
  const percentage = hopperPct ?? shotsPct ?? null;
  if (percentage == null) return shotInfo;
  const fuelShot = Math.round(percentage * hopper * 100) / 100;
  const { hopperPercent: _h, shotsPercent: _s, ...rest } = shotInfo;
  return { ...rest, fuelShot };
};

/**
 * Transform autoRobotPositions: items may have "percentage" or nested shotInfo with hopperPercent/shotsPercent.
 */
const transformAutoRobotPositions = (value, rowMaxHopperSize) => {
  const parsed = safeParseJson(value);
  if (parsed == null) return value;

  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
      const transformed = transformItemWithPercentage(item, rowMaxHopperSize);
      if (
        transformed.shotInfo != null &&
        typeof transformed.shotInfo === "object"
      ) {
        return {
          ...transformed,
          shotInfo: transformShotInfo(transformed.shotInfo, rowMaxHopperSize),
        };
      }
      return transformed;
    });
  }

  if (typeof parsed === "object" && parsed !== null) {
    if (Array.isArray(parsed.autoScores)) {
      return {
        ...parsed,
        autoScores: parsed.autoScores.map((item) =>
          transformItemWithPercentage(item, rowMaxHopperSize),
        ),
      };
    }
    return parsed;
  }

  return value;
};

/**
 * Transform fuelShotAndSourceInfo: array of { source, hopperPercent, shotsPercent } or { percentage, source }.
 * Pit format: object with shotPercentages, sourcePercentages, maxHopperSize inside.
 */
const transformFuelShotAndSourceInfo = (value, rowMaxHopperSize) => {
  const parsed = safeParseJson(value);
  if (parsed == null) return value;

  if (Array.isArray(parsed)) {
    return parsed.map((item) =>
      transformItemWithPercentage(item, rowMaxHopperSize),
    );
  }

  if (typeof parsed === "object" && parsed !== null) {
    const maxHopperSize =
      parsed.maxHopperSize ?? rowMaxHopperSize ?? DEFAULT_MAX_HOPPER_SIZE;

    const result = { ...parsed };
    if (Array.isArray(parsed.shotPercentages)) {
      result.shotPercentages = parsed.shotPercentages.map((item) =>
        transformItemWithPercentage(item, maxHopperSize),
      );
    }
    if (Array.isArray(parsed.sourcePercentages)) {
      result.sourcePercentages = parsed.sourcePercentages.map((item) =>
        transformItemWithPercentage(item, maxHopperSize),
      );
    }
    return result;
  }

  return value;
};

/**
 * Build a map of team number -> maxHopperSize from pit scouting rows (teamNumber, maxHopperSize).
 * Used to look up hopper size for match rows that have selectTeam but no maxHopperSize.
 */
export const buildTeamToMaxHopperSize = (pitRows) => {
  const map = {};
  if (!Array.isArray(pitRows)) return map;
  pitRows.forEach((r) => {
    const t =
      r.teamNumber != null && String(r.teamNumber).trim() !== ""
        ? Number(r.teamNumber)
        : null;
    const h =
      r.maxHopperSize != null && String(r.maxHopperSize).trim() !== ""
        ? Number(r.maxHopperSize)
        : null;
    if (t != null && !Number.isNaN(t) && h != null && !Number.isNaN(h)) {
      map[t] = h;
      map[String(t)] = h;
    }
  });
  return map;
};

/**
 * Transform a single row of scouting data.
 * maxHopperSize: from row.maxHopperSize, or from teamToMaxHopperSize[row.selectTeam] for match data, else null (then DEFAULT is used).
 */
const transformRow = (row, teamToMaxHopperSize = null) => {
  let maxHopperSize =
    row.maxHopperSize != null && String(row.maxHopperSize).trim() !== ""
      ? Number(row.maxHopperSize)
      : null;

  if (maxHopperSize == null && teamToMaxHopperSize && row.selectTeam != null) {
    const key = row.selectTeam;
    const byNum = Number(key);
    maxHopperSize =
      teamToMaxHopperSize[key] ??
      teamToMaxHopperSize[String(key)] ??
      (Number.isNaN(byNum) ? null : teamToMaxHopperSize[byNum]) ??
      null;
  }

  const result = { ...row };

  if ("autoRobotPositions" in row) {
    result.autoRobotPositions = transformAutoRobotPositions(
      row.autoRobotPositions,
      maxHopperSize,
    );
  }

  if ("fuelShotAndSourceInfo" in row) {
    result.fuelShotAndSourceInfo = transformFuelShotAndSourceInfo(
      row.fuelShotAndSourceInfo,
      maxHopperSize,
    );
  }

  return result;
};

/**
 * Parse CSV text into array of row objects (first row = headers).
 * Handles quoted fields per RFC 4180.
 */
const parseCsvText = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  const parseRow = (line) => {
    const result = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if ((c === "," && !inQuotes) || c === "\n" || c === "\r") {
        result.push(current);
        current = "";
      } else if (inQuotes || c !== ",") {
        current += c;
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const row = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? "";
    });
    rows.push(row);
  }
  return rows;
};

/**
 * Parse a CSV file and return rows as array of objects.
 */
export const parseCsvFile = async (file) => {
  const text = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const t = e.target?.result;
      if (t == null) reject(new Error("Failed to read file"));
      else resolve(t);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file, "UTF-8");
  });
  return parseCsvText(text);
};

/**
 * Transform parsed CSV rows (array of objects) by updating
 * autoRobotPositions and fuelShotAndSourceInfo with fuelShot values.
 * @param {Array} rows - Parsed CSV rows
 * @param {{ teamToMaxHopperSize?: Record<string|number, number> }} options - Optional. teamToMaxHopperSize: map from team number to maxHopperSize (from pit data) so match rows use correct hopper size when row has selectTeam but no maxHopperSize.
 */
export const transformScoutingRows = (rows, options = null) => {
  if (!Array.isArray(rows)) return [];
  const teamToMaxHopperSize =
    options && options.teamToMaxHopperSize ? options.teamToMaxHopperSize : null;
  return rows.map((row) => transformRow(row, teamToMaxHopperSize));
};
