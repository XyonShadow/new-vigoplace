import { useState } from "react";
import Carousel from "react-material-ui-carousel";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';

function Item(props) {
  return (
    <Paper>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>

      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
}

const PostCategorization = (props) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
    },
  ];

  return (
    <Card
      sx={{
        display: "flex",
        pt: 2,
      }}
      {...props}
    >
      <Box
        sx={{
          width: "65%",
        }}
        x
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            ml: 4,
            mb: "14px",
            display: "flex",
            alignItems: "center",
            width: 400,
            background: "#F4F4F4",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Post id:"
            inputProps={{ "aria-label": "post id" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Divider />
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList sx={{ ml: 4 }} onChange={handleChange}>
              <Tab sx={{ mr: 10 }} label="Uncategorized Posts" value="1" />
              <Tab label="Categorized Posts" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Carousel navButtonsAlwaysVisible height={100} autoPlay={false} indicators={false} fullHeightHover={false} NextIcon={<NavigateNextOutlinedIcon />}>
              {items.map((item, i) => (
                <Item key={i} item={item} />
              ))}
            </Carousel>
          </TabPanel>
          <TabPanel value="2">Categorized Posts</TabPanel>
        </TabContext>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "35%",
          background: "#DFDCDC",
        }}
        x
      ></Box>
    </Card>
  );
};

export default PostCategorization;
