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
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [reading1Verse, setReading1Verse] = useState("");
  const [reading1Text, setReading1Text] = useState("");
  const [reading1Option2Verse, setReading1Option2Verse] = useState("");
  const [reading1TextOption2, setReading1TextOption2] = useState("");
  const [reading2Verse, setReading2Verse] = useState("");
  const [reading2Text, setReading2Text] = useState("");
  const [reading2Option1Verse, setReading2Option1Verse] = useState("");
  const [reading2TextOption1, setReading2TextOption1] = useState("");
  const [reading3Verse, setReading3Verse] = useState("");
  const [reading3Text, setReading3Text] = useState("");
  const [reading4Verse, setReading4Verse] = useState("");
  const [reading4Text, setReading4Text] = useState("");
  const [reading5Verse, setReading5Verse] = useState("");
  const [reading5Text, setReading5Text] = useState("");
  const [reading6Verse, setReading6Verse] = useState("");
  const [reading6Text, setReading6Text] = useState("");
  const [reading7Verse, setReading7Verse] = useState("");
  const [reading7Text, setReading7Text] = useState("");

  //2ND BATCH
  const [processionPalmVerse, setProcessionPalmVerse] = useState("");
  const [processionPalmsGospel, setProcessionPalmsGospel] = useState("");
  const [processionPalmsGospel2Verse, setProcessionPalmsGospel2Verse] =
    useState("");
  const [processionPalmsGospel2Text, setProcessionPalmsGospel2Text] =
    useState("");
  const [responsorialPsalmVerse, setResponsorialPsalmVerse] = useState("");
  const [responsorialPsalmRespond, setResponsorialPsalmRespond] = useState("");
  const [responsorialPsalmText1, setResponsorialPsalmText1] = useState("");
  const [responsorialPsalmText2, setResponsorialPsalmText2] = useState("");
  const [responsorialPsalmText3, setResponsorialPsalmText3] = useState("");
  const [responsorialPsalmText4, setResponsorialPsalmText4] = useState("");
  const [responsorialPsalmText5, setResponsorialPsalmText5] = useState("");
  const [responsorialPsalmText6, setResponsorialPsalmText6] = useState("");
  const [responsorialPsalmVerseOPT2, setResponsorialPsalmVerseOPT2] =
    useState("");
  const [responsorialPsalmText1OPT2, setResponsorialPsalmText1OPT2] =
    useState("");
  const [responsorialPsalmText2OPT2, setResponsorialPsalmText2OPT2] =
    useState("");
  const [responsorialPsalmResponseOPT2, setResponsorialPsalmResponseOPT2] =
    useState("");
  const [responsorialPsalmText3OPT2, setResponsorialPsalmText3OPT2] =
    useState("");
  const [responsorialPsalmText4OPT2, setResponsorialPsalmText4OPT2] =
    useState("");
  const [responsorialPsalmText5OPT2, setResponsorialPsalmText5OPT2] =
    useState("");

  ////3RD BATCH
  const [responsorialText1, setResponsorialText1] = useState("");
  const [responsorialText2, setResponsorialText2] = useState("");
  const [responsorialText3, setResponsorialText3] = useState("");
  const [beforeGospelText, setBeforeGospelText] = useState("");
  const [verseb4GospelOPT2, setVerseb4GospelOPT2] = useState("");
  const [b4GospelTextOPT2, setB4GospelTextOPT2] = useState("");
  const [alleluiaVerse, setAlleluiaVerse] = useState("");
  const [alleluiaText, setAlleluiaText] = useState("");
  const [alleluiaOPT2, setAlleluiaOPT2] = useState("");
  const [alleluiaTextOPT2, setAlleluiaTextOPT2] = useState("");
  const [gospelVerse, setGospelVerse] = useState("");
  const [gospelText, setGospelText] = useState("");
  const [gospelVerse2, setGospelVerse2] = useState("");
  const [gospelTextOption2, setGospelTextOption2] = useState("");
  const [verseBeforeGospel, setVerseBeforeGospel] = useState("");

  /////////////////////////////////////////////////////EDIT SECTION///////////////////////////////////////////////
  const [fetchDate, setFetchDate] = useState("");
  const [id, setId] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editReading1Verse, setEditReading1Verse] = useState("");
  const [editReading1Text, setEditReading1Text] = useState("");
  const [editReading1Option2Verse, setEditReading1Option2Verse] = useState("");
  const [editReading1TextOption2, setEditReading1TextOption2] = useState("");
  const [editReading2Verse, setEditReading2Verse] = useState("");
  const [editReading2Text, setEditReading2Text] = useState("");
  const [editReading2Option1Verse, setEditReading2Option1Verse] = useState("");
  const [editReading2TextOption1, setEditReading2TextOption1] = useState("");
  const [editReading3Verse, setEditReading3Verse] = useState("");
  const [editReading3Text, setEditReading3Text] = useState("");
  const [editReading4Verse, setEditReading4Verse] = useState("");
  const [editReading4Text, setEditReading4Text] = useState("");
  const [editReading5Verse, setEditReading5Verse] = useState("");
  const [editReading5Text, setEditReading5Text] = useState("");
  const [editReading6Verse, setEditReading6Verse] = useState("");
  const [editReading6Text, setEditReading6Text] = useState("");
  const [editReading7Verse, setEditReading7Verse] = useState("");
  const [editReading7Text, setEditReading7Text] = useState("");

  //EDIT2ND BATCH

  const [editProcessionPalmVerse, setEditProcessionPalmVerse] = useState("");
  const [editProcessionPalmsGospel, setEditProcessionPalmsGospel] =
    useState("");
  const [editProcessionPalmsGospel2Verse, setEditProcessionPalmsGospel2Verse] =
    useState("");
  const [editProcessionPalmsGospel2Text, setEditProcessionPalmsGospel2Text] =
    useState("");
  const [editResponsorialPsalmVerse, setEditResponsorialPsalmVerse] =
    useState("");
  const [editResponsorialPsalmRespond, setEditResponsorialPsalmRespond] =
    useState("");
  const [editResponsorialPsalmText1, setEditResponsorialPsalmText1] =
    useState("");
  const [editResponsorialPsalmText2, setEditResponsorialPsalmText2] =
    useState("");
  const [editResponsorialPsalmText3, setEditResponsorialPsalmText3] =
    useState("");
  const [editResponsorialPsalmText4, setEditResponsorialPsalmText4] =
    useState("");
  const [editResponsorialPsalmText5, setEditResponsorialPsalmText5] =
    useState("");
  const [editResponsorialPsalmText6, setEditResponsorialPsalmText6] =
    useState("");
  const [editResponsorialPsalmVerseOPT2, setEditResponsorialPsalmVerseOPT2] =
    useState("");
  const [editResponsorialPsalmText1OPT2, setEditResponsorialPsalmText1OPT2] =
    useState("");
  const [editResponsorialPsalmText2OPT2, setEditResponsorialPsalmText2OPT2] =
    useState("");
  const [
    editResponsorialPsalmResponseOPT2,
    setEditResponsorialPsalmResponseOPT2,
  ] = useState("");

  const [editResponsorialPsalmText3OPT2, setEditResponsorialPsalmText3OPT2] =
    useState("");
  const [editResponsorialPsalmText4OPT2, setEditResponsorialPsalmText4OPT2] =
    useState("");
  const [editResponsorialPsalmText5OPT2, setEditResponsorialPsalmText5OPT2] =
    useState("");

  ////EDIT 3RD BATCH
  const [editResponsorialText1, setEditResponsorialText1] = useState("");
  const [editResponsorialText2, setEditResponsorialText2] = useState("");
  const [editResponsorialText3, setEditResponsorialText3] = useState("");
  const [editBeforeGospelText, setEditBeforeGospelText] = useState("");
  const [editVerseb4GospelOPT2, setEditVerseb4GospelOPT2] = useState("");
  const [editB4GospelTextOPT2, setEditB4GospelTextOPT2] = useState("");
  const [editAlleluiaVerse, setEditAlleluiaVerse] = useState("");
  const [editAlleluiaText, setEditAlleluiaText] = useState("");
  const [editAlleluiaOPT2, setEditAlleluiaOPT2] = useState("");
  const [editAlleluiaTextOPT2, setEditAlleluiaTextOPT2] = useState("");
  const [editGospelVerse, setEditGospelVerse] = useState("");
  const [editGospelText, setEditGospelText] = useState("");
  const [editGospelVerse2, setEditGospelVerse2] = useState("");
  const [editGospelTextOption2, setEditGospelTextOption2] = useState("");
  const [editVerseBeforeGospel, setEditVerseBeforeGospel] = useState("");

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
        //`http://localhost:4000/api/admin/console/daily-reading?date=${fetchDate}`,
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
      //"http://localhost:4000/api/admin/console/daily-reading",
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
      setTitle("");
      setDate("");
      setReading1Verse("");
      setReading1Text("");
      setReading1Option2Verse("");
      setReading1TextOption2("");
      setReading1Text("");
      setReading1Option2Verse("");
      setReading2TextOption1("");
      setReading3Verse("");
      setReading3Text("");
      setReading4Verse("");
      setReading4Text("");
      setReading5Verse("");
      setReading5Text("");
      setReading6Verse("");
      setReading6Text("");
      setReading7Verse("");
      setReading7Text("");
      setProcessionPalmVerse("");
      setProcessionPalmsGospel("");
      setProcessionPalmsGospel2Verse("");
      setProcessionPalmsGospel2Text("");
      setResponsorialPsalmVerse("");
      setResponsorialPsalmRespond("");
      setResponsorialPsalmText1("");
      setResponsorialPsalmText2("");
      setResponsorialPsalmText3("");
      setResponsorialPsalmText4("");
      setResponsorialPsalmText5("");
      setResponsorialPsalmText6("");
      setResponsorialPsalmVerseOPT2("");
      setResponsorialPsalmText1OPT2("");
      setResponsorialPsalmText2OPT2("");
      setResponsorialPsalmResponseOPT2("");
      setResponsorialPsalmText3OPT2("");
      setResponsorialPsalmText4OPT2("");
      setResponsorialPsalmText5OPT2("");
      setResponsorialText1("");
      setResponsorialText2("");
      setResponsorialText3("");
      setBeforeGospelText("");
      setVerseb4GospelOPT2("");
      setB4GospelTextOPT2("");
      setAlleluiaVerse("");
      setAlleluiaText("");
      setAlleluiaOPT2("");
      setAlleluiaTextOPT2("");
      setGospelVerse("");
      setGospelText("");
      setGospelVerse2("");
      setGospelTextOption2("");
      setVerseBeforeGospel("");
    },
  });

  const editDailyReading = async ({
    id,
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
      //"http://localhost:4000/api/admin/console/daily-reading",
      {
        id,
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
      setId("");
      setEditDate("");
      setEditTitle("");
      setEditReading1Verse("");
      setEditReading1Text("");
      setEditReading1Option2Verse("");
      setEditReading1TextOption2("");
      setEditReading2Verse("");
      setEditReading2Text("");
      setEditReading2Option1Verse("");
      setEditReading2TextOption1("");
      setEditReading3Verse("");
      setEditReading3Text("");
      setEditReading4Verse("");
      setEditReading4Text("");
      setEditReading5Verse("");
      setEditReading5Text("");
      setEditReading6Verse("");
      setEditReading6Text("");
      setEditReading7Verse("");
      setEditReading7Text("");
      setEditProcessionPalmVerse("");
      setEditProcessionPalmsGospel("");
      setEditProcessionPalmsGospel2Verse("");
      setEditProcessionPalmsGospel2Text("");
      setEditResponsorialPsalmVerse("");
      setEditResponsorialPsalmRespond("");
      setEditResponsorialPsalmText1("");
      setEditResponsorialPsalmText2("");
      setEditResponsorialPsalmText3("");
      setEditResponsorialPsalmText4("");
      setEditResponsorialPsalmText5("");
      setEditResponsorialPsalmText6("");
      setEditResponsorialPsalmVerseOPT2("");
      setEditResponsorialPsalmText1OPT2("");
      setEditResponsorialPsalmText2OPT2("");
      setEditResponsorialPsalmResponseOPT2("");
      setEditResponsorialPsalmText3OPT2("");
      setEditResponsorialPsalmText4OPT2("");
      setEditResponsorialPsalmText5OPT2("");
      setEditResponsorialText1("");
      setEditResponsorialText2("");
      setEditResponsorialText3("");
      setEditBeforeGospelText("");
      setEditVerseb4GospelOPT2("");
      setEditB4GospelTextOPT2("");
      setEditAlleluiaVerse("");
      setEditAlleluiaText("");
      setEditAlleluiaOPT2("");
      setEditAlleluiaTextOPT2("");
      setEditGospelVerse("");
      setEditGospelText("");
      setEditGospelVerse2("");
      setEditGospelTextOption2("");
      setEditVerseBeforeGospel("");
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
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={postTabValue}
                        onChange={handlePostTabChange}
                        textColor="inherit"
                        // scrollButtons="auto"
                        aria-label=""
                        variant="scrollable"
                        scrollButtons={false}
                      >
                        <Tab label="Title" {...a11yProps(0)} />
                        <Tab label="Date" {...a11yProps(1)} />
                        <Tab label="Reading 1 verse" {...a11yProps(2)} />
                        <Tab
                          label="Reading 1 option 2 verse"
                          {...a11yProps(3)}
                        />
                        <Tab label="Reading 2 verse" {...a11yProps(4)} />
                        <Tab
                          label="Reading 2 option 1 verse"
                          {...a11yProps(5)}
                        />
                        <Tab label="Reading 3 verse" {...a11yProps(6)} />
                        <Tab label="Reading 4 verse" {...a11yProps(7)} />
                        <Tab label="Reading 5 verse" {...a11yProps(8)} />
                        <Tab label="Reading 6 verse" {...a11yProps(9)} />
                        <Tab label="Reading 7 verse" {...a11yProps(10)} />
                        <Tab
                          label="Procession Psalm Verse"
                          {...a11yProps(11)}
                        />
                        <Tab
                          label="Procession Psalm Gospel"
                          {...a11yProps(12)}
                        />
                        
                        <Tab
                          label="Procession Psalm Gospel 2 Verse"
                          {...a11yProps(13)}
                        />
                        <Tab
                          label="Procession Psalm Gospel 2 Text"
                          {...a11yProps(14)}
                        />
                        <Tab
                          label="Responsorial Psalm Verse"
                          {...a11yProps(15)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 2"
                          {...a11yProps(16)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 3"
                          {...a11yProps(17)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 4"
                          {...a11yProps(18)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 5"
                          {...a11yProps(19)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 6"
                          {...a11yProps(20)}
                        />
                        <Tab
                          label="Responsorial Psalm Verse OPT 2"
                          {...a11yProps(21)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 2 OPT 2"
                          {...a11yProps(22)}
                        />
                        <Tab
                          label="Responsorial Psalm Response OPT 2"
                          {...a11yProps(23)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 3 OPT 2"
                          {...a11yProps(24)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 4 OPT 2"
                          {...a11yProps(25)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 5 OPT 2"
                          {...a11yProps(26)}
                        />
                        <Tab label="Responsorial Text 1" {...a11yProps(27)} />
                        <Tab label="Responsorial Text 2" {...a11yProps(28)} />
                        <Tab label="Responsorial Text 3" {...a11yProps(29)} />
                        <Tab label="Before Gospel Text" {...a11yProps(30)} />
                        <Tab
                          label="Verse Before Gospel OPT2"
                          {...a11yProps(31)}
                        />
                        <Tab label="Alleluia Verse" {...a11yProps(32)} />
                        <Tab label="Alleluia OPT2" {...a11yProps(33)} />
                        <Tab label="Alleluia Text OPT2" {...a11yProps(34)} />
                        <Tab label="Gospel Verse" {...a11yProps(35)} />
                        <Tab label="Gospel Verse 2" {...a11yProps(36)} />
                      </Tabs>
                    </Box>

                    <TabPanel value={postTabValue} index={0}>
                      <TextField
                        fullWidth
                        label="Title"
                        margin="normal"
                        name="title"
                        onChange={handleTitle}
                        type="text"
                        value={title}
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
                    </TabPanel>

                    <TabPanel value={postTabValue} index={1}>
                      <TextField
                        fullWidth
                        //label="Old Password"
                        margin="normal"
                        name="date"
                        onChange={handleDate}
                        type="date"
                        value={date}
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
                    </TabPanel>
                    <>
                      {/********************* READING 1 VERSE ********************/}
                      <TabPanel value={postTabValue} index={2}>
                        <TextField
                          fullWidth
                          label="Reading1 Verse"
                          margin="normal"
                          name="reading1Verse"
                          type="text"
                          onChange={handleReading1Verse}
                          value={reading1Verse}
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
                        {reading1Verse && (
                          <TextField
                            fullWidth
                            label="Reading1 Text"
                            margin="normal"
                            name="reading1Text"
                            onChange={handleReading1Text}
                            type="text"
                            value={reading1Text}
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
                        )}
                      </TabPanel>
                      {/********************* READING 1 OPTION 2 VERSE ********************/}
                      <TabPanel value={postTabValue} index={3}>
                        <TextField
                          fullWidth
                          label="Reading1 Option2 Verse"
                          margin="normal"
                          name="reading1Option2Verse"
                          onChange={handleReading1Option2Verse}
                          type="text"
                          value={reading1Option2Verse}
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
                        {reading1Option2Verse && (
                          <TextField
                            fullWidth
                            label="Reading1 Text Option2"
                            margin="normal"
                            name="reading1TextOption2"
                            onChange={handleReading1TextOption2}
                            type="text"
                            value={reading1TextOption2}
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
                        )}
                      </TabPanel>

                      {/********************* READING 2 VERSE ********************/}
                      <TabPanel value={postTabValue} index={4}>
                        <TextField
                          fullWidth
                          label="Reading2 Verse"
                          margin="normal"
                          name="reading2Verse"
                          onChange={handleReading2Verse}
                          type="text"
                          value={reading2Verse}
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
                        {reading2Verse && (
                          <TextField
                            fullWidth
                            label="Reading2 Text"
                            margin="normal"
                            name="reading2Text"
                            onChange={handleReading2Text}
                            type="text"
                            value={reading2Text}
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
                        )}
                      </TabPanel>
                      {/********************* READING 2 OPTION 1 VERSE ********************/}
                      <TabPanel value={postTabValue} index={5}>
                        <TextField
                          fullWidth
                          label="Reading2 Option1 Verse"
                          margin="normal"
                          name="reading2Option1Verse"
                          onChange={handleReading2Option1Verse}
                          type="text"
                          value={reading2Option1Verse}
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
                        {reading2Option1Verse && (
                          <TextField
                            fullWidth
                            label="Reading2 Text Option1"
                            margin="normal"
                            name="reading2TextOption1"
                            onChange={handleReading2TextOption1}
                            type="text"
                            value={reading2TextOption1}
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
                        )}
                      </TabPanel>
                      {/********************* READING 3 VERSE ********************/}
                      <TabPanel value={postTabValue} index={6}>
                        <TextField
                          fullWidth
                          label="Reading3 Verse"
                          margin="normal"
                          name="reading3Verse"
                          onChange={handleReading3Verse}
                          type="text"
                          value={reading3Verse}
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
                        {reading3Verse && (
                          <TextField
                            fullWidth
                            label="Reading3 Text"
                            margin="normal"
                            name="reading3Text"
                            onChange={handleReading3Text}
                            type="text"
                            value={reading3Text}
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
                        )}
                      </TabPanel>
                      {/********************* READING 4 VERSE ********************/}
                      <TabPanel value={postTabValue} index={7}>
                        <TextField
                          fullWidth
                          label="Reading4 Verse"
                          margin="normal"
                          name="reading4Verse"
                          onChange={handleReading4Verse}
                          type="text"
                          value={reading4Verse}
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
                        {reading4Verse && (
                          <TextField
                            fullWidth
                            label="Reading4 Text"
                            margin="normal"
                            name="reading4Text"
                            onChange={handleReading4Text}
                            type="text"
                            value={reading4Text}
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
                        )}
                      </TabPanel>
                      {/********************* READING 5 VERSE ********************/}
                      <TabPanel value={postTabValue} index={8}>
                        <TextField
                          fullWidth
                          label="Reading5 Verse"
                          margin="normal"
                          name="reading5Verse"
                          onChange={handleReading5Verse}
                          type="text"
                          value={reading5Verse}
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
                        {reading5Verse && (
                          <TextField
                            fullWidth
                            label="Reading5 Text"
                            margin="normal"
                            name="reading5Text"
                            onChange={handleReading5Text}
                            type="text"
                            value={reading5Text}
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
                        )}
                      </TabPanel>
                      {/********************* READING 6 VERSE ********************/}
                      <TabPanel value={postTabValue} index={9}>
                        <TextField
                          fullWidth
                          label="Reading6 Verse"
                          margin="normal"
                          name="reading6Verse"
                          onChange={handleReading6Verse}
                          type="text"
                          value={reading6Verse}
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
                        {reading6Verse && (
                          <TextField
                            fullWidth
                            label="Reading6 Text"
                            margin="normal"
                            name="reading6Text"
                            onChange={handleReading6Text}
                            type="text"
                            value={reading6Text}
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
                        )}
                      </TabPanel>
                      {/********************* READING 7 VERSE ********************/}
                      <TabPanel value={postTabValue} index={10}>
                        <TextField
                          fullWidth
                          label="Reading7 Verse"
                          margin="normal"
                          name="reading7Verse"
                          onChange={handleReading7Verse}
                          type="text"
                          value={reading7Verse}
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
                        {reading7Verse && (
                          <TextField
                            fullWidth
                            label="Reading7 Text"
                            margin="normal"
                            name="reading7Text"
                            onChange={handleReading7Text}
                            type="text"
                            value={reading7Text}
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
                        )}
                      </TabPanel>

                      {/* START FROM HERE  */}
                      <TabPanel value={postTabValue} index={11}>
                        <TextField
                          fullWidth
                          label="Procession Psalm Verse"
                          margin="normal"
                          name="processionPalmVerse"
                          onChange={handleProcessionPalmVerse}
                          type="text"
                          value={processionPalmVerse}
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
                      </TabPanel>

                      <TabPanel value={postTabValue} index={12}>
                        <TextField
                          fullWidth
                          label="Procession Psalms Gospel"
                          margin="normal"
                          name="processionPalmsGospel"
                          onChange={handleProcessionPalmsGospel}
                          type="text"
                          value={processionPalmsGospel}
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
                      </TabPanel>

                      <TabPanel value={postTabValue} index={13}>
                      <TextField
                          fullWidth
                          label="Procession Psalms Gospel 2 Verse"
                          margin="normal"
                          name="processionPalmsGospel2Verse"
                          onChange={handleProcessionPalmsGospel2Verse}
                          type="text"
                          value={processionPalmsGospel2Verse}
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
                        </TabPanel>

<TabPanel value={postTabValue} index={14}>

<TextField
                          fullWidth
                          label="Procession Psalms Gospel 2 Text"
                          margin="normal"
                          name="processionPalmsGospel2Text"
                          onChange={handleProcessionPalmsGospel2Text}
                          type="text"
                          value={processionPalmsGospel2Text}
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
                        </TabPanel>
                      {/*PROCESSIONAL PSALMS GOSPEL2 VERSE*/}
                      <TabPanel value={postTabValue} index={15}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Verse"
                          margin="normal"
                          name="responsorialPsalmVerse"
                          onChange={handleResponsorialPsalmVerse}
                          type="text"
                          value={responsorialPsalmVerse}
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

                        {responsorialPsalmVerse && (
                          <>
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Respond"
                              margin="normal"
                              name="responsorialPsalmRespond"
                              onChange={handleResponsorialPsalmRespond}
                              type="text"
                              value={responsorialPsalmRespond}
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

                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text1"
                              margin="normal"
                              name="responsorialPsalmText1"
                              onChange={handleResponsorialPsalmText1}
                              type="text"
                              value={responsorialPsalmText1}
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
                          </>
                        )}
                      </TabPanel>
                      <TabPanel value={postTabValue} index={16}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text2"
                          margin="normal"
                          name="responsorialPsalmText2"
                          onChange={handleResponsorialPsalmText2}
                          type="text"
                          value={responsorialPsalmText2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={17}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text3"
                          margin="normal"
                          name="responsorialPsalmText3"
                          onChange={handleResponsorialPsalmText3}
                          type="text"
                          value={responsorialPsalmText3}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={18}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text4"
                          margin="normal"
                          name="responsorialPsalmText4"
                          onChange={handleResponsorialPsalmText4}
                          type="text"
                          value={responsorialPsalmText4}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={19}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text5"
                          margin="normal"
                          name="responsorialPsalmText5"
                          onChange={handleResponsorialPsalmText5}
                          type="text"
                          value={responsorialPsalmText5}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={20}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text6"
                          margin="normal"
                          name="responsorialPsalmText6"
                          onChange={handleResponsorialPsalmText6}
                          type="text"
                          value={responsorialPsalmText6}
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
                      </TabPanel>
                      {/*RESPONSIAL PSALM VERSE OPT2*/}
                      <TabPanel value={postTabValue} index={21}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Verse OPT2"
                          margin="normal"
                          name="responsorialPsalmVerseOPT2"
                          onChange={handleResponsorialPsalmVerseOPT2}
                          type="text"
                          value={responsorialPsalmVerseOPT2}
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
                        {responsorialPsalmVerseOPT2 && (
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text1 OPT2"
                            margin="normal"
                            name="responsorialPsalmText1OPT2"
                            onChange={handleResponsorialPsalmText1OPT2}
                            type="text"
                            value={responsorialPsalmText1OPT2}
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
                        )}
                      </TabPanel>
                      <TabPanel value={postTabValue} index={22}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text2 OPT2"
                          margin="normal"
                          name="responsorialPsalmText2OPT2"
                          onChange={handleResponsorialPsalmText2OPT2}
                          type="text"
                          value={responsorialPsalmText2OPT2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={23}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Response OPT2"
                          margin="normal"
                          name="responsorialPsalmResponseOPT2"
                          onChange={handleResponsorialPsalmResponseOPT2}
                          type="text"
                          value={responsorialPsalmResponseOPT2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={24}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text3 OPT2"
                          margin="normal"
                          name="responsorialPsalmText3OPT2"
                          onChange={handleResponsorialPsalmText3OPT2}
                          type="text"
                          value={responsorialPsalmText3OPT2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={25}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text4 OPT2"
                          margin="normal"
                          name="responsorialPsalmText4OPT2"
                          onChange={handleResponsorialPsalmText4OPT2}
                          type="text"
                          value={responsorialPsalmText4OPT2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={26}>
                        <TextField
                          fullWidth
                          label="Responsorial Psalm Text5 OPT2"
                          margin="normal"
                          name="responsorialPsalmText5OPT2"
                          onChange={handleResponsorialPsalmText5OPT2}
                          type="text"
                          value={responsorialPsalmText5OPT2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={27}>
                        <TextField
                          fullWidth
                          label="ResponsorialText1"
                          margin="normal"
                          name="responsorialText1"
                          onChange={handleResponsorialText1}
                          type="text"
                          value={responsorialText1}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={28}>
                        <TextField
                          fullWidth
                          label="ResponsorialText2"
                          margin="normal"
                          name="responsorialText2"
                          onChange={handleResponsorialText2}
                          type="text"
                          value={responsorialText2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={29}>
                        <TextField
                          fullWidth
                          label="ResponsorialText3"
                          margin="normal"
                          name="responsorialText3"
                          onChange={handleResponsorialText3}
                          type="text"
                          value={responsorialText3}
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
                      </TabPanel>

                      <TabPanel value={postTabValue} index={30}>
                        <TextField
                          fullWidth
                          label="Before Gospel Text"
                          margin="normal"
                          name="beforeGospelText"
                          onChange={handleBeforeGospelText}
                          type="text"
                          value={beforeGospelText}
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
                      </TabPanel>
                      {/*VERSE B4 GOSPEL OPT2*/}
                      <TabPanel value={postTabValue} index={31}>
                        <TextField
                          fullWidth
                          label="Verse before Gospel OPT2"
                          margin="normal"
                          name="verseb4GospelOPT2"
                          onChange={handleVerseb4GospelOPT2}
                          type="text"
                          value={verseb4GospelOPT2}
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
                        {verseb4GospelOPT2 && (
                          <TextField
                            fullWidth
                            label="Before Gospel Text OPT2"
                            margin="normal"
                            name="b4GospelTextOPT2"
                            onChange={handleB4GospelTextOPT2}
                            type="text"
                            value={b4GospelTextOPT2}
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
                        )}
                      </TabPanel>
                      {/* ALLELULIA VERSE*/}
                      <TabPanel value={postTabValue} index={32}>
                        <TextField
                          fullWidth
                          label="Alleluia Verse"
                          margin="normal"
                          name="alleluiaVerse"
                          onChange={handleAlleluiaVerse}
                          type="text"
                          value={alleluiaVerse}
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
                        {alleluiaVerse && (
                          <TextField
                            fullWidth
                            label="Alleluia Text"
                            margin="normal"
                            name="alleluiaText"
                            onChange={handleAlleluiaText}
                            type="text"
                            value={alleluiaText}
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
                        )}
                      </TabPanel>

                      <TabPanel value={postTabValue} index={33}>
                        <TextField
                          fullWidth
                          label="Alleluia OPT2"
                          margin="normal"
                          name="alleluiaOPT2"
                          onChange={handleAlleluiaOPT2}
                          type="text"
                          value={alleluiaOPT2}
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
                      </TabPanel>
                      <TabPanel value={postTabValue} index={34}>
                        <TextField
                          fullWidth
                          label="Alleluia Text OPT2"
                          margin="normal"
                          name="alleluiaTextOPT2"
                          onChange={handleAlleluiaTextOPT2}
                          type="text"
                          value={alleluiaTextOPT2}
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
                      </TabPanel>
                      {/*       GOSPEL VERSE        */}
                      <TabPanel value={postTabValue} index={35}>
                        <TextField
                          fullWidth
                          label="Gospel Verse"
                          margin="normal"
                          name="gospelVerse"
                          onChange={handleGospelVerse}
                          type="text"
                          value={gospelVerse}
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
                        {gospelVerse && (
                          <TextField
                            fullWidth
                            label="Gospel Text"
                            margin="normal"
                            name="gospelText"
                            onChange={handleGospelText}
                            type="text"
                            value={gospelText}
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
                        )}
                      </TabPanel>

                      {/*      GOSPEL VERSE 2       */}
                      <TabPanel value={postTabValue} index={36}>
                        <TextField
                          fullWidth
                          label="Gospel Verse2"
                          margin="normal"
                          name="gospelVerse2"
                          onChange={handleGospelVerse2}
                          type="text"
                          value={gospelVerse2}
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
                        {gospelVerse && (
                          <TextField
                            fullWidth
                            label="Gospel Text Option2"
                            margin="normal"
                            name="gospelTextOption2"
                            onChange={handleGospelTextOption2}
                            type="text"
                            value={gospelTextOption2}
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
                        )}
                      </TabPanel>

                      <TabPanel value={postTabValue} index={37}>
                        <TextField
                          fullWidth
                          label="Verse Before Gospel"
                          margin="normal"
                          name="verseBeforeGospel"
                          onChange={handleVerseBeforeGospel}
                          type="text"
                          value={verseBeforeGospel}
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
                      </TabPanel>
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
                        title === "" || date === "" || reading1Verse === ""
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
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={editTabValue}
                          onChange={handleEditTabChange}
                          textColor="inherit"
                          // scrollButtons="auto"
                          aria-label=""
                          variant="scrollable"
                          scrollButtons={false}
                        >
                          <Tab label="Title" {...a11yProps(0)} />
                        <Tab label="Date" {...a11yProps(1)} />
                        <Tab label="Reading 1 verse" {...a11yProps(2)} />
                        <Tab
                          label="Reading 1 option 2 verse"
                          {...a11yProps(3)}
                        />
                        <Tab label="Reading 2 verse" {...a11yProps(4)} />
                        <Tab
                          label="Reading 2 option 1 verse"
                          {...a11yProps(5)}
                        />
                        <Tab label="Reading 3 verse" {...a11yProps(6)} />
                        <Tab label="Reading 4 verse" {...a11yProps(7)} />
                        <Tab label="Reading 5 verse" {...a11yProps(8)} />
                        <Tab label="Reading 6 verse" {...a11yProps(9)} />
                        <Tab label="Reading 7 verse" {...a11yProps(10)} />
                        <Tab
                          label="Procession Psalm Verse"
                          {...a11yProps(11)}
                        />
                        <Tab
                          label="Procession Psalm Gospel"
                          {...a11yProps(12)}
                        />
                        
                        <Tab
                          label="Procession Psalm Gospel 2 Verse"
                          {...a11yProps(13)}
                        />
                        {/* <Tab
                          label="Procession Psalm Gospel 2 Text"
                          {...a11yProps(14)}
                        /> */}
                        <Tab
                          label="Responsorial Psalm Verse"
                          {...a11yProps(14)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 2"
                          {...a11yProps(15)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 3"
                          {...a11yProps(16)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 4"
                          {...a11yProps(17)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 5"
                          {...a11yProps(18)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 6"
                          {...a11yProps(19)}
                        />
                        <Tab
                          label="Responsorial Psalm Verse OPT 2"
                          {...a11yProps(20)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 2 OPT 2"
                          {...a11yProps(21)}
                        />
                        <Tab
                          label="Responsorial Psalm Response OPT 2"
                          {...a11yProps(22)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 3 OPT 2"
                          {...a11yProps(23)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 4 OPT 2"
                          {...a11yProps(24)}
                        />
                        <Tab
                          label="Responsorial Psalm Text 5 OPT 2"
                          {...a11yProps(25)}
                        />
                        <Tab label="Responsorial Text 1" {...a11yProps(26)} />
                        <Tab label="Responsorial Text 2" {...a11yProps(27)} />
                        <Tab label="Responsorial Text 3" {...a11yProps(28)} />
                        <Tab label="Before Gospel Text" {...a11yProps(29)} />
                        <Tab
                          label="Verse Before Gospel OPT2"
                          {...a11yProps(30)}
                        />
                        <Tab label="Alleluia Verse" {...a11yProps(31)} />
                        <Tab label="Alleluia OPT2" {...a11yProps(32)} />
                        <Tab label="Alleluia Text OPT2" {...a11yProps(33)} />
                        <Tab label="Gospel Verse" {...a11yProps(34)} />
                        <Tab label="Gospel Verse 2" {...a11yProps(35)} />
                        </Tabs>
                      </Box>

                      <TabPanel value={editTabValue} index={0}>
                        <TextField
                          fullWidth
                          label="Title"
                          margin="normal"
                          name="title"
                          onChange={handleEditTitle}
                          type="text"
                          value={editTitle}
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
                      </TabPanel>

                      <TabPanel value={editTabValue} index={1}>
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
                      </TabPanel>
                      <>
                        {/********************* READING 1 VERSE ********************/}
                        <TabPanel value={editTabValue} index={2}>
                          <TextField
                            fullWidth
                            label="Reading1 Verse"
                            margin="normal"
                            name="reading1Verse"
                            type="text"
                            onChange={handleEditReading1Verse}
                            value={editReading1Verse}
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
                          {editReading1Verse && (
                            <TextField
                              fullWidth
                              label="Reading1 Text"
                              margin="normal"
                              name="reading1Text"
                              onChange={handleEditReading1Text}
                              type="text"
                              value={editReading1Text}
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
                          )}
                        </TabPanel>

                        {/********************* READING 1 OPTION 2 VERSE ********************/}
                        <TabPanel value={editTabValue} index={3}>
                          <TextField
                            fullWidth
                            label="Reading1 Option2 Verse"
                            margin="normal"
                            name="reading1Option2Verse"
                            onChange={handleEditReading1Option2Verse}
                            type="text"
                            value={editReading1Option2Verse}
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
                          {editReading1Option2Verse && (
                            <TextField
                              fullWidth
                              label="Reading1 Text Option2"
                              margin="normal"
                              name="reading1TextOption2"
                              onChange={handleEditReading1TextOption2}
                              type="text"
                              value={editReading1TextOption2}
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
                          )}
                        </TabPanel>

                        {/********************* READING 2 VERSE ********************/}
                        <TabPanel value={editTabValue} index={4}>
                          <TextField
                            fullWidth
                            label="Reading2 Verse"
                            margin="normal"
                            name="reading2Verse"
                            onChange={handleEditReading2Verse}
                            type="text"
                            value={editReading2Verse}
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
                          {editReading2Verse && (
                            <TextField
                              fullWidth
                              label="Reading2 Text"
                              margin="normal"
                              name="reading2Text"
                              onChange={handleEditReading2Text}
                              type="text"
                              value={editReading2Text}
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
                          )}
                        </TabPanel>

                        {/********************* READING 2 OPTION 1 VERSE ********************/}
                        <TabPanel value={editTabValue} index={5}>
                          <TextField
                            fullWidth
                            label="Reading2 Option1 Verse"
                            margin="normal"
                            name="reading2Option1Verse"
                            onChange={handleEditReading2Option1Verse}
                            type="text"
                            value={editReading2Option1Verse}
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
                          {editReading2Option1Verse && (
                            <TextField
                              fullWidth
                              label="Reading2 Text Option1"
                              margin="normal"
                              name="reading2TextOption1"
                              onChange={handleEditReading2TextOption1}
                              type="text"
                              value={editReading2TextOption1}
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
                          )}
                        </TabPanel>

                        {/********************* READING 3 VERSE ********************/}
                        <TabPanel value={editTabValue} index={6}>
                          <TextField
                            fullWidth
                            label="Reading3 Verse"
                            margin="normal"
                            name="reading3Verse"
                            onChange={handleEditReading3Verse}
                            type="text"
                            value={editReading3Verse}
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
                          {editReading3Verse && (
                            <TextField
                              fullWidth
                              label="Reading3 Text"
                              margin="normal"
                              name="reading3Text"
                              onChange={handleEditReading3Text}
                              type="text"
                              value={editReading3Text}
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
                          )}
                        </TabPanel>

                        {/********************* READING 4 VERSE ********************/}
                        <TabPanel value={editTabValue} index={7}>
                          <TextField
                            fullWidth
                            label="Reading4 Verse"
                            margin="normal"
                            name="reading4Verse"
                            onChange={handleEditReading4Verse}
                            type="text"
                            value={editReading4Verse}
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
                          {editReading4Verse && (
                            <TextField
                              fullWidth
                              label="Reading4 Text"
                              margin="normal"
                              name="reading4Text"
                              onChange={handleEditReading4Text}
                              type="text"
                              value={editReading4Text}
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
                          )}
                        </TabPanel>
                        {/********************* READING 5 VERSE ********************/}
                        <TabPanel value={editTabValue} index={8}>
                          <TextField
                            fullWidth
                            label="Reading5 Verse"
                            margin="normal"
                            name="reading5Verse"
                            onChange={handleEditReading5Verse}
                            type="text"
                            value={editReading5Verse}
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
                          {editReading5Verse && (
                            <TextField
                              fullWidth
                              label="Reading5 Text"
                              margin="normal"
                              name="reading5Text"
                              onChange={handleEditReading5Text}
                              type="text"
                              value={editReading5Text}
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
                          )}
                        </TabPanel>

                        {/********************* READING 6 VERSE ********************/}
                        <TabPanel value={editTabValue} index={9}>
                          <TextField
                            fullWidth
                            label="Reading6 Verse"
                            margin="normal"
                            name="reading6Verse"
                            onChange={handleEditReading6Verse}
                            type="text"
                            value={editReading6Verse}
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
                          {editReading6Verse && (
                            <TextField
                              fullWidth
                              label="Reading6 Text"
                              margin="normal"
                              name="reading6Text"
                              onChange={handleEditReading6Text}
                              type="text"
                              value={editReading6Text}
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
                          )}
                        </TabPanel>

                        {/********************* READING 7 VERSE ********************/}
                        <TabPanel value={editTabValue} index={10}>
                          <TextField
                            fullWidth
                            label="Reading7 Verse"
                            margin="normal"
                            name="reading7Verse"
                            onChange={handleEditReading7Verse}
                            type="text"
                            value={editReading7Verse}
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
                          {editReading7Verse && (
                            <TextField
                              fullWidth
                              label="Reading7 Text"
                              margin="normal"
                              name="reading7Text"
                              onChange={handleEditReading7Text}
                              type="text"
                              value={editReading7Text}
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
                          )}
                        </TabPanel>

                        {/* START FROM HERE  */}
                        <TabPanel value={editTabValue} index={11}>
                          <TextField
                            fullWidth
                            label="Procession Psalm Verse"
                            margin="normal"
                            name="processionPalmVerse"
                            onChange={handleEditProcessionPalmVerse}
                            type="text"
                            value={editProcessionPalmVerse}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={12}>
                          <TextField
                            fullWidth
                            label="Procession Psalms Gospel"
                            margin="normal"
                            name="processionPalmsGospel"
                            onChange={handleEditProcessionPalmsGospel}
                            type="text"
                            value={editProcessionPalmsGospel}
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
                        </TabPanel>

                        {/*PROCESSIONAL PSALMS GOSPEL2 VERSE*/}
                        <TabPanel value={editTabValue} index={13}>
                          <TextField
                            fullWidth
                            label="Procession Psalms Gospel2 Verse"
                            margin="normal"
                            name="processionPalmsGospel2Verse"
                            onChange={handleEditProcessionPalmsGospel2Verse}
                            type="text"
                            value={editProcessionPalmsGospel2Verse}
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
                          {editProcessionPalmsGospel2Verse && (
                            <TextField
                              fullWidth
                              label="Procession Psalms Gospel2 Text"
                              margin="normal"
                              name="processionPalmsGospel2Text"
                              onChange={handleEditProcessionPalmsGospel2Text}
                              type="text"
                              value={editProcessionPalmsGospel2Text}
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
                          )}
                        </TabPanel>

                        {/*RESPONSIAL PSALM VERSE*/}
                        <TabPanel value={editTabValue} index={14}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Verse"
                            margin="normal"
                            name="responsorialPsalmVerse"
                            onChange={handleEditResponsorialPsalmVerse}
                            type="text"
                            value={editResponsorialPsalmVerse}
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
                          {editResponsorialPsalmVerse && (
                            <>
                              <TextField
                                fullWidth
                                label="Responsorial Psalm Respond"
                                margin="normal"
                                name="responsorialPsalmRespond"
                                onChange={handleEditResponsorialPsalmRespond}
                                type="text"
                                value={editResponsorialPsalmRespond}
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
                              <TextField
                                fullWidth
                                label="Responsorial Psalm Text1"
                                margin="normal"
                                name="responsorialPsalmText1"
                                onChange={handleEditResponsorialPsalmText1}
                                type="text"
                                value={editResponsorialPsalmText1}
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
                            </>
                          )}
                        </TabPanel>
                        <TabPanel value={editTabValue} index={15}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text2"
                            margin="normal"
                            name="responsorialPsalmText2"
                            onChange={handleEditResponsorialPsalmText2}
                            type="text"
                            value={editResponsorialPsalmText2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={16}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text3"
                            margin="normal"
                            name="responsorialPsalmText3"
                            onChange={handleEditResponsorialPsalmText3}
                            type="text"
                            value={editResponsorialPsalmText3}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={17}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text4"
                            margin="normal"
                            name="responsorialPsalmText4"
                            onChange={handleEditResponsorialPsalmText4}
                            type="text"
                            value={editResponsorialPsalmText4}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={18}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text5"
                            margin="normal"
                            name="responsorialPsalmText5"
                            onChange={handleEditResponsorialPsalmText5}
                            type="text"
                            value={editResponsorialPsalmText5}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={19}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text6"
                            margin="normal"
                            name="responsorialPsalmText6"
                            onChange={handleEditResponsorialPsalmText6}
                            type="text"
                            value={editResponsorialPsalmText6}
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
                        </TabPanel>

                        {/*RESPONSIAL PSALM VERSE OPT2*/}
                        <TabPanel value={editTabValue} index={20}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Verse OPT2"
                            margin="normal"
                            name="responsorialPsalmVerseOPT2"
                            onChange={handleEditResponsorialPsalmVerseOPT2}
                            type="text"
                            value={editResponsorialPsalmVerseOPT2}
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
                          {editResponsorialPsalmVerseOPT2 && (
                            <TextField
                              fullWidth
                              label="Responsorial Psalm Text1 OPT2"
                              margin="normal"
                              name="responsorialPsalmText1OPT2"
                              onChange={handleEditResponsorialPsalmText1OPT2}
                              type="text"
                              value={editResponsorialPsalmText1OPT2}
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
                          )}
                        </TabPanel>

                        <TabPanel value={editTabValue} index={21}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text2 OPT2"
                            margin="normal"
                            name="responsorialPsalmText2OPT2"
                            onChange={handleEditResponsorialPsalmText2OPT2}
                            type="text"
                            value={editResponsorialPsalmText2OPT2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={22}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Response OPT2"
                            margin="normal"
                            name="responsorialPsalmResponseOPT2"
                            onChange={handleEditResponsorialPsalmResponseOPT2}
                            type="text"
                            value={editResponsorialPsalmResponseOPT2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={23}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text3 OPT2"
                            margin="normal"
                            name="responsorialPsalmText3OPT2"
                            onChange={handleEditResponsorialPsalmText3OPT2}
                            type="text"
                            value={editResponsorialPsalmText3OPT2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={24}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text4 OPT2"
                            margin="normal"
                            name="responsorialPsalmText4OPT2"
                            onChange={handleEditResponsorialPsalmText4OPT2}
                            type="text"
                            value={editResponsorialPsalmText4OPT2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={25}>
                          <TextField
                            fullWidth
                            label="Responsorial Psalm Text5 OPT2"
                            margin="normal"
                            name="responsorialPsalmText5OPT2"
                            onChange={handleEditResponsorialPsalmText5OPT2}
                            type="text"
                            value={editResponsorialPsalmText5OPT2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={26}>
                          <TextField
                            fullWidth
                            label="ResponsorialText1"
                            margin="normal"
                            name="responsorialText1"
                            onChange={handleEditResponsorialText1}
                            type="text"
                            value={editResponsorialText1}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={27}>
                          <TextField
                            fullWidth
                            label="ResponsorialText2"
                            margin="normal"
                            name="responsorialText2"
                            onChange={handleEditResponsorialText2}
                            type="text"
                            value={editResponsorialText2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={28}>
                          <TextField
                            fullWidth
                            label="ResponsorialText3"
                            margin="normal"
                            name="responsorialText3"
                            onChange={handleEditResponsorialText3}
                            type="text"
                            value={editResponsorialText3}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={29}>
                          <TextField
                            fullWidth
                            label="Before Gospel Text"
                            margin="normal"
                            name="beforeGospelText"
                            onChange={handleEditBeforeGospelText}
                            type="text"
                            value={editBeforeGospelText}
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
                        </TabPanel>

                        {/*VERSE B4 GOSPEL OPT2*/}
                        <TabPanel value={editTabValue} index={30}>
                          <TextField
                            fullWidth
                            label="Verse before Gospel OPT2"
                            margin="normal"
                            name="verseb4GospelOPT2"
                            onChange={handleEditVerseb4GospelOPT2}
                            type="text"
                            value={editVerseb4GospelOPT2}
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
                          {editVerseb4GospelOPT2 && (
                            <TextField
                              fullWidth
                              label="Before Gospel Text OPT2"
                              margin="normal"
                              name="b4GospelTextOPT2"
                              onChange={handleEditB4GospelTextOPT2}
                              type="text"
                              value={editB4GospelTextOPT2}
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
                          )}
                        </TabPanel>

                        {/* ALLELULIA VERSE*/}
                        <TabPanel value={editTabValue} index={31}>
                          <TextField
                            fullWidth
                            label="Alleluia Verse"
                            margin="normal"
                            name="alleluiaVerse"
                            onChange={handleEditAlleluiaVerse}
                            type="text"
                            value={editAlleluiaVerse}
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
                          {editAlleluiaVerse && (
                            <TextField
                              fullWidth
                              label="Alleluia Text"
                              margin="normal"
                              name="alleluiaText"
                              onChange={handleEditAlleluiaText}
                              type="text"
                              value={editAlleluiaText}
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
                          )}
                        </TabPanel>

                        <TabPanel value={editTabValue} index={32}>
                          <TextField
                            fullWidth
                            label="Alleluia OPT2"
                            margin="normal"
                            name="alleluiaOPT2"
                            onChange={handleEditAlleluiaOPT2}
                            type="text"
                            value={editAlleluiaOPT2}
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
                        </TabPanel>

                        <TabPanel value={editTabValue} index={33}>
                          <TextField
                            fullWidth
                            label="Alleluia Text OPT2"
                            margin="normal"
                            name="alleluiaTextOPT2"
                            onChange={handleEditAlleluiaTextOPT2}
                            type="text"
                            value={editAlleluiaTextOPT2}
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
                        </TabPanel>

                        {/*       GOSPEL VERSE        */}
                        <TabPanel value={editTabValue} index={34}>
                          <TextField
                            fullWidth
                            label="Gospel Verse"
                            margin="normal"
                            name="gospelVerse"
                            onChange={handleEditGospelVerse}
                            type="text"
                            value={editGospelVerse}
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
                          {editGospelVerse && (
                            <TextField
                              fullWidth
                              label="Gospel Text"
                              margin="normal"
                              name="gospelText"
                              onChange={handleEditGospelText}
                              type="text"
                              value={editGospelText}
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
                          )}
                        </TabPanel>

                        {/*      GOSPEL VERSE 2       */}
                        <TabPanel value={editTabValue} index={35}>
                          <TextField
                            fullWidth
                            label="Gospel Verse2"
                            margin="normal"
                            name="gospelVerse2"
                            onChange={handleEditGospelVerse2}
                            type="text"
                            value={editGospelVerse2}
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
                          {editGospelVerse && (
                            <TextField
                              fullWidth
                              label="Gospel Text Option2"
                              margin="normal"
                              name="gospelTextOption2"
                              onChange={handleEditGospelTextOption2}
                              type="text"
                              value={editGospelTextOption2}
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
                          )}
                        </TabPanel>

                        <TabPanel value={editTabValue} index={36}>
                          <TextField
                            fullWidth
                            label="Verse Before Gospel"
                            margin="normal"
                            name="verseBeforeGospel"
                            onChange={handleEditVerseBeforeGospel}
                            type="text"
                            value={editVerseBeforeGospel}
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
                        </TabPanel>
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
                          editTitle === "" ||
                          editDate === "" ||
                          editReading1Verse === ""
                        }
                        onClick={() => {
                          editDailyReadingMutation.mutate({
                            id,
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
