import { useState } from "react";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Box,
  Typography,
  Button,
  Card,
  Checkbox,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SeverityPill } from "../severity-pill";

const KPI = (props) => {
  const [checkedValues, setCheckedValues] = useState([]);

  const firstCheckboxData = [
    { id: "checkbox1", value: "value1", label: "Users" },
    { id: "checkbox2", value: "value2", label: "Wallet count" },
    { id: "checkbox3", value: "value2", label: "Verified emails" },
    { id: "checkbox4", value: "value2", label: "Virtual accounts" },
    { id: "checkbox5", value: "value2", label: "Verified phone numbers" },
  ];

  const secondCheckboxData = [
    { id: "checkbox1", value: "value1", label: "Users" },
    { id: "checkbox2", value: "value2", label: "Wallet count" },
    { id: "checkbox3", value: "value2", label: "Verified emails" },
    { id: "checkbox4", value: "value2", label: "Virtual accounts" },
    { id: "checkbox5", value: "value2", label: "Verified phone numbers" },
  ];

  const thirdCheckboxData = [
    { id: "checkbox1", value: "value1", label: "Users" },
    { id: "checkbox2", value: "value2", label: "Wallet count" },
    { id: "checkbox3", value: "value2", label: "Verified emails" },
    { id: "checkbox4", value: "value2", label: "Virtual accounts" },
    { id: "checkbox5", value: "value2", label: "Verified phone numbers" },
  ];

  const fourthCheckboxData = [
    { id: "checkbox1", value: "value1", label: "Users" },
    { id: "checkbox2", value: "value2", label: "Wallet count" },
    { id: "checkbox3", value: "value2", label: "Verified emails" },
    { id: "checkbox4", value: "value2", label: "Virtual accounts" },
    { id: "checkbox5", value: "value2", label: "Verified phone numbers" },
  ];

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the checked value to the array
      setCheckedValues([...checkedValues, value]);
    } else {
      // Remove the unchecked value from the array
      setCheckedValues(checkedValues.filter((v) => v !== value));
    }
  };

  return (
    <Card {...props}>
      <Box
        sx={{
          p: 2,
          background: "#8135F9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
          }}
        >
          To begin enter your start and end date then click on the checkbox to
          select a KPI.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "6.5rem",
          p: 5,
        }}
      >
        <Box sx={{ width: "60%" }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="birthday">
                {" "}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  Start date
                </Typography>
              </label>
              <input type="date" id="start_date" name="start_date" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="birthday">
                {" "}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  End date
                </Typography>
              </label>
              <input type="date" id="end_date" name="end_date" />
            </Box>
          </Box>
          <Box
            sx={{
              mt: "52px",
              width: "100%",
              height: "433px",
              background: "#F4F4F4",
              borderRadius: 1,
            }}
          ></Box>
          <Box
            sx={{
              mt: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#282424",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Click the submit button to get your results
            </Typography>
            <Button variant="contained" sx={{ background: "#8135F9" }}>
              Submit
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            sx={{
              color: "#282424",
              fontSize: "14px",
            }}
          >
            Key performance indicators (KPI)
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxHeight: "600px",
              gap: 4,
              background: "#F4F4F4",
              overflowY: "scroll",
              border: "1px solid #E6E6E6",
              borderRadius: 1,
              p: 3,
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {firstCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    checked={checkedValues.includes(checkbox.value)}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {secondCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    checked={checkedValues.includes(checkbox.value)}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {thirdCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    checked={checkedValues.includes(checkbox.value)}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ border: "1px solid #E6E6E6", width: "100%" }}></Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}
            >
              {fourthCheckboxData.map((checkbox) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  key={checkbox.id}
                >
                  <label>{checkbox.label}</label>
                  <Checkbox
                    value={checkbox.value}
                    checked={checkedValues.includes(checkbox.value)}
                    onChange={handleCheckboxChange}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default KPI;
