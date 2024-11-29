import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { format, parse } from "date-fns";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DailyReadings() {
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);
  const [reading1Verse, setReading1Verse] = useState(null);
  const [reading1Text, setReading1Text] = useState(null);
  const [reading1Option2Verse, setReading1Option2Verse] = useState(null);
  const [reading1TextOption2, setReading1TextOption2] = useState(null);
  const [reading2Verse, setReading2Verse] = useState(null);
  const [reading2Text, setReading2Text] = useState(null);
  const [reading2Option1Verse, setReading2Option1Verse] = useState(null);
  const [reading2TextOption1, setReading2TextOption1] = useState(null);
  const [reading3Verse, setReading3Verse] = useState(null);
  const [reading3Text, setReading3Text] = useState(null);
  const [reading4Verse, setReading4Verse] = useState(null);
  const [reading4Text, setReading4Text] = useState(null);
  const [reading5Verse, setReading5Verse] = useState(null);
  const [reading5Text, setReading5Text] = useState(null);
  const [reading6Verse, setReading6Verse] = useState(null);
  const [reading6Text, setReading6Text] = useState(null);
  const [reading7Verse, setReading7Verse] = useState(null);
  const [reading7Text, setReading7Text] = useState(null);

  //2ND BATCH
  const [processionPalmVerse, setProcessionPalmVerse] = useState(null);
  const [processionPalmsGospel, setProcessionPalmsGospel] = useState(null);
  const [processionPalmsGospel2Verse, setProcessionPalmsGospel2Verse] =
    useState(null);
  const [processionPalmsGospel2Text, setProcessionPalmsGospel2Text] =
    useState(null);
  const [responsorialPsalmVerse, setResponsorialPsalmVerse] = useState(null);
  const [responsorialPsalmRespond, setResponsorialPsalmRespond] =
    useState(null);
  const [responsorialPsalmText1, setResponsorialPsalmText1] = useState(null);
  const [responsorialPsalmText2, setResponsorialPsalmText2] = useState(null);
  const [responsorialPsalmText3, setResponsorialPsalmText3] = useState(null);
  const [responsorialPsalmText4, setResponsorialPsalmText4] = useState(null);
  const [responsorialPsalmText5, setResponsorialPsalmText5] = useState(null);
  const [responsorialPsalmText6, setResponsorialPsalmText6] = useState(null);
  const [responsorialPsalmVerseOPT2, setResponsorialPsalmVerseOPT2] =
    useState(null);
  const [responsorialPsalmText1OPT2, setResponsorialPsalmText1OPT2] =
    useState(null);
  const [responsorialPsalmText2OPT2, setResponsorialPsalmText2OPT2] =
    useState(null);
  const [responsorialPsalmResponseOPT2, setResponsorialPsalmResponseOPT2] =
    useState(null);
  const [responsorialPsalmText3OPT2, setResponsorialPsalmText3OPT2] =
    useState(null);
  const [responsorialPsalmText4OPT2, setResponsorialPsalmText4OPT2] =
    useState(null);
  const [responsorialPsalmText5OPT2, setResponsorialPsalmText5OPT2] =
    useState(null);

  ////3RD BATCH
  const [responsorialText1, setResponsorialText1] = useState(null);
  const [responsorialText2, setResponsorialText2] = useState(null);
  const [responsorialText3, setResponsorialText3] = useState(null);
  const [beforeGospelText, setBeforeGospelText] = useState(null);
  const [verseb4GospelOPT2, setVerseb4GospelOPT2] = useState(null);
  const [b4GospelTextOPT2, setB4GospelTextOPT2] = useState(null);
  const [alleluiaVerse, setAlleluiaVerse] = useState(null);
  const [alleluiaText, setAlleluiaText] = useState(null);
  const [alleluiaOPT2, setAlleluiaOPT2] = useState(null);
  const [alleluiaTextOPT2, setAlleluiaTextOPT2] = useState(null);
  const [gospelVerse, setGospelVerse] = useState(null);
  const [gospelText, setGospelText] = useState(null);
  const [gospelVerse2, setGospelVerse2] = useState(null);
  const [gospelTextOption2, setGospelTextOption2] = useState(null);
  const [verseBeforeGospel, setVerseBeforeGospel] = useState(null);

  /////////////////////////////////////////////////////EDIT SECTION///////////////////////////////////////////////
  const [fetchDate, setFetchDate] = useState(null);
  const [id, setId] = useState(null);
  const [editBibleReadingId, setEditBibleReadingId] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const [editTitle, setEditTitle] = useState(null);
  const [editReading1Verse, setEditReading1Verse] = useState(null);
  const [editReading1Text, setEditReading1Text] = useState(null);
  const [editReading1Option2Verse, setEditReading1Option2Verse] =
    useState(null);
  const [editReading1TextOption2, setEditReading1TextOption2] = useState(null);
  const [editReading2Verse, setEditReading2Verse] = useState(null);
  const [editReading2Text, setEditReading2Text] = useState(null);
  const [editReading2Option1Verse, setEditReading2Option1Verse] =
    useState(null);
  const [editReading2TextOption1, setEditReading2TextOption1] = useState(null);
  const [editReading3Verse, setEditReading3Verse] = useState(null);
  const [editReading3Text, setEditReading3Text] = useState(null);
  const [editReading4Verse, setEditReading4Verse] = useState(null);
  const [editReading4Text, setEditReading4Text] = useState(null);
  const [editReading5Verse, setEditReading5Verse] = useState(null);
  const [editReading5Text, setEditReading5Text] = useState(null);
  const [editReading6Verse, setEditReading6Verse] = useState(null);
  const [editReading6Text, setEditReading6Text] = useState(null);
  const [editReading7Verse, setEditReading7Verse] = useState(null);
  const [editReading7Text, setEditReading7Text] = useState(null);

  //EDIT2ND BATCH

  const [editProcessionPalmVerse, setEditProcessionPalmVerse] = useState(null);
  const [editProcessionPalmsGospel, setEditProcessionPalmsGospel] =
    useState(null);
  const [editProcessionPalmsGospel2Verse, setEditProcessionPalmsGospel2Verse] =
    useState(null);
  const [editProcessionPalmsGospel2Text, setEditProcessionPalmsGospel2Text] =
    useState(null);
  const [editResponsorialPsalmVerse, setEditResponsorialPsalmVerse] =
    useState(null);
  const [editResponsorialPsalmRespond, setEditResponsorialPsalmRespond] =
    useState(null);
  const [editResponsorialPsalmText1, setEditResponsorialPsalmText1] =
    useState(null);
  const [editResponsorialPsalmText2, setEditResponsorialPsalmText2] =
    useState(null);
  const [editResponsorialPsalmText3, setEditResponsorialPsalmText3] =
    useState(null);
  const [editResponsorialPsalmText4, setEditResponsorialPsalmText4] =
    useState(null);
  const [editResponsorialPsalmText5, setEditResponsorialPsalmText5] =
    useState(null);
  const [editResponsorialPsalmText6, setEditResponsorialPsalmText6] =
    useState(null);
  const [editResponsorialPsalmVerseOPT2, setEditResponsorialPsalmVerseOPT2] =
    useState(null);
  const [editResponsorialPsalmText1OPT2, setEditResponsorialPsalmText1OPT2] =
    useState(null);
  const [editResponsorialPsalmText2OPT2, setEditResponsorialPsalmText2OPT2] =
    useState(null);
  const [
    editResponsorialPsalmResponseOPT2,
    setEditResponsorialPsalmResponseOPT2,
  ] = useState(null);

  const [editResponsorialPsalmText3OPT2, setEditResponsorialPsalmText3OPT2] =
    useState(null);
  const [editResponsorialPsalmText4OPT2, setEditResponsorialPsalmText4OPT2] =
    useState(null);
  const [editResponsorialPsalmText5OPT2, setEditResponsorialPsalmText5OPT2] =
    useState(null);

  ////EDIT 3RD BATCH
  const [editResponsorialText1, setEditResponsorialText1] = useState(null);
  const [editResponsorialText2, setEditResponsorialText2] = useState(null);
  const [editResponsorialText3, setEditResponsorialText3] = useState(null);
  const [editBeforeGospelText, setEditBeforeGospelText] = useState(null);
  const [editVerseb4GospelOPT2, setEditVerseb4GospelOPT2] = useState(null);
  const [editB4GospelTextOPT2, setEditB4GospelTextOPT2] = useState(null);
  const [editAlleluiaVerse, setEditAlleluiaVerse] = useState(null);
  const [editAlleluiaText, setEditAlleluiaText] = useState(null);
  const [editAlleluiaOPT2, setEditAlleluiaOPT2] = useState(null);
  const [editAlleluiaTextOPT2, setEditAlleluiaTextOPT2] = useState(null);
  const [editGospelVerse, setEditGospelVerse] = useState(null);
  const [editGospelText, setEditGospelText] = useState(null);
  const [editGospelVerse2, setEditGospelVerse2] = useState(null);
  const [editGospelTextOption2, setEditGospelTextOption2] = useState(null);
  const [editVerseBeforeGospel, setEditVerseBeforeGospel] = useState(null);

  const [dailyReadingToast, setDailyReadingToast] = useState({
    error: false,
    success: false,
  });

  const [editDailyReadingToast, setEditDailyReadingToast] = useState({
    error: false,
    success: false,
  });

  const [tabValue, setTabValue] = useState(0);
  const [postTabValue, setPostTabValue] = useState(0);
  const [editTabValue, setEditTabValue] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleAccordionToggle = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePostTabChange = (event, newValue) => {
    setPostTabValue(newValue);
  };

  const handleEditTabChange = (event, newValue) => {
    setEditTabValue(newValue);
  };

  const handleDate = (event) => {
    setDate(event.target.value);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleReading1Verse = (event) => {
    setReading1Verse(event.target.value);
  };

  const handleReading1Text = (event) => {
    setReading1Text(event.target.value);
  };

  const handleReading1Option2Verse = (event) => {
    setReading1Option2Verse(event.target.value);
  };

  const handleReading1TextOption2 = (event) => {
    setReading1TextOption2(event.target.value);
  };

  const handleReading2Verse = (event) => {
    setReading2Verse(event.target.value);
  };

  const handleReading2Text = (event) => {
    setReading2Text(event.target.value);
  };

  const handleReading2Option1Verse = (event) => {
    setReading2Option1Verse(event.target.value);
  };

  const handleReading2TextOption1 = (event) => {
    setReading2TextOption1(event.target.value);
  };

  const handleReading3Verse = (event) => {
    setReading3Verse(event.target.value);
  };

  const handleReading3Text = (event) => {
    setReading3Text(event.target.value);
  };

  const handleReading4Verse = (event) => {
    setReading4Verse(event.target.value);
  };

  const handleReading4Text = (event) => {
    setReading4Text(event.target.value);
  };

  const handleReading5Verse = (event) => {
    setReading5Verse(event.target.value);
  };

  const handleReading5Text = (event) => {
    setReading5Text(event.target.value);
  };

  const handleReading6Verse = (event) => {
    setReading6Verse(event.target.value);
  };

  const handleReading6Text = (event) => {
    setReading6Text(event.target.value);
  };

  const handleReading7Verse = (event) => {
    setReading7Verse(event.target.value);
  };

  const handleReading7Text = (event) => {
    setReading7Text(event.target.value);
  };

  const handleProcessionPalmVerse = (event) => {
    setProcessionPalmVerse(event.target.value);
  };

  const handleProcessionPalmsGospel = (event) => {
    setProcessionPalmsGospel(event.target.value);
  };

  const handleProcessionPalmsGospel2Verse = (event) => {
    setProcessionPalmsGospel2Verse(event.target.value);
  };

  const handleProcessionPalmsGospel2Text = (event) => {
    setProcessionPalmsGospel2Text(event.target.value);
  };

  const handleResponsorialPsalmVerse = (event) => {
    setResponsorialPsalmVerse(event.target.value);
  };

  const handleResponsorialPsalmRespond = (event) => {
    setResponsorialPsalmRespond(event.target.value);
  };

  const handleResponsorialPsalmText1 = (event) => {
    setResponsorialPsalmText1(event.target.value);
  };

  const handleResponsorialPsalmText2 = (event) => {
    setResponsorialPsalmText2(event.target.value);
  };

  const handleResponsorialPsalmText3 = (event) => {
    setResponsorialPsalmText3(event.target.value);
  };

  const handleResponsorialPsalmText4 = (event) => {
    setResponsorialPsalmText4(event.target.value);
  };

  const handleResponsorialPsalmText5 = (event) => {
    setResponsorialPsalmText5(event.target.value);
  };

  const handleResponsorialPsalmText6 = (event) => {
    setResponsorialPsalmText6(event.target.value);
  };

  const handleResponsorialPsalmVerseOPT2 = (event) => {
    setResponsorialPsalmVerseOPT2(event.target.value);
  };

  const handleResponsorialPsalmText1OPT2 = (event) => {
    setResponsorialPsalmText1OPT2(event.target.value);
  };

  const handleResponsorialPsalmText2OPT2 = (event) => {
    setResponsorialPsalmText2OPT2(event.target.value);
  };

  const handleResponsorialPsalmResponseOPT2 = (event) => {
    setResponsorialPsalmResponseOPT2(event.target.value);
  };

  const handleResponsorialPsalmText3OPT2 = (event) => {
    setResponsorialPsalmText3OPT2(event.target.value);
  };

  const handleResponsorialPsalmText4OPT2 = (event) => {
    setResponsorialPsalmText4OPT2(event.target.value);
  };

  const handleResponsorialPsalmText5OPT2 = (event) => {
    setResponsorialPsalmText5OPT2(event.target.value);
  };

  const handleResponsorialText1 = (event) => {
    setResponsorialText1(event.target.value);
  };

  const handleResponsorialText2 = (event) => {
    setResponsorialText2(event.target.value);
  };

  const handleResponsorialText3 = (event) => {
    setResponsorialText3(event.target.value);
  };

  const handleBeforeGospelText = (event) => {
    setBeforeGospelText(event.target.value);
  };

  const handleVerseb4GospelOPT2 = (event) => {
    setVerseb4GospelOPT2(event.target.value);
  };

  const handleB4GospelTextOPT2 = (event) => {
    setB4GospelTextOPT2(event.target.value);
  };

  const handleAlleluiaVerse = (event) => {
    setAlleluiaVerse(event.target.value);
  };

  const handleAlleluiaText = (event) => {
    setAlleluiaText(event.target.value);
  };

  const handleAlleluiaOPT2 = (event) => {
    setAlleluiaOPT2(event.target.value);
  };

  const handleAlleluiaTextOPT2 = (event) => {
    setAlleluiaTextOPT2(event.target.value);
  };

  const handleGospelVerse = (event) => {
    setGospelVerse(event.target.value);
  };

  const handleGospelText = (event) => {
    setGospelText(event.target.value);
  };

  const handleGospelVerse2 = (event) => {
    setGospelVerse2(event.target.value);
  };

  const handleGospelTextOption2 = (event) => {
    setGospelTextOption2(event.target.value);
  };

  const handleVerseBeforeGospel = (event) => {
    setVerseBeforeGospel(event.target.value);
  };

  ////////////////ONCHANGE EDIT SECTION////////////////////////
  const handleEditDate = (event) => {
    setEditDate(event.target.value);
  };

  const handleEditTitle = (event) => {
    setEditTitle(event.target.value);
  };

  const handleEditReading1Verse = (event) => {
    setEditReading1Verse(event.target.value);
  };

  const handleEditReading1Text = (event) => {
    setEditReading1Text(event.target.value);
  };

  const handleEditReading1Option2Verse = (event) => {
    setEditReading1Option2Verse(event.target.value);
  };

  const handleEditReading1TextOption2 = (event) => {
    setEditReading1TextOption2(event.target.value);
  };

  const handleEditReading2Verse = (event) => {
    setEditReading2Verse(event.target.value);
  };

  const handleEditReading2Text = (event) => {
    setEditReading2Text(event.target.value);
  };

  const handleEditReading2Option1Verse = (event) => {
    setEditReading2Option1Verse(event.target.value);
  };

  const handleEditReading2TextOption1 = (event) => {
    setEditReading2TextOption1(event.target.value);
  };

  const handleEditReading3Verse = (event) => {
    setEditReading3Verse(event.target.value);
  };

  const handleEditReading3Text = (event) => {
    setEditReading3Text(event.target.value);
  };

  const handleEditReading4Verse = (event) => {
    setEditReading4Verse(event.target.value);
  };

  const handleEditReading4Text = (event) => {
    setEditReading4Text(event.target.value);
  };

  const handleEditReading5Verse = (event) => {
    setEditReading5Verse(event.target.value);
  };

  const handleEditReading5Text = (event) => {
    setEditReading5Text(event.target.value);
  };

  const handleEditReading6Verse = (event) => {
    setEditReading6Verse(event.target.value);
  };

  const handleEditReading6Text = (event) => {
    setEditReading6Text(event.target.value);
  };

  const handleEditReading7Verse = (event) => {
    setEditReading7Verse(event.target.value);
  };

  const handleEditReading7Text = (event) => {
    setEditReading7Text(event.target.value);
  };

  const handleEditProcessionPalmVerse = (event) => {
    setEditProcessionPalmVerse(event.target.value);
  };

  const handleEditProcessionPalmsGospel = (event) => {
    setEditProcessionPalmsGospel(event.target.value);
  };

  const handleEditProcessionPalmsGospel2Verse = (event) => {
    setEditProcessionPalmsGospel2Verse(event.target.value);
  };

  const handleEditProcessionPalmsGospel2Text = (event) => {
    setEditProcessionPalmsGospel2Text(event.target.value);
  };

  const handleEditResponsorialPsalmVerse = (event) => {
    setEditResponsorialPsalmVerse(event.target.value);
  };

  const handleEditResponsorialPsalmRespond = (event) => {
    setEditResponsorialPsalmRespond(event.target.value);
  };

  const handleEditResponsorialPsalmText1 = (event) => {
    setEditResponsorialPsalmText1(event.target.value);
  };

  const handleEditResponsorialPsalmText2 = (event) => {
    setEditResponsorialPsalmText2(event.target.value);
  };

  const handleEditResponsorialPsalmText3 = (event) => {
    setEditResponsorialPsalmText3(event.target.value);
  };

  const handleEditResponsorialPsalmText4 = (event) => {
    setEditResponsorialPsalmText4(event.target.value);
  };

  const handleEditResponsorialPsalmText5 = (event) => {
    setEditResponsorialPsalmText5(event.target.value);
  };

  const handleEditResponsorialPsalmText6 = (event) => {
    setEditResponsorialPsalmText6(event.target.value);
  };

  const handleEditResponsorialPsalmVerseOPT2 = (event) => {
    setEditResponsorialPsalmVerseOPT2(event.target.value);
  };

  const handleEditResponsorialPsalmText1OPT2 = (event) => {
    setEditResponsorialPsalmText1OPT2(event.target.value);
  };

  const handleEditResponsorialPsalmText2OPT2 = (event) => {
    setEditResponsorialPsalmText2OPT2(event.target.value);
  };

  const handleEditResponsorialPsalmResponseOPT2 = (event) => {
    setEditResponsorialPsalmResponseOPT2(event.target.value);
  };

  const handleEditResponsorialPsalmText3OPT2 = (event) => {
    setEditResponsorialPsalmText3OPT2(event.target.value);
  };

  const handleEditResponsorialPsalmText4OPT2 = (event) => {
    setEditResponsorialPsalmText4OPT2(event.target.value);
  };

  const handleEditResponsorialPsalmText5OPT2 = (event) => {
    setEditResponsorialPsalmText5OPT2(event.target.value);
  };

  const handleEditResponsorialText1 = (event) => {
    setEditResponsorialText1(event.target.value);
  };

  const handleEditResponsorialText2 = (event) => {
    setEditResponsorialText2(event.target.value);
  };

  const handleEditResponsorialText3 = (event) => {
    setEditResponsorialText3(event.target.value);
  };

  const handleEditBeforeGospelText = (event) => {
    setEditBeforeGospelText(event.target.value);
  };

  const handleEditVerseb4GospelOPT2 = (event) => {
    setEditVerseb4GospelOPT2(event.target.value);
  };

  const handleEditB4GospelTextOPT2 = (event) => {
    setEditB4GospelTextOPT2(event.target.value);
  };

  const handleEditAlleluiaVerse = (event) => {
    setEditAlleluiaVerse(event.target.value);
  };

  const handleEditAlleluiaText = (event) => {
    setEditAlleluiaText(event.target.value);
  };

  const handleEditAlleluiaOPT2 = (event) => {
    setEditAlleluiaOPT2(event.target.value);
  };

  const handleEditAlleluiaTextOPT2 = (event) => {
    setEditAlleluiaTextOPT2(event.target.value);
  };

  const handleEditGospelVerse = (event) => {
    setEditGospelVerse(event.target.value);
  };

  const handleEditGospelText = (event) => {
    setEditGospelText(event.target.value);
  };

  const handleEditGospelVerse2 = (event) => {
    setEditGospelVerse2(event.target.value);
  };

  const handleEditGospelTextOption2 = (event) => {
    setEditGospelTextOption2(event.target.value);
  };

  const handleEditVerseBeforeGospel = (event) => {
    setEditVerseBeforeGospel(event.target.value);
  };

  /////////////////API REQUESTS////////////////////////////////////
  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    ["fetchDailyReading", fetchDate],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/daily-reading?date=${fetchDate}`,
        //`http://localhost:7000/api/admin/console/daily-reading?date=${fetchDate}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);

      setId(data?.data?.id);
      const fullDate = data?.data?.date;
      const dateOnly = fullDate.substring(0, 10);
      setEditBibleReadingId(data?.data?.bibleReadingId);
      setEditDate(dateOnly);
      setEditTitle(data?.data?.title);
      setEditReading1Verse(data?.data?.reading1Verse);
      setEditReading1Text(data?.data?.reading1Text);
      setEditReading1Option2Verse(data?.data?.reading1Option2Verse);
      setEditReading1TextOption2(data?.data?.reading1TextOption2);
      setEditReading2Verse(data?.data?.reading2Verse);
      setEditReading2Text(data?.data?.reading2Text);
      setEditReading2Option1Verse(data?.data?.reading2Option1Verse);
      setEditReading2TextOption1(data?.data?.reading2TextOption1);
      setEditReading3Verse(data?.data?.reading3Verse);
      setEditReading3Text(data?.data?.reading3Text);
      setEditReading4Verse(data?.data?.reading4Verse);
      setEditReading4Text(data?.data?.reading4Text);
      setEditReading5Verse(data?.data?.reading5Verse);
      setEditReading5Text(data?.data?.reading5Text);
      setEditReading6Verse(data?.data?.reading6Verse);
      setEditReading6Text(data?.data?.reading6Text);
      setEditReading7Verse(data?.data?.reading7Verse);
      setEditReading7Text(data?.data?.reading7Text);
      setEditProcessionPalmVerse(data?.data?.processionPalmVerse);
      setEditProcessionPalmsGospel(data?.data?.processionPalmsGospel);
      setEditProcessionPalmsGospel2Verse(
        data?.data?.processionPalmsGospel2Verse
      );
      setEditProcessionPalmsGospel2Text(data?.data?.processionPalmsGospel2Text);
      setEditResponsorialPsalmVerse(data?.data?.responsorialPsalmVerse);
      setEditResponsorialPsalmRespond(data?.data?.responsorialPsalmRespond);
      setEditResponsorialPsalmText1(data?.data?.responsorialPsalmText1);
      setEditResponsorialPsalmText2(data?.data?.responsorialPsalmText2);
      setEditResponsorialPsalmText3(data?.data?.responsorialPsalmText3);
      setEditResponsorialPsalmText4(data?.data?.responsorialPsalmText4);
      setEditResponsorialPsalmText5(data?.data?.responsorialPsalmText5);
      setEditResponsorialPsalmText6(data?.data?.responsorialPsalmText6);
      setEditResponsorialPsalmVerseOPT2(data?.data?.responsorialPsalmVerseOPT2);
      setEditResponsorialPsalmText1OPT2(data?.data?.responsorialPsalmText1OPT2);
      setEditResponsorialPsalmText2OPT2(data?.data?.responsorialPsalmText2OPT2);
      setEditResponsorialPsalmResponseOPT2(
        data?.data?.responsorialPsalmResponseOPT2
      );
      setEditResponsorialPsalmText3OPT2(data?.data?.responsorialPsalmText3OPT2);
      setEditResponsorialPsalmText4OPT2(data?.data?.responsorialPsalmText4OPT2);
      setEditResponsorialPsalmText5OPT2(data?.data?.responsorialPsalmText5OPT2);
      setEditResponsorialText1(data?.data?.responsorialText1);
      setEditResponsorialText2(data?.data?.responsorialText2);
      setEditResponsorialText3(data?.data?.responsorialText3);
      setEditBeforeGospelText(data?.data?.beforeGospelText);
      setEditVerseb4GospelOPT2(data?.data?.verseb4GospelOPT2);
      setEditB4GospelTextOPT2(data?.data?.b4GospelTextOPT2);
      setEditAlleluiaVerse(data?.data?.alleluiaVerse);
      setEditAlleluiaText(data?.data?.alleluiaText);
      setEditAlleluiaOPT2(data?.data?.alleluiaOPT2);
      setEditAlleluiaTextOPT2(data?.data?.alleluiaTextOPT2);
      setEditGospelVerse(data?.data?.gospelVerse);
      setEditGospelText(data?.data?.gospelText);
      setEditGospelVerse2(data?.data?.gospelVerse2);
      setEditGospelTextOption2(data?.data?.gospelTextOption2);
      setEditVerseBeforeGospel(data?.data?.verseBeforeGospel);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching daily reading");
      },
      enabled: !!user?.token && !!fetchDate,
    }
  );

  const dailyReading = async ({
    title,
    date,
    reading1Verse,
    reading1Text,
    reading1Option2Verse,
    reading1TextOption2,
    reading2Verse,
    reading2Text,
    reading2Option1Verse,
    reading2TextOption1,
    reading3Verse,
    reading3Text,
    reading4Verse,
    reading4Text,
    reading5Verse,
    reading5Text,
    reading6Verse,
    reading6Text,
    reading7Verse,
    reading7Text,
    processionPalmVerse,
    processionPalmsGospel,
    processionPalmsGospel2Verse,
    processionPalmsGospel2Text,
    responsorialPsalmVerse,
    responsorialPsalmRespond,
    responsorialPsalmText1,
    responsorialPsalmText2,
    responsorialPsalmText3,
    responsorialPsalmText4,
    responsorialPsalmText5,
    responsorialPsalmText6,
    responsorialPsalmVerseOPT2,
    responsorialPsalmText1OPT2,
    responsorialPsalmText2OPT2,
    responsorialPsalmResponseOPT2,
    responsorialPsalmText3OPT2,
    responsorialPsalmText4OPT2,
    responsorialPsalmText5OPT2,
    responsorialText1,
    responsorialText2,
    responsorialText3,
    beforeGospelText,
    verseb4GospelOPT2,
    b4GospelTextOPT2,
    alleluiaVerse,
    alleluiaText,
    alleluiaOPT2,
    alleluiaTextOPT2,
    gospelVerse,
    gospelText,
    gospelVerse2,
    gospelTextOption2,
    verseBeforeGospel,
  }) => {
    const setData = await axios.post(
      //"http://localhost:7000/api/admin/console/daily-reading",
      "https://api.vigoplace.com/api/admin/console/daily-reading",
      {
        title,
        date,
        reading1Verse,
        reading1Text,
        reading1Option2Verse,
        reading1TextOption2,
        reading2Verse,
        reading2Text,
        reading2Option1Verse,
        reading2TextOption1,
        reading3Verse,
        reading3Text,
        reading4Verse,
        reading4Text,
        reading5Verse,
        reading5Text,
        reading6Verse,
        reading6Text,
        reading7Verse,
        reading7Text,
        processionPalmVerse,
        processionPalmsGospel,
        processionPalmsGospel2Verse,
        processionPalmsGospel2Text,
        responsorialPsalmVerse,
        responsorialPsalmRespond,
        responsorialPsalmText1,
        responsorialPsalmText2,
        responsorialPsalmText3,
        responsorialPsalmText4,
        responsorialPsalmText5,
        responsorialPsalmText6,
        responsorialPsalmVerseOPT2,
        responsorialPsalmText1OPT2,
        responsorialPsalmText2OPT2,
        responsorialPsalmResponseOPT2,
        responsorialPsalmText3OPT2,
        responsorialPsalmText4OPT2,
        responsorialPsalmText5OPT2,
        responsorialText1,
        responsorialText2,
        responsorialText3,
        beforeGospelText,
        verseb4GospelOPT2,
        b4GospelTextOPT2,
        alleluiaVerse,
        alleluiaText,
        alleluiaOPT2,
        alleluiaTextOPT2,
        gospelVerse,
        gospelText,
        gospelVerse2,
        gospelTextOption2,
        verseBeforeGospel,
      },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return setData;
  };

  const dailyReadingMutation = useMutation({
    mutationKey: ["postdailyreading"],
    mutationFn: dailyReading,
    onError: async (error) => {
      console.log(error);
      setDailyReadingToast({ ...dailyReadingToast, error: true });
      //setOpenModal(false);
    },
    onSuccess: () => {
      setDailyReadingToast({ ...dailyReadingToast, success: true });
      setTitle(null);
      setDate(null);
      setReading1Verse(null);
      setReading1Text(null);
      setReading1Option2Verse(null);
      setReading1TextOption2(null);
      setReading2Verse(null);
      setReading2Text(null);
      setReading2Option1Verse(null);
      setReading2TextOption1(null);
      setReading3Verse(null);
      setReading3Text(null);
      setReading4Verse(null);
      setReading4Text(null);
      setReading5Verse(null);
      setReading5Text(null);
      setReading6Verse(null);
      setReading6Text(null);
      setReading7Verse(null);
      setReading7Text(null);
      setProcessionPalmVerse(null);
      setProcessionPalmsGospel(null);
      setProcessionPalmsGospel2Verse(null);
      setProcessionPalmsGospel2Text(null);
      setResponsorialPsalmVerse(null);
      setResponsorialPsalmRespond(null);
      setResponsorialPsalmText1(null);
      setResponsorialPsalmText2(null);
      setResponsorialPsalmText3(null);
      setResponsorialPsalmText4(null);
      setResponsorialPsalmText5(null);
      setResponsorialPsalmText6(null);
      setResponsorialPsalmVerseOPT2(null);
      setResponsorialPsalmText1OPT2(null);
      setResponsorialPsalmText2OPT2(null);
      setResponsorialPsalmResponseOPT2(null);
      setResponsorialPsalmText3OPT2(null);
      setResponsorialPsalmText4OPT2(null);
      setResponsorialPsalmText5OPT2(null);
      setResponsorialText1(null);
      setResponsorialText2(null);
      setResponsorialText3(null);
      setBeforeGospelText(null);
      setVerseb4GospelOPT2(null);
      setB4GospelTextOPT2(null);
      setAlleluiaVerse(null);
      setAlleluiaText(null);
      setAlleluiaOPT2(null);
      setAlleluiaTextOPT2(null);
      setGospelVerse(null);
      setGospelText(null);
      setGospelVerse2(null);
      setGospelTextOption2(null);
      setVerseBeforeGospel(null);
    },
  });

  const editDailyReading = async ({
    id,
    editBibleReadingId,
    editTitle,
    editDate,
    editReading1Verse,
    editReading1Text,
    editReading1Option2Verse,
    editReading1TextOption2,
    editReading2Verse,
    editReading2Text,
    editReading2Option1Verse,
    editReading2TextOption1,
    editReading3Verse,
    editReading3Text,
    editReading4Verse,
    editReading4Text,
    editReading5Verse,
    editReading5Text,
    editReading6Verse,
    editReading6Text,
    editReading7Verse,
    editReading7Text,
    editProcessionPalmVerse,
    editProcessionPalmsGospel,
    editProcessionPalmsGospel2Verse,
    editProcessionPalmsGospel2Text,
    editResponsorialPsalmVerse,
    editResponsorialPsalmRespond,
    editResponsorialPsalmText1,
    editResponsorialPsalmText2,
    editResponsorialPsalmText3,
    editResponsorialPsalmText4,
    editResponsorialPsalmText5,
    editResponsorialPsalmText6,
    editResponsorialPsalmVerseOPT2,
    editResponsorialPsalmText1OPT2,
    editResponsorialPsalmText2OPT2,
    editResponsorialPsalmResponseOPT2,
    editResponsorialPsalmText3OPT2,
    editResponsorialPsalmText4OPT2,
    editResponsorialPsalmText5OPT2,
    editResponsorialText1,
    editResponsorialText2,
    editResponsorialText3,
    editBeforeGospelText,
    editVerseb4GospelOPT2,
    editB4GospelTextOPT2,
    editAlleluiaVerse,
    editAlleluiaText,
    editAlleluiaOPT2,
    editAlleluiaTextOPT2,
    editGospelVerse,
    editGospelText,
    editGospelVerse2,
    editGospelTextOption2,
    editVerseBeforeGospel,
  }) => {
    const parsed = await axios.patch(
      "https://api.vigoplace.com/api/admin/console/daily-reading",
      //"http://localhost:7000/api/admin/console/daily-reading",
      {
        id,
        editBibleReadingId,
        editTitle,
        editDate,
        editReading1Verse,
        editReading1Text,
        editReading1Option2Verse,
        editReading1TextOption2,
        editReading2Verse,
        editReading2Text,
        editReading2Option1Verse,
        editReading2TextOption1,
        editReading3Verse,
        editReading3Text,
        editReading4Verse,
        editReading4Text,
        editReading5Verse,
        editReading5Text,
        editReading6Verse,
        editReading6Text,
        editReading7Verse,
        editReading7Text,
        editProcessionPalmVerse,
        editProcessionPalmsGospel,
        editProcessionPalmsGospel2Verse,
        editProcessionPalmsGospel2Text,
        editResponsorialPsalmVerse,
        editResponsorialPsalmRespond,
        editResponsorialPsalmText1,
        editResponsorialPsalmText2,
        editResponsorialPsalmText3,
        editResponsorialPsalmText4,
        editResponsorialPsalmText5,
        editResponsorialPsalmText6,
        editResponsorialPsalmVerseOPT2,
        editResponsorialPsalmText1OPT2,
        editResponsorialPsalmText2OPT2,
        editResponsorialPsalmResponseOPT2,
        editResponsorialPsalmText3OPT2,
        editResponsorialPsalmText4OPT2,
        editResponsorialPsalmText5OPT2,
        editResponsorialText1,
        editResponsorialText2,
        editResponsorialText3,
        editBeforeGospelText,
        editVerseb4GospelOPT2,
        editB4GospelTextOPT2,
        editAlleluiaVerse,
        editAlleluiaText,
        editAlleluiaOPT2,
        editAlleluiaTextOPT2,
        editGospelVerse,
        editGospelText,
        editGospelVerse2,
        editGospelTextOption2,
        editVerseBeforeGospel,
      },
      {
        headers: {
          Authorization: user?.token,
        },
      }
    );
    return parsed;
  };

  const editDailyReadingMutation = useMutation({
    mutationKey: ["editDailyReading"],
    mutationFn: editDailyReading,
    onSuccess: () => {
      setEditDailyReadingToast({ ...editDailyReadingToast, success: true });
      setTimeout(() => {
        setEditDailyReadingToast({ ...editDailyReadingToast, success: false });
      }, 3000);
      setId(null);
      setEditBibleReadingId(null);
      setEditDate(null);
      setEditTitle(null);
      setEditReading1Verse(null);
      setEditReading1Text(null);
      setEditReading1Option2Verse(null);
      setEditReading1TextOption2(null);
      setEditReading2Verse(null);
      setEditReading2Text(null);
      setEditReading2Option1Verse(null);
      setEditReading2TextOption1(null);
      setEditReading3Verse(null);
      setEditReading3Text(null);
      setEditReading4Verse(null);
      setEditReading4Text(null);
      setEditReading5Verse(null);
      setEditReading5Text(null);
      setEditReading6Verse(null);
      setEditReading6Text(null);
      setEditReading7Verse(null);
      setEditReading7Text(null);
      setEditProcessionPalmVerse(null);
      setEditProcessionPalmsGospel(null);
      setEditProcessionPalmsGospel2Verse(null);
      setEditProcessionPalmsGospel2Text(null);
      setEditResponsorialPsalmVerse(null);
      setEditResponsorialPsalmRespond(null);
      setEditResponsorialPsalmText1(null);
      setEditResponsorialPsalmText2(null);
      setEditResponsorialPsalmText3(null);
      setEditResponsorialPsalmText4(null);
      setEditResponsorialPsalmText5(null);
      setEditResponsorialPsalmText6(null);
      setEditResponsorialPsalmVerseOPT2(null);
      setEditResponsorialPsalmText1OPT2(null);
      setEditResponsorialPsalmText2OPT2(null);
      setEditResponsorialPsalmResponseOPT2(null);
      setEditResponsorialPsalmText3OPT2(null);
      setEditResponsorialPsalmText4OPT2(null);
      setEditResponsorialPsalmText5OPT2(null);
      setEditResponsorialText1(null);
      setEditResponsorialText2(null);
      setEditResponsorialText3(null);
      setEditBeforeGospelText(null);
      setEditVerseb4GospelOPT2(null);
      setEditB4GospelTextOPT2(null);
      setEditAlleluiaVerse(null);
      setEditAlleluiaText(null);
      setEditAlleluiaOPT2(null);
      setEditAlleluiaTextOPT2(null);
      setEditGospelVerse(null);
      setEditGospelText(null);
      setEditGospelVerse2(null);
      setEditGospelTextOption2(null);
      setEditVerseBeforeGospel(null);
    },
    onError: async (error) => {
      console.log(error);
      setEditDailyReadingToast({ ...editDailyReadingToast, error: true });
    },
  });

  const handleClose = () => {
    setDailyReadingToast({ error: false, success: false });
  };

  const handleEditClose = () => {
    setDailyReadingToast({ error: false, success: false });
  };

  return (
    <>
      <Snackbar
        TransitionComponent={Slide}
        open={dailyReadingToast.error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          {dailyReadingMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        TransitionComponent={Slide}
        open={dailyReadingToast.success}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {dailyReadingMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Snackbar
        TransitionComponent={Slide}
        open={editDailyReadingToast.error}
        autoHideDuration={6000}
        onClose={handleEditClose}
      >
        <Alert
          onClose={handleEditClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {editDailyReadingMutation?.error?.response?.data?.message}
        </Alert>
      </Snackbar>
      <Snackbar
        TransitionComponent={Slide}
        open={editDailyReadingToast.success}
        autoHideDuration={6000}
        onClose={handleEditClose}
      >
        <Alert
          onClose={handleEditClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {editDailyReadingMutation?.data?.data?.message}
        </Alert>
      </Snackbar>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          centered
          scrollButtons="auto"
          aria-label=""
        >
          <Tab label="Post" {...a11yProps(0)} />
          <Tab label="Edit" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            //   py: 8
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ pt: 3 }}>
              <form>
                <Card>
                  <CardHeader subheader="" title="Daily Reading" />
                  <Divider />
                  <CardContent>
                    <Accordion
                      expanded={expanded === "panel1"}
                      onChange={handleAccordionToggle("panel1")}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        Date
                      </AccordionSummary>
                      <AccordionDetails>
                        <TextField
                          fullWidth
                          margin="normal"
                          name="date"
                          onChange={handleDate}
                          type="date"
                          multiline
                          value={date}
                          variant="outlined"
                          sx={{
                            "& .MuiInputLabel-root": {
                              lineHeight: "15px",
                              fontSize: "smaller",
                            },
                          }}
                        />
                      </AccordionDetails>
                    </Accordion>

                    <Accordion
                      expanded={expanded === "panel2"}
                      onChange={handleAccordionToggle("panel2")}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                      >
                        Title
                      </AccordionSummary>
                      <AccordionDetails>
                        <TextField
                          fullWidth
                          label="Title"
                          margin="normal"
                          name="title"
                          onChange={handleTitle}
                          type="text"
                          multiline
                          value={title}
                          variant="outlined"
                          sx={{
                            "& .MuiInputLabel-root": {
                              lineHeight: "15px",
                              fontSize: "smaller",
                            },
                          }}
                        />
                      </AccordionDetails>
                    </Accordion>

                    <>
                      {/********************* READING 1 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 1 verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading1 Verse"
                            margin="normal"
                            name="reading1Verse"
                            type="text"
                            multiline
                            onChange={handleReading1Verse}
                            value={reading1Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading1Verse && (
                            <TextField
                              fullWidth
                              label="Reading1 Text"
                              margin="normal"
                              name="reading1Text"
                              multiline
                              onChange={handleReading1Text}
                              type="text"
                              value={reading1Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 1 OPTION 2 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 1 option 2 verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading1 Option2 Verse"
                            margin="normal"
                            name="reading1Option2Verse"
                            onChange={handleReading1Option2Verse}
                            type="text"
                            multiline
                            value={reading1Option2Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading1Option2Verse && (
                            <TextField
                              fullWidth
                              label="Reading1 Text Option2"
                              margin="normal"
                              name="reading1TextOption2"
                              onChange={handleReading1TextOption2}
                              type="text"
                              multiline
                              value={reading1TextOption2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>

                      {/********************* READING 2 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 2 verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading2 Verse"
                            margin="normal"
                            name="reading2Verse"
                            onChange={handleReading2Verse}
                            type="text"
                            multiline
                            value={reading2Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading2Verse && (
                            <TextField
                              fullWidth
                              label="Reading2 Text"
                              margin="normal"
                              name="reading2Text"
                              onChange={handleReading2Text}
                              type="text"
                              multiline
                              value={reading2Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 2 OPTION 1 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 2 Option 1 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading2 Option1 Verse"
                            margin="normal"
                            name="reading2Option1Verse"
                            onChange={handleReading2Option1Verse}
                            type="text"
                            multiline
                            value={reading2Option1Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading2Option1Verse && (
                            <TextField
                              fullWidth
                              label="Reading2 Text Option1"
                              margin="normal"
                              name="reading2TextOption1"
                              onChange={handleReading2TextOption1}
                              type="text"
                              multiline
                              value={reading2TextOption1}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 3 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 3 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading3 Verse"
                            margin="normal"
                            name="reading3Verse"
                            onChange={handleReading3Verse}
                            type="text"
                            multiline
                            value={reading3Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading3Verse && (
                            <TextField
                              fullWidth
                              label="Reading3 Text"
                              margin="normal"
                              name="reading3Text"
                              onChange={handleReading3Text}
                              type="text"
                              multiline
                              value={reading3Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 4 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 4 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading4 Verse"
                            margin="normal"
                            name="reading4Verse"
                            onChange={handleReading4Verse}
                            type="text"
                            multiline
                            value={reading4Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading4Verse && (
                            <TextField
                              fullWidth
                              label="Reading4 Text"
                              margin="normal"
                              name="reading4Text"
                              onChange={handleReading4Text}
                              type="text"
                              multiline
                              value={reading4Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 5 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 5 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading5 Verse"
                            margin="normal"
                            name="reading5Verse"
                            onChange={handleReading5Verse}
                            type="text"
                            multiline
                            value={reading5Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading5Verse && (
                            <TextField
                              fullWidth
                              label="Reading5 Text"
                              margin="normal"
                              name="reading5Text"
                              onChange={handleReading5Text}
                              type="text"
                              multiline
                              value={reading5Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 6 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 6 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading6 Verse"
                            margin="normal"
                            name="reading6Verse"
                            onChange={handleReading6Verse}
                            type="text"
                            multiline
                            value={reading6Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading6Verse && (
                            <TextField
                              fullWidth
                              label="Reading6 Text"
                              margin="normal"
                              name="reading6Text"
                              onChange={handleReading6Text}
                              type="text"
                              multiline
                              value={reading6Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/********************* READING 7 VERSE ********************/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Reading 7 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Reading7 Verse"
                            margin="normal"
                            name="reading7Verse"
                            onChange={handleReading7Verse}
                            type="text"
                            multiline
                            value={reading7Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {reading7Verse && (
                            <TextField
                              fullWidth
                              label="Reading7 Text"
                              margin="normal"
                              name="reading7Text"
                              onChange={handleReading7Text}
                              type="text"
                              multiline
                              value={reading7Text}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>

                      {/* START FROM HERE  */}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Procession Psalm Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Procession Psalm Verse"
                            margin="normal"
                            name="processionPalmVerse"
                            onChange={handleProcessionPalmVerse}
                            type="text"
                            multiline
                            value={processionPalmVerse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Procession Psalms Gospel
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Procession Psalms Gospel"
                            margin="normal"
                            name="processionPalmsGospel"
                            onChange={handleProcessionPalmsGospel}
                            type="text"
                            multiline
                            value={processionPalmsGospel}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Procession Psalms Gospel 2 Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Procession Psalms Gospel 2 Verse"
                            margin="normal"
                            name="processionPalmsGospel2Verse"
                            onChange={handleProcessionPalmsGospel2Verse}
                            type="text"
                            multiline
                            value={processionPalmsGospel2Verse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Procession Psalms Gospel 2 Text
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Procession Psalms Gospel 2 Text"
                            margin="normal"
                            name="processionPalmsGospel2Text"
                            onChange={handleProcessionPalmsGospel2Text}
                            type="text"
                            multiline
                            value={processionPalmsGospel2Text}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>
                      {/*PROCESSIONAL PSALMS GOSPEL2 VERSE*/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Verse"
                            margin="normal"
                            name="responsorialPsalmVerse"
                            onChange={handleResponsorialPsalmVerse}
                            type="text"
                            multiline
                            value={responsorialPsalmVerse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />

                          {responsorialPsalmVerse && (
                            <>
                              <TextField
                                fullWidth
                                label="Responsorial Psalm Respond"
                                margin="normal"
                                name="responsorialPsalmRespond"
                                onChange={handleResponsorialPsalmRespond}
                                type="text"
                                multiline
                                value={responsorialPsalmRespond}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />

                              <TextField
                                fullWidth
                                label="Responsorial Psalm Text1"
                                margin="normal"
                                name="responsorialPsalmText1"
                                onChange={handleResponsorialPsalmText1}
                                type="text"
                                multiline
                                value={responsorialPsalmText1}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            </>
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text2"
                            margin="normal"
                            name="responsorialPsalmText2"
                            onChange={handleResponsorialPsalmText2}
                            type="text"
                            multiline
                            value={responsorialPsalmText2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 3
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text3"
                            margin="normal"
                            name="responsorialPsalmText3"
                            onChange={handleResponsorialPsalmText3}
                            type="text"
                            multiline
                            value={responsorialPsalmText3}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 4
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text4"
                            margin="normal"
                            name="responsorialPsalmText4"
                            onChange={handleResponsorialPsalmText4}
                            type="text"
                            multiline
                            value={responsorialPsalmText4}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 5
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text5"
                            margin="normal"
                            name="responsorialPsalmText5"
                            onChange={handleResponsorialPsalmText5}
                            type="text"
                            multiline
                            value={responsorialPsalmText5}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 6
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text6"
                            margin="normal"
                            name="responsorialPsalmText6"
                            onChange={handleResponsorialPsalmText6}
                            type="text"
                            multiline
                            value={responsorialPsalmText6}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>
                      {/*RESPONSIAL PSALM VERSE OPT2*/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Verse OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Verse OPT2"
                            margin="normal"
                            name="responsorialPsalmVerseOPT2"
                            onChange={handleResponsorialPsalmVerseOPT2}
                            type="text"
                            multiline
                            value={responsorialPsalmVerseOPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {responsorialPsalmVerseOPT2 && (
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text1 OPT2"
                              margin="normal"
                              name="responsorialPsalmText1OPT2"
                              onChange={handleResponsorialPsalmText1OPT2}
                              type="text"
                              multiline
                              value={responsorialPsalmText1OPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 2 OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text2 OPT2"
                            margin="normal"
                            name="responsorialPsalmText2OPT2"
                            onChange={handleResponsorialPsalmText2OPT2}
                            type="text"
                            multiline
                            value={responsorialPsalmText2OPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Response OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Response OPT2"
                            margin="normal"
                            name="responsorialPsalmResponseOPT2"
                            onChange={handleResponsorialPsalmResponseOPT2}
                            type="text"
                            multiline
                            value={responsorialPsalmResponseOPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 3 OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          {" "}
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text3 OPT2"
                            margin="normal"
                            name="responsorialPsalmText3OPT2"
                            onChange={handleResponsorialPsalmText3OPT2}
                            type="text"
                            multiline
                            value={responsorialPsalmText3OPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 4 OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text4 OPT2"
                            margin="normal"
                            name="responsorialPsalmText4OPT2"
                            onChange={handleResponsorialPsalmText4OPT2}
                            type="text"
                            multiline
                            value={responsorialPsalmText4OPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Psalm Text 5 OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text5 OPT2"
                            margin="normal"
                            name="responsorialPsalmText5OPT2"
                            onChange={handleResponsorialPsalmText5OPT2}
                            type="text"
                            multiline
                            value={responsorialPsalmText5OPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Text 1
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="ResponsorialText1"
                            margin="normal"
                            name="responsorialText1"
                            onChange={handleResponsorialText1}
                            type="text"
                            multiline
                            value={responsorialText1}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Text 2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="ResponsorialText2"
                            margin="normal"
                            name="responsorialText2"
                            onChange={handleResponsorialText2}
                            type="text"
                            multiline
                            value={responsorialText2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Responsorial Text 3
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="ResponsorialText3"
                            margin="normal"
                            name="responsorialText3"
                            onChange={handleResponsorialText3}
                            type="text"
                            multiline
                            value={responsorialText3}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Before Gospel Text
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Before Gospel Text"
                            margin="normal"
                            name="beforeGospelText"
                            onChange={handleBeforeGospelText}
                            type="text"
                            multiline
                            value={beforeGospelText}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>
                      {/*VERSE B4 GOSPEL OPT2*/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Verse before Gospel OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Verse before Gospel OPT2"
                            margin="normal"
                            name="verseb4GospelOPT2"
                            onChange={handleVerseb4GospelOPT2}
                            type="text"
                            multiline
                            value={verseb4GospelOPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {verseb4GospelOPT2 && (
                            <TextField
                              fullWidth
                              label="Before Gospel Text OPT2"
                              margin="normal"
                              name="b4GospelTextOPT2"
                              onChange={handleB4GospelTextOPT2}
                              type="text"
                              multiline
                              value={b4GospelTextOPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>
                      {/* ALLELULIA VERSE*/}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Alleluia Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Alleluia Verse"
                            margin="normal"
                            name="alleluiaVerse"
                            onChange={handleAlleluiaVerse}
                            type="text"
                            multiline
                            value={alleluiaVerse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {alleluiaVerse && (
                            <TextField
                              fullWidth
                              label="Alleluia Text"
                              margin="normal"
                              name="alleluiaText"
                              onChange={handleAlleluiaText}
                              type="text"
                              multiline
                              value={alleluiaText}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Alleluia OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Alleluia OPT2"
                            margin="normal"
                            name="alleluiaOPT2"
                            onChange={handleAlleluiaOPT2}
                            type="text"
                            multiline
                            value={alleluiaOPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Alleluia Text OPT2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Alleluia Text OPT2"
                            margin="normal"
                            name="alleluiaTextOPT2"
                            onChange={handleAlleluiaTextOPT2}
                            type="text"
                            multiline
                            value={alleluiaTextOPT2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>
                      {/*       GOSPEL VERSE        */}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Gospel Verse
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Gospel Verse"
                            margin="normal"
                            name="gospelVerse"
                            onChange={handleGospelVerse}
                            type="text"
                            multiline
                            value={gospelVerse}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {gospelVerse && (
                            <TextField
                              fullWidth
                              label="Gospel Text"
                              margin="normal"
                              name="gospelText"
                              onChange={handleGospelText}
                              type="text"
                              multiline
                              value={gospelText}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>

                      {/*      GOSPEL VERSE 2       */}
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Gospel Verse 2
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Gospel Verse2"
                            margin="normal"
                            name="gospelVerse2"
                            onChange={handleGospelVerse2}
                            type="text"
                            multiline
                            value={gospelVerse2}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                          {gospelVerse && (
                            <TextField
                              fullWidth
                              label="Gospel Text Option2"
                              margin="normal"
                              name="gospelTextOption2"
                              onChange={handleGospelTextOption2}
                              type="text"
                              multiline
                              value={gospelTextOption2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          )}
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Verse Before Gospel
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Verse Before Gospel"
                            margin="normal"
                            name="verseBeforeGospel"
                            onChange={handleVerseBeforeGospel}
                            type="text"
                            multiline
                            value={verseBeforeGospel}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </>
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      p: 2,
                    }}
                  >
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={dailyReadingMutation.isLoading}
                      disabled={
                        title === null ||
                        date === null ||
                        reading1Verse === null
                      }
                      onClick={() => {
                        dailyReadingMutation.mutate({
                          title,
                          date,
                          reading1Verse,
                          reading1Text,
                          reading1Option2Verse,
                          reading1TextOption2,
                          reading2Verse,
                          reading2Text,
                          reading2Option1Verse,
                          reading2TextOption1,
                          reading3Verse,
                          reading3Text,
                          reading4Verse,
                          reading4Text,
                          reading5Verse,
                          reading5Text,
                          reading6Verse,
                          reading6Text,
                          reading7Verse,
                          reading7Text,
                          processionPalmVerse,
                          processionPalmsGospel,
                          processionPalmsGospel2Verse,
                          processionPalmsGospel2Text,
                          responsorialPsalmVerse,
                          responsorialPsalmRespond,
                          responsorialPsalmText1,
                          responsorialPsalmText2,
                          responsorialPsalmText3,
                          responsorialPsalmText4,
                          responsorialPsalmText5,
                          responsorialPsalmText6,
                          responsorialPsalmVerseOPT2,
                          responsorialPsalmText1OPT2,
                          responsorialPsalmText2OPT2,
                          responsorialPsalmResponseOPT2,
                          responsorialPsalmText3OPT2,
                          responsorialPsalmText4OPT2,
                          responsorialPsalmText5OPT2,
                          responsorialText1,
                          responsorialText2,
                          responsorialText3,
                          beforeGospelText,
                          verseb4GospelOPT2,
                          b4GospelTextOPT2,
                          alleluiaVerse,
                          alleluiaText,
                          alleluiaOPT2,
                          alleluiaTextOPT2,
                          gospelVerse,
                          gospelText,
                          gospelVerse2,
                          gospelTextOption2,
                          verseBeforeGospel,
                        });
                      }}
                    >
                      Add Daily Reading
                    </LoadingButton>
                  </Box>
                </Card>
              </form>
            </Box>
          </Container>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            //   py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Input the date of the daily reading you wish to edit
          </Typography>
          <TextField
            id="date"
            label="Date"
            type="date"
            value={fetchDate}
            onChange={(e) => setFetchDate(e.target.value)}
            sx={{ mt: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              sx: {
                height: "40px", // Adjust the height here
                "& input": {
                  padding: "8px 14px", // Adjust padding as needed
                },
              },
            }}
          />

          {fetchDate && (
            <Container maxWidth="lg">
              <Box sx={{ pt: 3 }}>
                <form>
                  <Card>
                    <CardHeader subheader="" title="Daily Reading" />
                    <Divider />
                    <CardContent>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Title
                        </AccordionSummary>
                        <AccordionDetails>
                          <TextField
                            fullWidth
                            label="Title"
                            margin="normal"
                            name="title"
                            onChange={handleEditTitle}
                            type="text"
                            multiline
                            value={editTitle}
                            variant="outlined"
                            sx={{
                              "& .MuiInputLabel-root": {
                                lineHeight: "15px",
                                fontSize: "smaller",
                              },
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      {/* <TabPanel value={editTabValue} index={1}>
                        <TextField
                          fullWidth
                          //label="Old Password"
                          margin="normal"
                          name="date"
                          onChange={handleEditDate}
                          type="date"
                          value={editDate}
                          variant="outlined"
                          sx={{
                            height: "40px",
                            "& .MuiOutlinedInput-root": {
                              height: "40px",
                            },
                            "& .MuiInputLabel-root": {
                              lineHeight: "15px",
                              fontSize: "smaller",
                            },
                          }}
                        />
                      </TabPanel> */}
                      <>
                        {/********************* READING 1 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 1 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading1 Verse"
                              margin="normal"
                              name="reading1Verse"
                              type="text"
                              multiline
                              onChange={handleEditReading1Verse}
                              value={editReading1Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading1Verse && (
                              <TextField
                                fullWidth
                                label="Reading1 Text"
                                margin="normal"
                                name="reading1Text"
                                onChange={handleEditReading1Text}
                                type="text"
                                multiline
                                value={editReading1Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 1 OPTION 2 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 1 Option 2 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading1 Option2 Verse"
                              margin="normal"
                              name="reading1Option2Verse"
                              onChange={handleEditReading1Option2Verse}
                              type="text"
                              multiline
                              value={editReading1Option2Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading1Option2Verse && (
                              <TextField
                                fullWidth
                                label="Reading1 Text Option2"
                                margin="normal"
                                name="reading1TextOption2"
                                onChange={handleEditReading1TextOption2}
                                type="text"
                                multiline
                                value={editReading1TextOption2}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 2 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 2 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading2 Verse"
                              margin="normal"
                              name="reading2Verse"
                              onChange={handleEditReading2Verse}
                              type="text"
                              multiline
                              value={editReading2Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading2Verse && (
                              <TextField
                                fullWidth
                                label="Reading2 Text"
                                margin="normal"
                                name="reading2Text"
                                onChange={handleEditReading2Text}
                                type="text"
                                multiline
                                value={editReading2Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 2 OPTION 1 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 2 Option 1 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading2 Option1 Verse"
                              margin="normal"
                              name="reading2Option1Verse"
                              onChange={handleEditReading2Option1Verse}
                              type="text"
                              multiline
                              value={editReading2Option1Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading2Option1Verse && (
                              <TextField
                                fullWidth
                                label="Reading2 Text Option1"
                                margin="normal"
                                name="reading2TextOption1"
                                onChange={handleEditReading2TextOption1}
                                type="text"
                                multiline
                                value={editReading2TextOption1}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 3 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 3 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading3 Verse"
                              margin="normal"
                              name="reading3Verse"
                              onChange={handleEditReading3Verse}
                              type="text"
                              multiline
                              value={editReading3Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading3Verse && (
                              <TextField
                                fullWidth
                                label="Reading3 Text"
                                margin="normal"
                                name="reading3Text"
                                onChange={handleEditReading3Text}
                                type="text"
                                multiline
                                value={editReading3Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 4 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 4 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading4 Verse"
                              margin="normal"
                              name="reading4Verse"
                              onChange={handleEditReading4Verse}
                              type="text"
                              multiline
                              value={editReading4Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading4Verse && (
                              <TextField
                                fullWidth
                                label="Reading4 Text"
                                margin="normal"
                                name="reading4Text"
                                onChange={handleEditReading4Text}
                                type="text"
                                multiline
                                value={editReading4Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>
                        {/********************* READING 5 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 5 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading5 Verse"
                              margin="normal"
                              name="reading5Verse"
                              onChange={handleEditReading5Verse}
                              type="text"
                              multiline
                              value={editReading5Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading5Verse && (
                              <TextField
                                fullWidth
                                label="Reading5 Text"
                                margin="normal"
                                name="reading5Text"
                                onChange={handleEditReading5Text}
                                type="text"
                                multiline
                                value={editReading5Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 6 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 6 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading6 Verse"
                              margin="normal"
                              name="reading6Verse"
                              onChange={handleEditReading6Verse}
                              type="text"
                              multiline
                              value={editReading6Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading6Verse && (
                              <TextField
                                fullWidth
                                label="Reading6 Text"
                                margin="normal"
                                name="reading6Text"
                                onChange={handleEditReading6Text}
                                type="text"
                                multiline
                                value={editReading6Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/********************* READING 7 VERSE ********************/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Reading 7 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Reading7 Verse"
                              margin="normal"
                              name="reading7Verse"
                              onChange={handleEditReading7Verse}
                              type="text"
                              multiline
                              value={editReading7Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editReading7Verse && (
                              <TextField
                                fullWidth
                                label="Reading7 Text"
                                margin="normal"
                                name="reading7Text"
                                onChange={handleEditReading7Text}
                                type="text"
                                multiline
                                value={editReading7Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/* START FROM HERE  */}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Procession Psalm Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Procession Psalm Verse"
                              margin="normal"
                              name="processionPalmVerse"
                              onChange={handleEditProcessionPalmVerse}
                              type="text"
                              multiline
                              value={editProcessionPalmVerse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Procession Psalms Gospel
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Procession Psalms Gospel"
                              margin="normal"
                              name="processionPalmsGospel"
                              onChange={handleEditProcessionPalmsGospel}
                              type="text"
                              multiline
                              value={editProcessionPalmsGospel}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        {/*PROCESSIONAL PSALMS GOSPEL2 VERSE*/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Procession Psalms Gospel 2 Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Procession Psalms Gospel2 Verse"
                              margin="normal"
                              name="processionPalmsGospel2Verse"
                              onChange={handleEditProcessionPalmsGospel2Verse}
                              type="text"
                              multiline
                              value={editProcessionPalmsGospel2Verse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editProcessionPalmsGospel2Verse && (
                              <TextField
                                fullWidth
                                label="Procession Psalms Gospel2 Text"
                                margin="normal"
                                name="processionPalmsGospel2Text"
                                onChange={handleEditProcessionPalmsGospel2Text}
                                type="text"
                                multiline
                                value={editProcessionPalmsGospel2Text}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/*RESPONSIAL PSALM VERSE*/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Verse"
                              margin="normal"
                              name="responsorialPsalmVerse"
                              onChange={handleEditResponsorialPsalmVerse}
                              type="text"
                              multiline
                              value={editResponsorialPsalmVerse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editResponsorialPsalmVerse && (
                              <>
                                <TextField
                                  fullWidth
                                  label="Responsorial Psalm Respond"
                                  margin="normal"
                                  name="responsorialPsalmRespond"
                                  onChange={handleEditResponsorialPsalmRespond}
                                  type="text"
                                  multiline
                                  value={editResponsorialPsalmRespond}
                                  variant="outlined"
                                  sx={{
                                    "& .MuiInputLabel-root": {
                                      lineHeight: "15px",
                                      fontSize: "smaller",
                                    },
                                  }}
                                />
                                <TextField
                                  fullWidth
                                  label="Responsorial Psalm Text1"
                                  margin="normal"
                                  name="responsorialPsalmText1"
                                  onChange={handleEditResponsorialPsalmText1}
                                  type="text"
                                  multiline
                                  value={editResponsorialPsalmText1}
                                  variant="outlined"
                                  sx={{
                                    "& .MuiInputLabel-root": {
                                      lineHeight: "15px",
                                      fontSize: "smaller",
                                    },
                                  }}
                                />
                              </>
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text2"
                              margin="normal"
                              name="responsorialPsalmText2"
                              onChange={handleEditResponsorialPsalmText2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 3
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text3"
                              margin="normal"
                              name="responsorialPsalmText3"
                              onChange={handleEditResponsorialPsalmText3}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText3}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 4
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text4"
                              margin="normal"
                              name="responsorialPsalmText4"
                              onChange={handleEditResponsorialPsalmText4}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText4}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 5
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text5"
                              margin="normal"
                              name="responsorialPsalmText5"
                              onChange={handleEditResponsorialPsalmText5}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText5}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 6
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text6"
                              margin="normal"
                              name="responsorialPsalmText6"
                              onChange={handleEditResponsorialPsalmText6}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText6}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        {/*RESPONSIAL PSALM VERSE OPT2*/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Verse OPT 2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Verse OPT2"
                              margin="normal"
                              name="responsorialPsalmVerseOPT2"
                              onChange={handleEditResponsorialPsalmVerseOPT2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmVerseOPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editResponsorialPsalmVerseOPT2 && (
                              <TextField
                                fullWidth
                                label="Responsorial Psalm Text1 OPT2"
                                margin="normal"
                                name="responsorialPsalmText1OPT2"
                                onChange={handleEditResponsorialPsalmText1OPT2}
                                type="text"
                                multiline
                                value={editResponsorialPsalmText1OPT2}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 2 OPT 2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text2 OPT2"
                              margin="normal"
                              name="responsorialPsalmText2OPT2"
                              onChange={handleEditResponsorialPsalmText2OPT2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText2OPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Response OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Response OPT2"
                              margin="normal"
                              name="responsorialPsalmResponseOPT2"
                              onChange={handleEditResponsorialPsalmResponseOPT2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmResponseOPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 3 OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text3 OPT2"
                              margin="normal"
                              name="responsorialPsalmText3OPT2"
                              onChange={handleEditResponsorialPsalmText3OPT2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText3OPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 4 OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text4 OPT2"
                              margin="normal"
                              name="responsorialPsalmText4OPT2"
                              onChange={handleEditResponsorialPsalmText4OPT2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText4OPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Psalm Text 5 OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text5 OPT2"
                              margin="normal"
                              name="responsorialPsalmText5OPT2"
                              onChange={handleEditResponsorialPsalmText5OPT2}
                              type="text"
                              multiline
                              value={editResponsorialPsalmText5OPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Text 1
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="ResponsorialText1"
                              margin="normal"
                              name="responsorialText1"
                              onChange={handleEditResponsorialText1}
                              type="text"
                              multiline
                              value={editResponsorialText1}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Text 2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="ResponsorialText2"
                              margin="normal"
                              name="responsorialText2"
                              onChange={handleEditResponsorialText2}
                              type="text"
                              multiline
                              value={editResponsorialText2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Responsorial Text 3
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="ResponsorialText3"
                              margin="normal"
                              name="responsorialText3"
                              onChange={handleEditResponsorialText3}
                              type="text"
                              multiline
                              value={editResponsorialText3}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Before Gospel Text
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Before Gospel Text"
                              margin="normal"
                              name="beforeGospelText"
                              onChange={handleEditBeforeGospelText}
                              type="text"
                              multiline
                              value={editBeforeGospelText}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        {/*VERSE B4 GOSPEL OPT2*/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Verse before Gospel OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Verse before Gospel OPT2"
                              margin="normal"
                              name="verseb4GospelOPT2"
                              onChange={handleEditVerseb4GospelOPT2}
                              type="text"
                              multiline
                              value={editVerseb4GospelOPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editVerseb4GospelOPT2 && (
                              <TextField
                                fullWidth
                                label="Before Gospel Text OPT2"
                                margin="normal"
                                name="b4GospelTextOPT2"
                                onChange={handleEditB4GospelTextOPT2}
                                type="text"
                                multiline
                                value={editB4GospelTextOPT2}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/* ALLELULIA VERSE*/}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Alleluia Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Alleluia Verse"
                              margin="normal"
                              name="alleluiaVerse"
                              onChange={handleEditAlleluiaVerse}
                              type="text"
                              multiline
                              value={editAlleluiaVerse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editAlleluiaVerse && (
                              <TextField
                                fullWidth
                                label="Alleluia Text"
                                margin="normal"
                                name="alleluiaText"
                                onChange={handleEditAlleluiaText}
                                type="text"
                                multiline
                                value={editAlleluiaText}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Alleluia OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Alleluia OPT2"
                              margin="normal"
                              name="alleluiaOPT2"
                              onChange={handleEditAlleluiaOPT2}
                              type="text"
                              multiline
                              value={editAlleluiaOPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Alleluia Text OPT2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Alleluia Text OPT2"
                              margin="normal"
                              name="alleluiaTextOPT2"
                              onChange={handleEditAlleluiaTextOPT2}
                              type="text"
                              multiline
                              value={editAlleluiaTextOPT2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>

                        {/*       GOSPEL VERSE        */}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Gospel Verse
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Gospel Verse"
                              margin="normal"
                              name="gospelVerse"
                              onChange={handleEditGospelVerse}
                              type="text"
                              multiline
                              value={editGospelVerse}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editGospelVerse && (
                              <TextField
                                fullWidth
                                label="Gospel Text"
                                margin="normal"
                                name="gospelText"
                                onChange={handleEditGospelText}
                                type="text"
                                multiline
                                value={editGospelText}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        {/*      GOSPEL VERSE 2       */}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Gospel Verse 2
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Gospel Verse 2"
                              margin="normal"
                              name="gospelVerse2"
                              onChange={handleEditGospelVerse2}
                              type="text"
                              multiline
                              value={editGospelVerse2}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                            {editGospelVerse && (
                              <TextField
                                fullWidth
                                label="Gospel Text Option2"
                                margin="normal"
                                name="gospelTextOption2"
                                onChange={handleEditGospelTextOption2}
                                type="text"
                                multiline
                                value={editGospelTextOption2}
                                variant="outlined"
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "15px",
                                    fontSize: "smaller",
                                  },
                                }}
                              />
                            )}
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Verse Before Gospel
                          </AccordionSummary>
                          <AccordionDetails>
                            <TextField
                              fullWidth
                              label="Verse Before Gospel"
                              margin="normal"
                              name="verseBeforeGospel"
                              onChange={handleEditVerseBeforeGospel}
                              type="text"
                              multiline
                              value={editVerseBeforeGospel}
                              variant="outlined"
                              sx={{
                                "& .MuiInputLabel-root": {
                                  lineHeight: "15px",
                                  fontSize: "smaller",
                                },
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>
                      </>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 2,
                      }}
                    >
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={editDailyReadingMutation.isLoading}
                        disabled={
                          editTitle === null ||
                          editDate === null ||
                          editReading1Verse === null
                        }
                        onClick={() => {
                          editDailyReadingMutation.mutate({
                            id,
                            editBibleReadingId,
                            editTitle,
                            editDate,
                            editReading1Verse,
                            editReading1Text,
                            editReading1Option2Verse,
                            editReading1TextOption2,
                            editReading2Verse,
                            editReading2Text,
                            editReading2Option1Verse,
                            editReading2TextOption1,
                            editReading3Verse,
                            editReading3Text,
                            editReading4Verse,
                            editReading4Text,
                            editReading5Verse,
                            editReading5Text,
                            editReading6Verse,
                            editReading6Text,
                            editReading7Verse,
                            editReading7Text,
                            editProcessionPalmVerse,
                            editProcessionPalmsGospel,
                            editProcessionPalmsGospel2Verse,
                            editProcessionPalmsGospel2Text,
                            editResponsorialPsalmVerse,
                            editResponsorialPsalmRespond,
                            editResponsorialPsalmText1,
                            editResponsorialPsalmText2,
                            editResponsorialPsalmText3,
                            editResponsorialPsalmText4,
                            editResponsorialPsalmText5,
                            editResponsorialPsalmText6,
                            editResponsorialPsalmVerseOPT2,
                            editResponsorialPsalmText1OPT2,
                            editResponsorialPsalmText2OPT2,
                            editResponsorialPsalmResponseOPT2,
                            editResponsorialPsalmText3OPT2,
                            editResponsorialPsalmText4OPT2,
                            editResponsorialPsalmText5OPT2,
                            editResponsorialText1,
                            editResponsorialText2,
                            editResponsorialText3,
                            editBeforeGospelText,
                            editVerseb4GospelOPT2,
                            editB4GospelTextOPT2,
                            editAlleluiaVerse,
                            editAlleluiaText,
                            editAlleluiaOPT2,
                            editAlleluiaTextOPT2,
                            editGospelVerse,
                            editGospelText,
                            editGospelVerse2,
                            editGospelTextOption2,
                            editVerseBeforeGospel,
                          });
                        }}
                      >
                        Edit Daily Reading
                      </LoadingButton>
                    </Box>
                  </Card>
                </form>
              </Box>
            </Container>
          )}
        </Box>
      </TabPanel>
    </>
  );
}

export default DailyReadings;
