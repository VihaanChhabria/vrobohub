import csv
import json
from datetime import datetime

# Constants
EVENT_KEY = "2025mrcmp"
TIMESTAMP = 1752429315
ISO_TIMESTAMP = datetime.utcfromtimestamp(TIMESTAMP).isoformat() + "Z"

# Input/output files
input_file = "input.csv"
output_file = "output.json"

# Output data
output = []

with open(input_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        for i in range(6):  # startPoses0 through startPoses5
            if row[f"startPoses{i}"].lower() == "true":
                output.append({
                    "event_key": EVENT_KEY,
                    "timestamp": ISO_TIMESTAMP,
                    "scouted_by": ["7414", "103"],
                    "match_number": "qm" + row["matchNumber"],
                    "alliance": "red" if row["alliance"] == "redAlliance" else "blue",
                    "team_number": int(row["selectTeam"]),
                    "start_pose": i,
                    "auto_coral_place_l1_count": int(row["autoCoralPlaceL1Count"]),
                    "auto_coral_place_l2_count": int(row["autoCoralPlaceL2Count"]),
                    "auto_coral_place_l3_count": int(row["autoCoralPlaceL3Count"]),
                    "auto_coral_place_l4_count": int(row["autoCoralPlaceL4Count"]),
                    "auto_coral_place_drop_miss_count": int(row["autoCoralPlaceDropMissCount"]),
                    "auto_coral_pick_preload_count": int(row["autoCoralPickPreloadCount"]),
                    "auto_coral_pick_station_count": int(row["autoCoralPickStationCount"]),
                    "auto_coral_pick_mark1_count": int(row["autoCoralPickMark1Count"]),
                    "auto_coral_pick_mark2_count": int(row["autoCoralPickMark2Count"]),
                    "auto_coral_pick_mark3_count": int(row["autoCoralPickMark3Count"]),
                    "auto_algae_place_net_shot": int(row["autoAlgaePlaceNetShot"]),
                    "auto_algae_place_processor": int(row["autoAlgaePlaceProcessor"]),
                    "auto_algae_place_drop_miss": int(row["autoAlgaePlaceDropMiss"]),
                    "auto_algae_pick_reef_count": int(row["autoAlgaePickReefCount"]),
                    "auto_algae_pick_mark1_count": int(row["autoAlgaePickMark1Count"]),
                    "auto_algae_pick_mark2_count": int(row["autoAlgaePickMark2Count"]),
                    "auto_algae_pick_mark3_count": int(row["autoAlgaePickMark3Count"]),
                    "auto_passed_start_line": row["autoPassedStartLine"].lower() == "true",
                    "teleop_coral_place_l1_count": int(row["teleopCoralPlaceL1Count"]),
                    "teleop_coral_place_l2_count": int(row["teleopCoralPlaceL2Count"]),
                    "teleop_coral_place_l3_count": int(row["teleopCoralPlaceL3Count"]),
                    "teleop_coral_place_l4_count": int(row["teleopCoralPlaceL4Count"]),
                    "teleop_coral_place_drop_miss_count": int(row["teleopCoralPlaceDropMissCount"]),
                    "teleop_coral_pick_station_count": int(row["teleopCoralPickStationCount"]),
                    "teleop_coral_pick_carpet_count": int(row["teleopCoralPickCarpetCount"]),
                    "teleop_algae_place_net_shot": int(row["teleopAlgaePlaceNetShot"]),
                    "teleop_algae_place_processor": int(row["teleopAlgaePlaceProcessor"]),
                    "teleop_algae_place_drop_miss": int(row["teleopAlgaePlaceDropMiss"]),
                    "teleop_algae_pick_reef_count": int(row["teleopAlgaePickReefCount"]),
                    "teleop_algae_pick_carpet_count": int(row["teleopAlgaePickCarpetCount"]),
                    "shallow_climb_attempted": row["shallowClimbAttempted"].lower() == "true",
                    "deep_climb_attempted": row["deepClimbAttempted"].lower() == "true",
                    "park_attempted": row["parkAttempted"].lower() == "true",
                    "climb_failed": row["climbFailed"].lower() == "true",
                    "played_defense": row["playedDefense"].lower() == "true",
                    "broke_down": row["brokeDown"].lower() == "true",
                    "comment": row["comment"]
                })

# Write output JSON
with open(output_file, "w") as f:
    json.dump(output, f, indent=2)
