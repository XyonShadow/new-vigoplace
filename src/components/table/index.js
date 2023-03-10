
import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { useRouter } from "next/router";
import { format } from "date-fns";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import {
    Box,
    Button,
    ListItemIcon,
    MenuItem,
    Typography,
    TextField,
  } from "@mui/material";
  
  //Icons Imports
  import { AccountCircle, Send } from "@mui/icons-material";
  import { LoadingButton, TabContext, TabList } from "@mui/lab";

export const MaterialTable = ({columns,data,rowCount,isLoading,isError,isFetching, status, setStatus, handleStatus, pagination, setPagination, globalFilter, setGlobalFilter, refetch, ...props}) =>{



 return(
  <>
   <MaterialReactTable
        // enableColumnFilterModes
        // enableColumnOrdering
        // enableGrouping
        // enablePinning
        // enableRowActions
        // enableRowSelection

        columns={columns}
        data={data}
        enableStickyHeader
        enableStickyFooter
        manualPagination
        onPaginationChange={setPagination}
        rowCount={rowCount}
        onGlobalFilterChange={setGlobalFilter}
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
        enableGlobalFilter={false}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children:
                  "Error loading data, Please use the refresh button on the table to retry",
              }
            : undefined
        }
        // getPaginationRowModel={(props)=> console.log(props, "propppp")}
        // manualPagination
        // onPaginationChange={}
        // muiTablePaginationProps={}

        renderTopToolbarCustomActions={({ table }) => {
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Tooltip arrow title="Refresh Data">
                <IconButton onClick={() => refetch()}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={status}
                  defaultValue="None"
                  onChange={handleStatus}
                  label="Gender"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"completed"}>Completed</MenuItem>
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"processing"}>Processing</MenuItem>
                  <MenuItem value={"declined"}>Declined</MenuItem>
                </Select>
              </FormControl>

              {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
            <Input
              id="standard-adornment-password"
              type={'text'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
  
                    aria-label="search"
                    // onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                  >
                   <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            </FormControl> */}
            </div>
          );
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
          pagination,
        }}
        muiTableContainerProps={{ sx: { height: "75vh" } }}
      />
      </>
)};
