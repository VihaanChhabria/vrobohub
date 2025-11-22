import { Box, Typography } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

const ExportPage = () => {
  const { event_key: selectedEvent } = useParams();

const handleExport = (format) => {
    // Replace this with your real export logic
    // e.g. call an API, format data, create blob and download, etc.
    console.log(`Exporting event "${selectedEvent}" as ${format}`);
};

return (
    <Box>
        <Typography
            variant="h4"
            component="h1"
            fontWeight={"bold"}
            sx={{
                textAlign: "center",
                paddingTop: 3,
            }}
        >
            How Do You Want To Export?
        </Typography>

        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "stretch",
                gap: 2,
                mt: 2,
                paddingLeft: 2,
                paddingRight: 2,
            }}
        >
            <Box
                component="button"
                onClick={() => handleExport("csv")}
                sx={{
                    flex: 1,
                    minHeight: 100,
                    bgcolor: "primary.main",
                    color: "common.white",
                    border: "none",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 3,
                    cursor: "pointer",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                    },
                    "&:active": { transform: "translateY(-1px)" },
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    📄 Export as CSV
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Comma-separated values for spreadsheets
                </Typography>
            </Box>

            <Box
                component="button"
                onClick={() => handleExport("pdf")}
                sx={{
                    flex: 1,
                    minHeight: 100,
                    bgcolor: "secondary.main",
                    color: "common.white",
                    border: "none",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 3,
                    cursor: "pointer",
                    transition: "transform 150ms ease, box-shadow 150ms ease",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                    },
                    "&:active": { transform: "translateY(-1px)" },
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    📦 Export as PDF
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Printable, fixed-layout document
                </Typography>
            </Box>
        </Box>
    </Box>
);
};

export default ExportPage;
