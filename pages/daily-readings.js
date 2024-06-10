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
  //BIBLE ID
  const [bibleId, setBibleId] = useState("");
  const [books, setBooks] = useState([]);

  //////READING 1 VERSE/////////
  const [selectedBook, setSelectedBook] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState([]);
  const [confirmedVerses, setConfirmedVerses] = useState([]);
  ////////READING 1 OPTION 2 VERSE///////
  const [selectedBook2, setSelectedBook2] = useState("");
  const [chapters2, setChapters2] = useState([]);
  const [selectedChapter2, setSelectedChapter2] = useState("");
  const [verses2, setVerses2] = useState([]);
  const [selectedVerse2, setSelectedVerse2] = useState([]);
  const [confirmedVerses2, setConfirmedVerses2] = useState([]);
  /////////READING 2 VERSE ////////////
  const [selectedBook3, setSelectedBook3] = useState("");
  const [chapters3, setChapters3] = useState([]);
  const [selectedChapter3, setSelectedChapter3] = useState("");
  const [verses3, setVerses3] = useState([]);
  const [selectedVerse3, setSelectedVerse3] = useState([]);
  const [confirmedVerses3, setConfirmedVerses3] = useState([]);
  /////////READING 2 OPTION 1 VERSE ////////////
  const [selectedBook9, setSelectedBook9] = useState("");
  const [chapters9, setChapters9] = useState([]);
  const [selectedChapter9, setSelectedChapter9] = useState("");
  const [verses9, setVerses9] = useState([]);
  const [selectedVerse9, setSelectedVerse9] = useState([]);
  const [confirmedVerses9, setConfirmedVerses9] = useState([]);
  /////////////READING 3 VERSE///////////
  const [selectedBook4, setSelectedBook4] = useState("");
  const [chapters4, setChapters4] = useState([]);
  const [selectedChapter4, setSelectedChapter4] = useState("");
  const [verses4, setVerses4] = useState([]);
  const [selectedVerse4, setSelectedVerse4] = useState([]);
  const [confirmedVerses4, setConfirmedVerses4] = useState([]);
  //////////////READING 4 VERSE///////////
  const [selectedBook5, setSelectedBook5] = useState("");
  const [chapters5, setChapters5] = useState([]);
  const [selectedChapter5, setSelectedChapter5] = useState("");
  const [verses5, setVerses5] = useState([]);
  const [selectedVerse5, setSelectedVerse5] = useState([]);
  const [confirmedVerses5, setConfirmedVerses5] = useState([]);
  //////////////////READING 5 VERSE///////////
  const [selectedBook6, setSelectedBook6] = useState("");
  const [chapters6, setChapters6] = useState([]);
  const [selectedChapter6, setSelectedChapter6] = useState("");
  const [verses6, setVerses6] = useState([]);
  const [selectedVerse6, setSelectedVerse6] = useState([]);
  const [confirmedVerses6, setConfirmedVerses6] = useState([]);
  /////////////////READING 6 VERSE//////////////////
  const [selectedBook7, setSelectedBook7] = useState("");
  const [chapters7, setChapters7] = useState([]);
  const [selectedChapter7, setSelectedChapter7] = useState("");
  const [verses7, setVerses7] = useState([]);
  const [selectedVerse7, setSelectedVerse7] = useState([]);
  const [confirmedVerses7, setConfirmedVerses7] = useState([]);
  ///////////////READING 7 VERSE/////////////
  const [selectedBook8, setSelectedBook8] = useState("");
  const [chapters8, setChapters8] = useState([]);
  const [selectedChapter8, setSelectedChapter8] = useState("");
  const [verses8, setVerses8] = useState([]);
  const [selectedVerse8, setSelectedVerse8] = useState([]);
  const [confirmedVerses8, setConfirmedVerses8] = useState([]);
  //////////////PROCESSIONAL PSALMS GOSPEL2 VERSE////////////////
  const [selectedBook10, setSelectedBook10] = useState("");
  const [chapters10, setChapters10] = useState([]);
  const [selectedChapter10, setSelectedChapter10] = useState("");
  const [verses10, setVerses10] = useState([]);
  const [selectedVerse10, setSelectedVerse10] = useState([]);
  const [confirmedVerses10, setConfirmedVerses10] = useState([]);
  /////////////RESPONSIAL PSALM VERSE///////////////////
  const [selectedBook11, setSelectedBook11] = useState("");
  const [chapters11, setChapters11] = useState([]);
  const [selectedChapter11, setSelectedChapter11] = useState("");
  const [verses11, setVerses11] = useState([]);
  const [selectedVerse11, setSelectedVerse11] = useState([]);
  const [confirmedVerses11, setConfirmedVerses11] = useState([]);
  ////////////RESPONSIAL PSALM VERSE OPT2////////////////
  const [selectedBook12, setSelectedBook12] = useState("");
  const [chapters12, setChapters12] = useState([]);
  const [selectedChapter12, setSelectedChapter12] = useState("");
  const [verses12, setVerses12] = useState([]);
  const [selectedVerse12, setSelectedVerse12] = useState([]);
  const [confirmedVerses12, setConfirmedVerses12] = useState([]);
  /////////////////VERSE B4 GOSPEL OPT2////////////////
  const [selectedBook13, setSelectedBook13] = useState("");
  const [chapters13, setChapters13] = useState([]);
  const [selectedChapter13, setSelectedChapter13] = useState("");
  const [verses13, setVerses13] = useState([]);
  const [selectedVerse13, setSelectedVerse13] = useState([]);
  const [confirmedVerses13, setConfirmedVerses13] = useState([]);
  ////////////////ALLELULIA VERSE///////////////////////////
  const [selectedBook14, setSelectedBook14] = useState("");
  const [chapters14, setChapters14] = useState([]);
  const [selectedChapter14, setSelectedChapter14] = useState("");
  const [verses14, setVerses14] = useState([]);
  const [selectedVerse14, setSelectedVerse14] = useState([]);
  const [confirmedVerses14, setConfirmedVerses14] = useState([]);
  //////////////////GOSPEL VERSE////////////////////////
  const [selectedBook15, setSelectedBook15] = useState("");
  const [chapters15, setChapters15] = useState([]);
  const [selectedChapter15, setSelectedChapter15] = useState("");
  const [verses15, setVerses15] = useState([]);
  const [selectedVerse15, setSelectedVerse15] = useState([]);
  const [confirmedVerses15, setConfirmedVerses15] = useState([]);
  /////////////////////////GOSPEL VERSE 2//////////////////
  const [selectedBook16, setSelectedBook16] = useState("");
  const [chapters16, setChapters16] = useState([]);
  const [selectedChapter16, setSelectedChapter16] = useState("");
  const [verses16, setVerses16] = useState([]);
  const [selectedVerse16, setSelectedVerse16] = useState([]);
  const [confirmedVerses16, setConfirmedVerses16] = useState([]);

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
  //EDIT BIBLE ID
  const [editBibleId, setEditBibleId] = useState("40072c4a5aba4022-01");
  const [editBooks, setEditBooks] = useState([]);

  //////EDIT READING 1 VERSE/////////
  const [editSelectedBook, setEditSelectedBook] = useState("");
  const [editChapters, setEditChapters] = useState([]);
  const [editSelectedChapter, setEditSelectedChapter] = useState("");
  const [editVerses, setEditVerses] = useState([]);
  const [editSelectedVerse, setEditSelectedVerse] = useState([]);
  const [editConfirmedVerses, setEditConfirmedVerses] = useState([]);
  ////////EDIT READING 1 OPTION 2 VERSE///////
  const [editSelectedBook2, setEditSelectedBook2] = useState("");
  const [editChapters2, setEditChapters2] = useState([]);
  const [editSelectedChapter2, setEditSelectedChapter2] = useState("");
  const [editVerses2, setEditVerses2] = useState([]);
  const [editSelectedVerse2, setEditSelectedVerse2] = useState([]);
  const [editConfirmedVerses2, setEditConfirmedVerses2] = useState([]);
  /////////EDIT READING 2 VERSE ////////////
  const [editSelectedBook3, setEditSelectedBook3] = useState("");
  const [editChapters3, setEditChapters3] = useState([]);
  const [editSelectedChapter3, setEditSelectedChapter3] = useState("");
  const [editVerses3, setEditVerses3] = useState([]);
  const [editSelectedVerse3, setEditSelectedVerse3] = useState([]);
  const [editConfirmedVerses3, setEditConfirmedVerses3] = useState([]);
  /////////EDIT READING 2 OPTION 1 VERSE ////////////
  const [editSelectedBook9, setEditSelectedBook9] = useState("");
  const [editChapters9, setEditChapters9] = useState([]);
  const [editSelectedChapter9, setEditSelectedChapter9] = useState("");
  const [editVerses9, setEditVerses9] = useState([]);
  const [editSelectedVerse9, setEditSelectedVerse9] = useState([]);
  const [editConfirmedVerses9, setEditConfirmedVerses9] = useState([]);
  /////////////EDIT READING 3 VERSE///////////
  const [editSelectedBook4, setEditSelectedBook4] = useState("");
  const [editChapters4, setEditChapters4] = useState([]);
  const [editSelectedChapter4, setEditSelectedChapter4] = useState("");
  const [editVerses4, setEditVerses4] = useState([]);
  const [editSelectedVerse4, setEditSelectedVerse4] = useState([]);
  const [editConfirmedVerses4, setEditConfirmedVerses4] = useState([]);
  //////////////EDIT READING 4 VERSE///////////
  const [editSelectedBook5, setEditSelectedBook5] = useState("");
  const [editChapters5, setEditChapters5] = useState([]);
  const [editSelectedChapter5, setEditSelectedChapter5] = useState("");
  const [editVerses5, setEditVerses5] = useState([]);
  const [editSelectedVerse5, setEditSelectedVerse5] = useState([]);
  const [editConfirmedVerses5, setEditConfirmedVerses5] = useState([]);
  //////////////////EDIT READING 5 VERSE///////////
  const [editSelectedBook6, setEditSelectedBook6] = useState("");
  const [editChapters6, setEditChapters6] = useState([]);
  const [editSelectedChapter6, setEditSelectedChapter6] = useState("");
  const [editVerses6, setEditVerses6] = useState([]);
  const [editSelectedVerse6, setEditSelectedVerse6] = useState([]);
  const [editConfirmedVerses6, setEditConfirmedVerses6] = useState([]);
  /////////////////EDIT READING 6 VERSE//////////////////
  const [editSelectedBook7, setEditSelectedBook7] = useState("");
  const [editChapters7, setEditChapters7] = useState([]);
  const [editSelectedChapter7, setEditSelectedChapter7] = useState("");
  const [editVerses7, setEditVerses7] = useState([]);
  const [editSelectedVerse7, setEditSelectedVerse7] = useState([]);
  const [editConfirmedVerses7, setEditConfirmedVerses7] = useState([]);
  ///////////////EDIT READING 7 VERSE/////////////
  const [editSelectedBook8, setEditSelectedBook8] = useState("");
  const [editChapters8, setEditChapters8] = useState([]);
  const [editSelectedChapter8, setEditSelectedChapter8] = useState("");
  const [editVerses8, setEditVerses8] = useState([]);
  const [editSelectedVerse8, setEditSelectedVerse8] = useState([]);
  const [editConfirmedVerses8, setEditConfirmedVerses8] = useState([]);
  //////////////EDIT PROCESSIONAL PSALMS GOSPEL2 VERSE////////////////
  const [editSelectedBook10, setEditSelectedBook10] = useState("");
  const [editChapters10, setEditChapters10] = useState([]);
  const [editSelectedChapter10, setEditSelectedChapter10] = useState("");
  const [editVerses10, setEditVerses10] = useState([]);
  const [editSelectedVerse10, setEditSelectedVerse10] = useState([]);
  const [editConfirmedVerses10, setEditConfirmedVerses10] = useState([]);
  /////////////EDIT RESPONSIAL PSALM VERSE///////////////////
  const [editSelectedBook11, setEditSelectedBook11] = useState("");
  const [editChapters11, setEditChapters11] = useState([]);
  const [editSelectedChapter11, setEditSelectedChapter11] = useState("");
  const [editVerses11, setEditVerses11] = useState([]);
  const [editSelectedVerse11, setEditSelectedVerse11] = useState([]);
  const [editConfirmedVerses11, setEditConfirmedVerses11] = useState([]);
  ////////////EDIT RESPONSIAL PSALM VERSE OPT2////////////////
  const [editSelectedBook12, setEditSelectedBook12] = useState("");
  const [editChapters12, setEditChapters12] = useState([]);
  const [editSelectedChapter12, setEditSelectedChapter12] = useState("");
  const [editVerses12, setEditVerses12] = useState([]);
  const [editSelectedVerse12, setEditSelectedVerse12] = useState([]);
  const [editConfirmedVerses12, setEditConfirmedVerses12] = useState([]);
  /////////////////EDIT VERSE B4 GOSPEL OPT2////////////////
  const [editSelectedBook13, setEditSelectedBook13] = useState("");
  const [editChapters13, setEditChapters13] = useState([]);
  const [editSelectedChapter13, setEditSelectedChapter13] = useState("");
  const [editVerses13, setEditVerses13] = useState([]);
  const [editSelectedVerse13, setEditSelectedVerse13] = useState([]);
  const [editConfirmedVerses13, setEditConfirmedVerses13] = useState([]);
  ////////////////EDIT ALLELULIA VERSE///////////////////////////
  const [editSelectedBook14, setEditSelectedBook14] = useState("");
  const [editChapters14, setEditChapters14] = useState([]);
  const [editSelectedChapter14, setEditSelectedChapter14] = useState("");
  const [editVerses14, setEditVerses14] = useState([]);
  const [editSelectedVerse14, setEditSelectedVerse14] = useState([]);
  const [editConfirmedVerses14, setEditConfirmedVerses14] = useState([]);
  //////////////////EDIT GOSPEL VERSE////////////////////////
  const [editSelectedBook15, setEditSelectedBook15] = useState("");
  const [editChapters15, setEditChapters15] = useState([]);
  const [editSelectedChapter15, setEditSelectedChapter15] = useState("");
  const [editVerses15, setEditVerses15] = useState([]);
  const [editSelectedVerse15, setEditSelectedVerse15] = useState([]);
  const [editConfirmedVerses15, setEditConfirmedVerses15] = useState([]);
  /////////////////////////EDIT GOSPEL VERSE 2//////////////////
  const [editSelectedBook16, setEditSelectedBook16] = useState("");
  const [editChapters16, setEditChapters16] = useState([]);
  const [editSelectedChapter16, setEditSelectedChapter16] = useState("");
  const [editVerses16, setEditVerses16] = useState([]);
  const [editSelectedVerse16, setEditSelectedVerse16] = useState([]);
  const [editConfirmedVerses16, setEditConfirmedVerses16] = useState([]);

  const [dailyReadingToast, setDailyReadingToast] = useState({
    error: false,
    success: false,
  });

  const [editDailyReadingToast, setEditDailyReadingToast] = useState({
    error: false,
    success: false,
  });

  const [tabValue, setTabValue] = useState(0);

  const formatVerseRange = (verses) => {
    let formattedVerses = [];
    let startVerse = null;
    let endVerse = null;

    for (let i = 0; i < verses.length; i++) {
      const verseParts = verses[i].split(".");
      const chapter = verseParts[1];
      const verse = verseParts[2];

      if (startVerse === null) {
        startVerse = verses[i];
        endVerse = verses[i];
      } else if (parseInt(verse) === parseInt(endVerse.split(".")[2]) + 1) {
        endVerse = verses[i];
      } else {
        if (startVerse === endVerse) {
          formattedVerses.push(startVerse);
        } else {
          formattedVerses.push(
            `${startVerse.split(".")[0]}.${startVerse.split(".")[1]}.${
              startVerse.split(".")[2]
            }-${endVerse.split(".")[2]}`
          );
        }
        startVerse = verses[i];
        endVerse = verses[i];
      }
    }

    if (startVerse !== null) {
      if (startVerse === endVerse) {
        formattedVerses.push(startVerse);
      } else {
        formattedVerses.push(
          `${startVerse.split(".")[0]}.${startVerse.split(".")[1]}.${
            startVerse.split(".")[2]
          }-${endVerse.split(".")[2]}`
        );
      }
    }

    return formattedVerses.join(", ");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const handleBibleId = (event) => {
    setBibleId(event.target.value);
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

  const handleEditBibleId = (event) => {
    setEditBibleId(event.target.value);
  };

  /////////POST VERSES/////////////////
  const handleFetchVerses = () => {
    if (selectedVerse.length > 0) {
      setConfirmedVerses([...confirmedVerses, ...selectedVerse]);
    }
    if (selectedVerse2.length > 0) {
      setConfirmedVerses2([...confirmedVerses2, ...selectedVerse2]);
    }
    if (selectedVerse3.length > 0) {
      setConfirmedVerses3([...confirmedVerses3, ...selectedVerse3]);
    }
    if (selectedVerse4.length > 0) {
      setConfirmedVerses4([...confirmedVerses4, ...selectedVerse4]);
    }
    if (selectedVerse5.length > 0) {
      setConfirmedVerses5([...confirmedVerses5, ...selectedVerse5]);
    }
    if (selectedVerse6.length > 0) {
      setConfirmedVerses6([...confirmedVerses6, ...selectedVerse6]);
    }
    if (selectedVerse7.length > 0) {
      setConfirmedVerses7([...confirmedVerses7, ...selectedVerse7]);
    }
    if (selectedVerse8.length > 0) {
      setConfirmedVerses8([...confirmedVerses8, ...selectedVerse8]);
    }
    if (selectedVerse9.length > 0) {
      setConfirmedVerses9([...confirmedVerses9, ...selectedVerse9]);
    }
    if (selectedVerse10.length > 0) {
      setConfirmedVerses10([...confirmedVerses10, ...selectedVerse10]);
    }
    if (selectedVerse11.length > 0) {
      setConfirmedVerses11([...confirmedVerses11, ...selectedVerse11]);
    }
    if (selectedVerse12.length > 0) {
      setConfirmedVerses12([...confirmedVerses12, ...selectedVerse12]);
    }
    if (selectedVerse13.length > 0) {
      setConfirmedVerses13([...confirmedVerses13, ...selectedVerse13]);
    }
    if (selectedVerse14.length > 0) {
      setConfirmedVerses14([...confirmedVerses14, ...selectedVerse14]);
    }
    if (selectedVerse15.length > 0) {
      setConfirmedVerses15([...confirmedVerses15, ...selectedVerse15]);
    }
    if (selectedVerse16.length > 0) {
      setConfirmedVerses16([...confirmedVerses16, ...selectedVerse16]);
    }
  };

  ///////////////EDIT VERSES////////////
  const handleEditFetchVerses = () => {
    if (editSelectedVerse.length > 0) {
      setEditConfirmedVerses([...editConfirmedVerses, ...editSelectedVerse]);
    }
    if (editSelectedVerse2.length > 0) {
      setEditConfirmedVerses2([...editConfirmedVerses2, ...editSelectedVerse2]);
    }
    if (editSelectedVerse3.length > 0) {
      setEditConfirmedVerses3([...editConfirmedVerses3, ...editSelectedVerse3]);
    }
    if (editSelectedVerse4.length > 0) {
      setEditConfirmedVerses4([...editConfirmedVerses4, ...editSelectedVerse4]);
    }
    if (editSelectedVerse5.length > 0) {
      setEditConfirmedVerses5([...editConfirmedVerses5, ...editSelectedVerse5]);
    }
    if (editSelectedVerse6.length > 0) {
      setEditConfirmedVerses6([...editConfirmedVerses6, ...editSelectedVerse6]);
    }
    if (editSelectedVerse7.length > 0) {
      setEditConfirmedVerses7([...editConfirmedVerses7, ...editSelectedVerse7]);
    }
    if (editSelectedVerse8.length > 0) {
      setEditConfirmedVerses8([...editConfirmedVerses8, ...editSelectedVerse8]);
    }
    if (editSelectedVerse9.length > 0) {
      setEditConfirmedVerses9([...editConfirmedVerses9, ...editSelectedVerse9]);
    }
    if (editSelectedVerse10.length > 0) {
      setEditConfirmedVerses10([
        ...editConfirmedVerses10,
        ...editSelectedVerse10,
      ]);
    }
    if (editSelectedVerse11.length > 0) {
      setEditConfirmedVerses11([
        ...editConfirmedVerses11,
        ...editSelectedVerse11,
      ]);
    }
    if (editSelectedVerse12.length > 0) {
      setEditConfirmedVerses12([
        ...editConfirmedVerses12,
        ...editSelectedVerse12,
      ]);
    }
    if (editSelectedVerse13.length > 0) {
      setEditConfirmedVerses13([
        ...editConfirmedVerses13,
        ...editSelectedVerse13,
      ]);
    }
    if (editSelectedVerse14.length > 0) {
      setEditConfirmedVerses14([
        ...editConfirmedVerses14,
        ...editSelectedVerse14,
      ]);
    }
    if (editSelectedVerse15.length > 0) {
      setEditConfirmedVerses15([
        ...editConfirmedVerses15,
        ...editSelectedVerse15,
      ]);
    }
    if (editSelectedVerse16.length > 0) {
      setEditConfirmedVerses16([
        ...editConfirmedVerses16,
        ...editSelectedVerse16,
      ]);
    }
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

      console.log(data);

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
      enabled: !!user?.token,
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

  const apiKey = "1b403d7377c77b6554e9fb5b2f7dcf6b";

  useEffect(() => {
    axios
      .get(`https://api.scripture.api.bible/v1/bibles/${bibleId}/books`, {
        headers: { "api-key": apiKey },
      })
      .then((response) => {
        setBooks(response.data.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [bibleId]);

  useEffect(() => {
    axios
      .get(`https://api.scripture.api.bible/v1/bibles/${editBibleId}/books`, {
        headers: { "api-key": apiKey },
      })
      .then((response) => {
        setEditBooks(response.data.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [editBibleId]);

  ////////////////READING 1 VERSE///////////////////////
  useEffect(() => {
    if (selectedBook) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook, bibleId]);

  useEffect(() => {
    if (selectedChapter) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter, bibleId]);

  useEffect(() => {
    if (selectedBook && selectedChapter && confirmedVerses.length > 0) {
      setReading1Verse(formatVerseRange(confirmedVerses));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading1Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook, selectedChapter, confirmedVerses, bibleId]);

  ////////////////EDIT READING 1 VERSE///////////////////////
  useEffect(() => {
    if (editSelectedBook) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook &&
      editSelectedChapter &&
      editConfirmedVerses.length > 0
    ) {
      setEditReading1Verse(formatVerseRange(editConfirmedVerses));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading1Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [editSelectedBook, editSelectedChapter, editConfirmedVerses, editBibleId]);

  ////////////////READING 1 OPTION 2 VERSE///////////////////////
  useEffect(() => {
    if (selectedBook2) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook2}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters2(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook2, bibleId]);

  useEffect(() => {
    if (selectedChapter2) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter2}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses2(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter2, bibleId]);

  useEffect(() => {
    if (selectedBook2 && selectedChapter2 && confirmedVerses2.length > 0) {
      setReading1Option2Verse(formatVerseRange(confirmedVerses2));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses2.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading1TextOption2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook2, selectedChapter2, confirmedVerses2, bibleId]);

  ////////////////EDIT READING 1 OPTION 2 VERSE///////////////////////
  useEffect(() => {
    if (editSelectedBook2) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook2}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters2(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook2, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter2) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter2}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses2(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter2, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook2 &&
      editSelectedChapter2 &&
      editConfirmedVerses2.length > 0
    ) {
      setEditReading1Option2Verse(formatVerseRange(editConfirmedVerses2));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses2.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading1TextOption2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook2,
    editSelectedChapter2,
    editConfirmedVerses2,
    editBibleId,
  ]);

  ///////////READING 2 VERSE/////////
  useEffect(() => {
    if (selectedBook3) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook3}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters3(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook3, bibleId]);

  useEffect(() => {
    if (selectedChapter3) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter3}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses3(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter3, bibleId]);

  useEffect(() => {
    if (selectedBook3 && selectedChapter3 && confirmedVerses3.length > 0) {
      setReading2Verse(formatVerseRange(confirmedVerses3));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses3.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading2Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook3, selectedChapter3, confirmedVerses3, bibleId]);

  ///////////EDIT READING 2 VERSE/////////
  useEffect(() => {
    if (editSelectedBook3) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook3}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters3(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook3, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter3) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter3}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses3(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter3, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook3 &&
      editSelectedChapter3 &&
      editConfirmedVerses3.length > 0
    ) {
      setEditReading2Verse(formatVerseRange(editConfirmedVerses3));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses3.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading2Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook3,
    editSelectedChapter3,
    editConfirmedVerses3,
    editBibleId,
  ]);

  ///////////READING 2 OPTION 1 VERSE/////////
  useEffect(() => {
    if (selectedBook9) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook9}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters9(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook9, bibleId]);

  useEffect(() => {
    if (selectedChapter9) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter9}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses9(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter9, bibleId]);

  useEffect(() => {
    if (selectedBook9 && selectedChapter9 && confirmedVerses9.length > 0) {
      setReading2Option1Verse(formatVerseRange(confirmedVerses9));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses9.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading2TextOption1(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook9, selectedChapter9, confirmedVerses9, bibleId]);

  ///////////EDIT READING 2 OPTION 1 VERSE/////////
  useEffect(() => {
    if (editSelectedBook9) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook9}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters9(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook9, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter9) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter9}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses9(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter9, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook9 &&
      editSelectedChapter9 &&
      editConfirmedVerses9.length > 0
    ) {
      setEditReading2Option1Verse(formatVerseRange(editConfirmedVerses9));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses9.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading2TextOption1(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook9,
    editSelectedChapter9,
    editConfirmedVerses9,
    editBibleId,
  ]);

  ///////////READING 3 VERSE/////////
  useEffect(() => {
    if (selectedBook4) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook4}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters4(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook4, bibleId]);

  useEffect(() => {
    if (selectedChapter4) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter4}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses4(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter4, bibleId]);

  useEffect(() => {
    if (selectedBook4 && selectedChapter4 && confirmedVerses4.length > 0) {
      setReading3Verse(formatVerseRange(confirmedVerses4));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses4.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading3Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook4, selectedChapter4, confirmedVerses4, bibleId]);

  ///////////EDIT READING 3 VERSE/////////
  useEffect(() => {
    if (editSelectedBook4) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook4}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters4(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook4, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter4) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter4}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses4(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter4, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook4 &&
      editSelectedChapter4 &&
      editConfirmedVerses4.length > 0
    ) {
      setEditReading3Verse(formatVerseRange(editConfirmedVerses4));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses4.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading3Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook4,
    editSelectedChapter4,
    editConfirmedVerses4,
    editBibleId,
  ]);

  ///////////READING 4 VERSE/////////
  useEffect(() => {
    if (selectedBook5) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook5}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters5(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook5, bibleId]);

  useEffect(() => {
    if (selectedChapter5) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter5}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses5(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter5, bibleId]);

  useEffect(() => {
    if (selectedBook5 && selectedChapter5 && confirmedVerses5.length > 0) {
      setReading4Verse(formatVerseRange(confirmedVerses5));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses5.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading4Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook5, selectedChapter5, confirmedVerses5, bibleId]);

  ///////////EDIT READING 4 VERSE/////////
  useEffect(() => {
    if (editSelectedBook5) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editselectedBook5}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters5(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook5, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter5) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter5}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses5(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter5, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook5 &&
      editSelectedChapter5 &&
      editConfirmedVerses5.length > 0
    ) {
      setEditReading4Verse(formatVerseRange(editConfirmedVerses5));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses5.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading4Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook5,
    editSelectedChapter5,
    editConfirmedVerses5,
    editBibleId,
  ]);

  ///////////READING 5 VERSE/////////
  useEffect(() => {
    if (selectedBook6) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook6}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters6(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook6, bibleId]);

  useEffect(() => {
    if (selectedChapter6) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter6}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses6(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter6, bibleId]);

  useEffect(() => {
    if (selectedBook6 && selectedChapter6 && confirmedVerses6.length > 0) {
      setReading5Verse(formatVerseRange(confirmedVerses6));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses6.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading5Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook6, selectedChapter6, confirmedVerses6, bibleId]);

  ///////////EDIT READING 5 VERSE/////////
  useEffect(() => {
    if (editSelectedBook6) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook6}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters6(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook6, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter6) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter6}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses6(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter6, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook6 &&
      editSelectedChapter6 &&
      editConfirmedVerses6.length > 0
    ) {
      setEditReading5Verse(formatVerseRange(editConfirmedVerses6));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses6.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading5Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook6,
    editSelectedChapter6,
    editConfirmedVerses6,
    editBibleId,
  ]);

  ///////////READING 6 VERSE/////////
  useEffect(() => {
    if (selectedBook7) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook7}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters7(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook7, bibleId]);

  useEffect(() => {
    if (selectedChapter7) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter7}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses7(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter7, bibleId]);

  useEffect(() => {
    if (selectedBook7 && selectedChapter7 && confirmedVerses7.length > 0) {
      setReading6Verse(formatVerseRange(confirmedVerses7));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses7.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading6Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook7, selectedChapter7, confirmedVerses7, bibleId]);

  ///////////EDIT READING 6 VERSE/////////
  useEffect(() => {
    if (editSelectedBook7) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook7}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters7(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook7, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter7) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter7}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses7(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter7, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook7 &&
      editSelectedChapter7 &&
      editConfirmedVerses7.length > 0
    ) {
      setEditReading6Verse(formatVerseRange(editConfirmedVerses7));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses7.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading6Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook7,
    editSelectedChapter7,
    editConfirmedVerses7,
    editBibleId,
  ]);

  ///////////READING 7 VERSE/////////
  useEffect(() => {
    if (selectedBook8) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook8}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters8(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook8, bibleId]);

  useEffect(() => {
    if (selectedChapter8) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter8}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses8(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter8, bibleId]);

  useEffect(() => {
    if (selectedBook8 && selectedChapter8 && confirmedVerses8.length > 0) {
      setReading7Verse(formatVerseRange(confirmedVerses8));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses8.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setReading7Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook8, selectedChapter8, confirmedVerses8, bibleId]);

  ///////////EDIT READING 7 VERSE/////////
  useEffect(() => {
    if (editSelectedBook8) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook8}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters8(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook8, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter8) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter8}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses8(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter8, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook8 &&
      editSelectedChapter8 &&
      editConfirmedVerses8.length > 0
    ) {
      setEditReading7Verse(formatVerseRange(editConfirmedVerses8));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses8.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditReading7Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook8,
    editSelectedChapter8,
    editConfirmedVerses8,
    editBibleId,
  ]);

  //////////////PROCESSIONAL PSALMS GOSPEL2 VERSE////////////////
  useEffect(() => {
    if (selectedBook10) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook10}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters10(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook10, bibleId]);

  useEffect(() => {
    if (selectedChapter10) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter10}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses10(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter10, bibleId]);

  useEffect(() => {
    if (selectedBook10 && selectedChapter10 && confirmedVerses10.length > 0) {
      setProcessionPalmsGospel2Verse(formatVerseRange(confirmedVerses10));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses10.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setProcessionPalmsGospel2Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook10, selectedChapter10, confirmedVerses10, bibleId]);

  //////////////EDIT PROCESSIONAL PSALMS GOSPEL2 VERSE////////////////
  useEffect(() => {
    if (editSelectedBook10) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook10}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters10(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook10, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter10) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter10}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses10(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter10, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook10 &&
      editSelectedChapter10 &&
      editConfirmedVerses10.length > 0
    ) {
      setEditProcessionPalmsGospel2Verse(
        formatVerseRange(editConfirmedVerses10)
      );
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses10.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditProcessionPalmsGospel2Text(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook10,
    editSelectedChapter10,
    editConfirmedVerses10,
    editBibleId,
  ]);

  /////////////RESPONSIAL PSALM VERSE///////////////////
  useEffect(() => {
    if (selectedBook11) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook11}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters11(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook11, bibleId]);

  useEffect(() => {
    if (selectedChapter11) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter11}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses11(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter11, bibleId]);

  useEffect(() => {
    if (selectedBook11 && selectedChapter11 && confirmedVerses11.length > 0) {
      setResponsorialPsalmVerse(formatVerseRange(confirmedVerses11));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses11.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setResponsorialPsalmRespond(extractedText);
          setResponsorialPsalmText1(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook11, selectedChapter11, confirmedVerses11, bibleId]);

  /////////////EDIT RESPONSIAL PSALM VERSE///////////////////
  useEffect(() => {
    if (editSelectedBook11) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook11}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters11(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook11, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter11) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter11}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses11(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter11, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook11 &&
      editSelectedChapter11 &&
      editConfirmedVerses11.length > 0
    ) {
      setEditResponsorialPsalmVerse(formatVerseRange(editConfirmedVerses11));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses11.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditResponsorialPsalmRespond(extractedText);
          setEditResponsorialPsalmText1(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook11,
    editSelectedChapter11,
    editConfirmedVerses11,
    editBibleId,
  ]);

  ////////////RESPONSIAL PSALM VERSE OPT2////////////////
  useEffect(() => {
    if (selectedBook12) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook12}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters12(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook12, bibleId]);

  useEffect(() => {
    if (selectedChapter12) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter12}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses12(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter12, bibleId]);

  useEffect(() => {
    if (selectedBook12 && selectedChapter12 && confirmedVerses12.length > 0) {
      setResponsorialPsalmVerseOPT2(formatVerseRange(confirmedVerses12));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses12.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setResponsorialPsalmText1OPT2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook12, selectedChapter12, confirmedVerses12, bibleId]);

  ////////////RESPONSIAL PSALM VERSE OPT2////////////////
  useEffect(() => {
    if (editSelectedBook12) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook12}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters12(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook12, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter12) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter12}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses12(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter12, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook12 &&
      editSelectedChapter12 &&
      editConfirmedVerses12.length > 0
    ) {
      setEditResponsorialPsalmVerseOPT2(
        formatVerseRange(editConfirmedVerses12)
      );
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses12.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditResponsorialPsalmText1OPT2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook12,
    editSelectedChapter12,
    editConfirmedVerses12,
    editBibleId,
  ]);

  /////////////////VERSE B4 GOSPEL OPT2////////////////
  useEffect(() => {
    if (selectedBook13) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook13}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters13(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook13, bibleId]);

  useEffect(() => {
    if (selectedChapter13) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter13}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses13(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter13, bibleId]);

  useEffect(() => {
    if (selectedBook13 && selectedChapter13 && confirmedVerses13.length > 0) {
      setVerseb4GospelOPT2(formatVerseRange(confirmedVerses13));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses13.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setB4GospelTextOPT2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook13, selectedChapter13, confirmedVerses13, bibleId]);

  /////////////////EDIT VERSE B4 GOSPEL OPT2////////////////
  useEffect(() => {
    if (editSelectedBook13) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook13}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters13(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook13, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter13) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter13}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses13(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter13, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook13 &&
      editSelectedChapter13 &&
      editConfirmedVerses13.length > 0
    ) {
      setEditVerseb4GospelOPT2(formatVerseRange(editConfirmedVerses13));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses13.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditB4GospelTextOPT2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook13,
    editSelectedChapter13,
    editConfirmedVerses13,
    editBibleId,
  ]);

  ////////////////ALLELULIA VERSE///////////////////////////
  useEffect(() => {
    if (selectedBook14) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook14}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters14(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook14, bibleId]);

  useEffect(() => {
    if (selectedChapter14) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter14}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses14(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter14, bibleId]);

  useEffect(() => {
    if (selectedBook14 && selectedChapter14 && confirmedVerses14.length > 0) {
      setAlleluiaVerse(formatVerseRange(confirmedVerses14));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses14.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setAlleluiaText(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook14, selectedChapter14, confirmedVerses14, bibleId]);

  ////////////////EDIT ALLELULIA VERSE///////////////////////////
  useEffect(() => {
    if (editSelectedBook14) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook14}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters14(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook14, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter14) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter14}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses14(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter14, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook14 &&
      editSelectedChapter14 &&
      editConfirmedVerses14.length > 0
    ) {
      setEditAlleluiaVerse(formatVerseRange(editConfirmedVerses14));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses14.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditAlleluiaText(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook14,
    editSelectedChapter14,
    editConfirmedVerses14,
    editBibleId,
  ]);

  //////////////////GOSPEL VERSE//////////////////////////
  useEffect(() => {
    if (selectedBook15) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook15}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters15(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook15, bibleId]);

  useEffect(() => {
    if (selectedChapter15) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter15}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses15(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter15, bibleId]);

  useEffect(() => {
    if (selectedBook15 && selectedChapter15 && confirmedVerses15.length > 0) {
      setGospelVerse(formatVerseRange(confirmedVerses15));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses15.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setGospelText(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook15, selectedChapter15, confirmedVerses15, bibleId]);

  //////////////////GOSPEL VERSE//////////////////////////
  useEffect(() => {
    if (editSelectedBook15) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook15}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters15(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook15, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter15) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter15}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses15(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter15, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook15 &&
      editSelectedChapter15 &&
      editConfirmedVerses15.length > 0
    ) {
      setEditGospelVerse(formatVerseRange(editConfirmedVerses15));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses15.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditGospelText(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook15,
    editSelectedChapter15,
    editConfirmedVerses15,
    editBibleId,
  ]);

  /////////////////////////GOSPEL VERSE 2//////////////////
  useEffect(() => {
    if (selectedBook16) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/books/${selectedBook16}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setChapters16(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook16, bibleId]);

  useEffect(() => {
    if (selectedChapter16) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${selectedChapter16}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setVerses16(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter16, bibleId]);

  useEffect(() => {
    if (selectedBook16 && selectedChapter16 && confirmedVerses16.length > 0) {
      setGospelVerse2(formatVerseRange(confirmedVerses16));
      const fetchData = async () => {
        try {
          const promises = confirmedVerses16.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setGospelTextOption2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [selectedBook16, selectedChapter16, confirmedVerses16, bibleId]);

  /////////////////////////EDIT GOSPEL VERSE 2//////////////////
  useEffect(() => {
    if (editSelectedBook16) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/books/${editSelectedBook16}/chapters`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditChapters16(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [editSelectedBook16, editBibleId]);

  useEffect(() => {
    if (editSelectedChapter16) {
      axios
        .get(
          `https://api.scripture.api.bible/v1/bibles/${editBibleId}/chapters/${editSelectedChapter16}/verses`,
          {
            headers: { "api-key": apiKey },
          }
        )
        .then((response) => {
          setEditVerses16(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [editSelectedChapter16, editBibleId]);

  useEffect(() => {
    if (
      editSelectedBook16 &&
      editSelectedChapter16 &&
      editConfirmedVerses16.length > 0
    ) {
      setEditGospelVerse2(formatVerseRange(editConfirmedVerses16));
      const fetchData = async () => {
        try {
          const promises = editConfirmedVerses16.map((verseId) =>
            axios.get(
              `https://api.scripture.api.bible/v1/bibles/${editBibleId}/verses/${verseId}?content-type=json`,
              {
                headers: { "api-key": apiKey },
              }
            )
          );
          const responses = await Promise.all(promises);
          const contents = responses.map(
            (response) => response.data.data.content
          );

          let extractedText = "";
          const extractText = (items) => {
            items.forEach((item) => {
              if (item.type === "text" && isNaN(item.text.trim())) {
                extractedText += item.text;
              } else if (item.items && item.items.length > 0) {
                extractText(item.items);
              }
            });
          };

          contents.forEach((content) => extractText(content));

          setEditGospelTextOption2(extractedText);
        } catch (error) {
          console.error("Error fetching verse text:", error);
        }
      };
      fetchData();
    }
  }, [
    editSelectedBook16,
    editSelectedChapter16,
    editConfirmedVerses16,
    editBibleId,
  ]);

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

                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-dialog-select-label"
                        style={{ marginTop: "18px" }}
                      >
                        Select a bible version
                      </InputLabel>
                      <Select
                        labelId="demo-dialog-select-label"
                        id="demo-dialog-select"
                        value={bibleId}
                        onChange={handleBibleId}
                        input={<OutlinedInput label="Select a bible version" />}
                        fullWidth
                        style={{ marginTop: "20px" }}
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
                      >
                        <MenuItem value={"de4e12af7f28f599-02"}>
                          King James (Authorised) Version
                        </MenuItem>
                        <MenuItem value={"40072c4a5aba4022-01"}>
                          Revised Version 1885
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {bibleId && (
                      <>
                        {/********************* READING 1 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook}
                              onChange={(e) => {
                                setSelectedBook(e.target.value);
                                setSelectedChapter(""); // Reset chapter and verse when book changes
                                setSelectedVerse([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter}
                              onChange={(e) => {
                                setSelectedChapter(e.target.value);
                                setSelectedVerse([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse}
                              onChange={(e) => setSelectedVerse(e.target.value)}
                              label="Verse"
                              disabled={!selectedChapter} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses
                                .filter(
                                  (verse) => verse.chapterId === selectedChapter
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 1 OPTION 2 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook2}
                              onChange={(e) => {
                                setSelectedBook2(e.target.value);
                                setSelectedChapter2(""); // Reset chapter and verse when book changes
                                setSelectedVerse2([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter2}
                              onChange={(e) => {
                                setSelectedChapter2(e.target.value);
                                setSelectedVerse2([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook2} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters2
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook2
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse2}
                              onChange={(e) =>
                                setSelectedVerse2(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter2} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses2
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter2
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 2 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook3}
                              onChange={(e) => {
                                setSelectedBook3(e.target.value);
                                setSelectedChapter3(""); // Reset chapter and verse when book changes
                                setSelectedVerse3([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter3}
                              onChange={(e) => {
                                setSelectedChapter3(e.target.value);
                                setSelectedVerse3([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook3} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters3
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook3
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse3}
                              onChange={(e) =>
                                setSelectedVerse3(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter3} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses3
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter3
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 2 OPTION 1 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook9}
                              onChange={(e) => {
                                setSelectedBook9(e.target.value);
                                setSelectedChapter9(""); // Reset chapter and verse when book changes
                                setSelectedVerse9([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter9}
                              onChange={(e) => {
                                setSelectedChapter9(e.target.value);
                                setSelectedVerse9([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook9} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters9
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook9
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse9}
                              onChange={(e) =>
                                setSelectedVerse9(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter9} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses9
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter9
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 3 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook4}
                              onChange={(e) => {
                                setSelectedBook4(e.target.value);
                                setSelectedChapter4(""); // Reset chapter and verse when book changes
                                setSelectedVerse4([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter4}
                              onChange={(e) => {
                                setSelectedChapter4(e.target.value);
                                setSelectedVerse4([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook4} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters4
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook4
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse4}
                              onChange={(e) =>
                                setSelectedVerse4(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter4} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses4
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter4
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 4 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook5}
                              onChange={(e) => {
                                setSelectedBook5(e.target.value);
                                setSelectedChapter5(""); // Reset chapter and verse when book changes
                                setSelectedVerse5([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter5}
                              onChange={(e) => {
                                setSelectedChapter5(e.target.value);
                                setSelectedVerse5([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook5} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters5
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook5
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse5}
                              onChange={(e) =>
                                setSelectedVerse5(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter5} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses5
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter5
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 5 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook6}
                              onChange={(e) => {
                                setSelectedBook6(e.target.value);
                                setSelectedChapter6(""); // Reset chapter and verse when book changes
                                setSelectedVerse6([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter6}
                              onChange={(e) => {
                                setSelectedChapter6(e.target.value);
                                setSelectedVerse6([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook6} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters6
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook6
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse6}
                              onChange={(e) =>
                                setSelectedVerse6(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter6} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses6
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter6
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 6 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook7}
                              onChange={(e) => {
                                setSelectedBook7(e.target.value);
                                setSelectedChapter7(""); // Reset chapter and verse when book changes
                                setSelectedVerse7([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter7}
                              onChange={(e) => {
                                setSelectedChapter7(e.target.value);
                                setSelectedVerse7([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook7} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters7
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook7
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse7}
                              onChange={(e) =>
                                setSelectedVerse7(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter7} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses7
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter7
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                        {/********************* READING 7 VERSE ********************/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook8}
                              onChange={(e) => {
                                setSelectedBook8(e.target.value);
                                setSelectedChapter8(""); // Reset chapter and verse when book changes
                                setSelectedVerse8([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter8}
                              onChange={(e) => {
                                setSelectedChapter8(e.target.value);
                                setSelectedVerse8([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook8} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters8
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook8
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse8}
                              onChange={(e) =>
                                setSelectedVerse8(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter8} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses8
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter8
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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

                        {/* START FROM HERE  */}
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

                        {/*PROCESSIONAL PSALMS GOSPEL2 VERSE*/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook10}
                              onChange={(e) => {
                                setSelectedBook10(e.target.value);
                                setSelectedChapter10(""); // Reset chapter and verse when book changes
                                setSelectedVerse10([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter10}
                              onChange={(e) => {
                                setSelectedChapter10(e.target.value);
                                setSelectedVerse10([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook10} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters10
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook10
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse10}
                              onChange={(e) =>
                                setSelectedVerse10(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter10} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses10
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter10
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
                        <TextField
                          fullWidth
                          label="Procession Psalms Gospel2 Verse"
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
                        {processionPalmsGospel2Verse && (
                          <TextField
                            fullWidth
                            label="Procession Psalms Gospel2 Text"
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
                        )}

                        {/*RESPONSIAL PSALM VERSE*/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook11}
                              onChange={(e) => {
                                setSelectedBook11(e.target.value);
                                setSelectedChapter11(""); // Reset chapter and verse when book changes
                                setSelectedVerse11([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter11}
                              onChange={(e) => {
                                setSelectedChapter11(e.target.value);
                                setSelectedVerse11([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook11} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters11
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook11
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse11}
                              onChange={(e) =>
                                setSelectedVerse11(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter11} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses11
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter11
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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

                        {/*RESPONSIAL PSALM VERSE OPT2*/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook12}
                              onChange={(e) => {
                                setSelectedBook12(e.target.value);
                                setSelectedChapter12(""); // Reset chapter and verse when book changes
                                setSelectedVerse12([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter12}
                              onChange={(e) => {
                                setSelectedChapter12(e.target.value);
                                setSelectedVerse12([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook12} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters12
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook12
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse12}
                              onChange={(e) =>
                                setSelectedVerse12(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter12} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses12
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter12
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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

                        {/*VERSE B4 GOSPEL OPT2*/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook13}
                              onChange={(e) => {
                                setSelectedBook13(e.target.value);
                                setSelectedChapter13(""); // Reset chapter and verse when book changes
                                setSelectedVerse13([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter13}
                              onChange={(e) => {
                                setSelectedChapter13(e.target.value);
                                setSelectedVerse13([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook13} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters13
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook13
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse13}
                              onChange={(e) =>
                                setSelectedVerse13(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter13} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses13
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter13
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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

                        {/* ALLELULIA VERSE*/}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook14}
                              onChange={(e) => {
                                setSelectedBook14(e.target.value);
                                setSelectedChapter14(""); // Reset chapter and verse when book changes
                                setSelectedVerse14([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter14}
                              onChange={(e) => {
                                setSelectedChapter14(e.target.value);
                                setSelectedVerse14([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook14} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters14
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook14
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse14}
                              onChange={(e) =>
                                setSelectedVerse14(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter14} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses14
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter14
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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

                        {/*       GOSPEL VERSE        */}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook15}
                              onChange={(e) => {
                                setSelectedBook15(e.target.value);
                                setSelectedChapter15(""); // Reset chapter and verse when book changes
                                setSelectedVerse15([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter15}
                              onChange={(e) => {
                                setSelectedChapter15(e.target.value);
                                setSelectedVerse15([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook15} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters15
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook15
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse15}
                              onChange={(e) =>
                                setSelectedVerse15(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter15} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses15
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter15
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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

                        {/*      GOSPEL VERSE 2       */}
                        <Box
                          display="flex"
                          width="100%"
                          sx={{ marginTop: "10px" }}
                        >
                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="book-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Book
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="book-select-label"
                              value={selectedBook16}
                              onChange={(e) => {
                                setSelectedBook16(e.target.value);
                                setSelectedChapter16(""); // Reset chapter and verse when book changes
                                setSelectedVerse16([]);
                              }}
                              label="Book"
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                  {book.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl
                            variant="outlined"
                            style={{ flex: 1, marginRight: "8px" }}
                          >
                            <InputLabel
                              id="chapter-select-label"
                              sx={{ lineHeight: "15px" }}
                            >
                              Chapter
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="chapter-select-label"
                              value={selectedChapter16}
                              onChange={(e) => {
                                setSelectedChapter16(e.target.value);
                                setSelectedVerse16([]); // Reset verse when chapter changes
                              }}
                              label="Chapter"
                              disabled={!selectedBook16} // Disable if no book is selected
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {chapters16
                                .filter(
                                  (chapter) => chapter.bookId === selectedBook16
                                )
                                .map((chapter) => (
                                  <MenuItem key={chapter.id} value={chapter.id}>
                                    {chapter.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl variant="outlined" style={{ flex: 1 }}>
                            <InputLabel
                              sx={{ lineHeight: "15px" }}
                              id="verse-select-label"
                            >
                              Verse
                            </InputLabel>
                            <Select
                              fullWidth
                              labelId="verse-select-label"
                              multiple
                              value={selectedVerse16}
                              onChange={(e) =>
                                setSelectedVerse16(e.target.value)
                              }
                              label="Verse"
                              disabled={!selectedChapter16} // Disable if no chapter is selected
                              renderValue={(selected) => selected.join(", ")}
                              sx={{
                                height: "40px",
                                "& .MuiOutlinedInput-root": {
                                  height: "40px",
                                },
                                "& .MuiInputLabel-root": {
                                  lineHeight: "8px",
                                  fontSize: "smaller",
                                },
                              }}
                            >
                              {verses16
                                .filter(
                                  (verse) =>
                                    verse.chapterId === selectedChapter16
                                )
                                .map((verse) => (
                                  <MenuItem key={verse.id} value={verse.id}>
                                    {verse.reference}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleFetchVerses}
                          sx={{ marginTop: "10px" }}
                        >
                          OK
                        </Button>
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
                      </>
                    )}
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

                      <FormControl fullWidth>
                        <InputLabel
                          id="demo-dialog-select-label"
                          style={{ marginTop: "18px" }}
                        >
                          Select a bible version
                        </InputLabel>
                        <Select
                          labelId="demo-dialog-select-label"
                          id="demo-dialog-select"
                          value={editBibleId}
                          onChange={handleEditBibleId}
                          input={
                            <OutlinedInput label="Select a bible version" />
                          }
                          fullWidth
                          style={{ marginTop: "20px" }}
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
                        >
                          <MenuItem value={"de4e12af7f28f599-02"}>
                            King James (Authorised) Version
                          </MenuItem>
                          <MenuItem value={"40072c4a5aba4022-01"}>
                            Revised Version 1885
                          </MenuItem>
                        </Select>
                      </FormControl>

                      {editBibleId && (
                        <>
                          {/********************* READING 1 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook}
                                onChange={(e) => {
                                  setEditSelectedBook(e.target.value);
                                  setEditSelectedChapter(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter}
                                onChange={(e) => {
                                  setEditSelectedChapter(e.target.value);
                                  setEditSelectedVerse([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse}
                                onChange={(e) =>
                                  setEditSelectedVerse(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 1 OPTION 2 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook2}
                                onChange={(e) => {
                                  setEditSelectedBook2(e.target.value);
                                  setEditSelectedChapter2(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse2([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter2}
                                onChange={(e) => {
                                  setEditSelectedChapter2(e.target.value);
                                  setEditSelectedVerse2([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook2} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters2
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook2
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse2}
                                onChange={(e) =>
                                  setEditSelectedVerse2(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter2} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses2
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter2
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 2 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook3}
                                onChange={(e) => {
                                  setEditSelectedBook3(e.target.value);
                                  setEditSelectedChapter3(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse3([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter3}
                                onChange={(e) => {
                                  setEditSelectedChapter3(e.target.value);
                                  setEditSelectedVerse3([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook3} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters3
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook3
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse3}
                                onChange={(e) =>
                                  setEditSelectedVerse3(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter3} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses3
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter3
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 2 OPTION 1 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook9}
                                onChange={(e) => {
                                  setEditSelectedBook9(e.target.value);
                                  setEditSelectedChapter9(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse9([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter9}
                                onChange={(e) => {
                                  setEditSelectedChapter9(e.target.value);
                                  setEditSelectedVerse9([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook9} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters9
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook9
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse9}
                                onChange={(e) =>
                                  setEditSelectedVerse9(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter9} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses9
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter9
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 3 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook4}
                                onChange={(e) => {
                                  setEditSelectedBook4(e.target.value);
                                  setEditSelectedChapter4(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse4([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter4}
                                onChange={(e) => {
                                  setEditSelectedChapter4(e.target.value);
                                  setEditSelectedVerse4([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook4} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters4
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook4
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse4}
                                onChange={(e) =>
                                  setEditSelectedVerse4(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter4} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses4
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter4
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 4 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook5}
                                onChange={(e) => {
                                  setEditSelectedBook5(e.target.value);
                                  setEditSelectedChapter5(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse5([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter5}
                                onChange={(e) => {
                                  setEditSelectedChapter5(e.target.value);
                                  setEditSelectedVerse5([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook5} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters5
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook5
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse5}
                                onChange={(e) =>
                                  setEditSelectedVerse5(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter5} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses5
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter5
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 5 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook6}
                                onChange={(e) => {
                                  setEditSelectedBook6(e.target.value);
                                  setEditSelectedChapter6(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse6([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter6}
                                onChange={(e) => {
                                  setEditSelectedChapter6(e.target.value);
                                  setEditSelectedVerse6([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook6} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters6
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook6
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse6}
                                onChange={(e) =>
                                  setEditSelectedVerse6(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter6} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses6
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter6
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 6 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook7}
                                onChange={(e) => {
                                  setEditSelectedBook7(e.target.value);
                                  setEditSelectedChapter7(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse7([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter7}
                                onChange={(e) => {
                                  setEditSelectedChapter7(e.target.value);
                                  setEditSelectedVerse7([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook7} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters7
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook7
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse7}
                                onChange={(e) =>
                                  setEditSelectedVerse7(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter7} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses7
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter7
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                          {/********************* READING 7 VERSE ********************/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook8}
                                onChange={(e) => {
                                  setEditSelectedBook8(e.target.value);
                                  setEditSelectedChapter8(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse8([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter8}
                                onChange={(e) => {
                                  setEditSelectedChapter8(e.target.value);
                                  setEditSelectedVerse8([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook8} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters8
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook8
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse8}
                                onChange={(e) =>
                                  setEditSelectedVerse8(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter8} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses8
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter8
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/* START FROM HERE  */}
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

                          {/*PROCESSIONAL PSALMS GOSPEL2 VERSE*/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook10}
                                onChange={(e) => {
                                  setEditSelectedBook10(e.target.value);
                                  setEditSelectedChapter10(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse10([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter10}
                                onChange={(e) => {
                                  setEditSelectedChapter10(e.target.value);
                                  setEditSelectedVerse10([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook10} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters10
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook10
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse10}
                                onChange={(e) =>
                                  setEditSelectedVerse10(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter10} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses10
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter10
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/*RESPONSIAL PSALM VERSE*/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook11}
                                onChange={(e) => {
                                  setEditSelectedBook11(e.target.value);
                                  setEditSelectedChapter11(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse11([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter11}
                                onChange={(e) => {
                                  setEditSelectedChapter11(e.target.value);
                                  setEditSelectedVerse11([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook11} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters11
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook11
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse11}
                                onChange={(e) =>
                                  setEditSelectedVerse11(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter11} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses11
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter11
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/*RESPONSIAL PSALM VERSE OPT2*/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook12}
                                onChange={(e) => {
                                  setEditSelectedBook12(e.target.value);
                                  setEditSelectedChapter12(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse12([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter12}
                                onChange={(e) => {
                                  setEditSelectedChapter12(e.target.value);
                                  setEditSelectedVerse12([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook12} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters12
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook12
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse12}
                                onChange={(e) =>
                                  setEditSelectedVerse12(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter12} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses12
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter12
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/*VERSE B4 GOSPEL OPT2*/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook13}
                                onChange={(e) => {
                                  setEditSelectedBook13(e.target.value);
                                  setEditSelectedChapter13(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse13([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter13}
                                onChange={(e) => {
                                  setEditSelectedChapter13(e.target.value);
                                  setEditSelectedVerse13([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook13} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters13
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook13
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse13}
                                onChange={(e) =>
                                  setEditSelectedVerse13(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter13} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses13
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter13
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/* ALLELULIA VERSE*/}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook14}
                                onChange={(e) => {
                                  setEditSelectedBook14(e.target.value);
                                  setEditSelectedChapter14(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse14([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter14}
                                onChange={(e) => {
                                  setEditSelectedChapter14(e.target.value);
                                  setEditSelectedVerse14([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook14} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters14
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook14
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse14}
                                onChange={(e) =>
                                  setEditSelectedVerse14(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter14} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses14
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter14
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/*       GOSPEL VERSE        */}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook15}
                                onChange={(e) => {
                                  setEditSelectedBook15(e.target.value);
                                  setEditSelectedChapter15(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse15([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter15}
                                onChange={(e) => {
                                  setEditSelectedChapter15(e.target.value);
                                  setEditSelectedVerse15([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook15} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters15
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook15
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse15}
                                onChange={(e) =>
                                  setEditSelectedVerse15(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter15} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses15
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter15
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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

                          {/*      GOSPEL VERSE 2       */}
                          <Box
                            display="flex"
                            width="100%"
                            sx={{ marginTop: "10px" }}
                          >
                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="book-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Book
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="book-select-label"
                                value={editSelectedBook16}
                                onChange={(e) => {
                                  setEditSelectedBook16(e.target.value);
                                  setEditSelectedChapter16(""); // Reset chapter and verse when book changes
                                  setEditSelectedVerse16([]);
                                }}
                                label="Book"
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editBooks.map((book) => (
                                  <MenuItem key={book.id} value={book.id}>
                                    {book.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            <FormControl
                              variant="outlined"
                              style={{ flex: 1, marginRight: "8px" }}
                            >
                              <InputLabel
                                id="chapter-select-label"
                                sx={{ lineHeight: "15px" }}
                              >
                                Chapter
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="chapter-select-label"
                                value={editSelectedChapter16}
                                onChange={(e) => {
                                  setEditSelectedChapter16(e.target.value);
                                  setEditSelectedVerse16([]); // Reset verse when chapter changes
                                }}
                                label="Chapter"
                                disabled={!editSelectedBook16} // Disable if no book is selected
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editChapters16
                                  .filter(
                                    (chapter) =>
                                      chapter.bookId === editSelectedBook16
                                  )
                                  .map((chapter) => (
                                    <MenuItem
                                      key={chapter.id}
                                      value={chapter.id}
                                    >
                                      {chapter.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            <FormControl variant="outlined" style={{ flex: 1 }}>
                              <InputLabel
                                sx={{ lineHeight: "15px" }}
                                id="verse-select-label"
                              >
                                Verse
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="verse-select-label"
                                multiple
                                value={editSelectedVerse16}
                                onChange={(e) =>
                                  setEditSelectedVerse16(e.target.value)
                                }
                                label="Verse"
                                disabled={!editSelectedChapter16} // Disable if no chapter is selected
                                renderValue={(selected) => selected.join(", ")}
                                sx={{
                                  height: "40px",
                                  "& .MuiOutlinedInput-root": {
                                    height: "40px",
                                  },
                                  "& .MuiInputLabel-root": {
                                    lineHeight: "8px",
                                    fontSize: "smaller",
                                  },
                                }}
                              >
                                {editVerses16
                                  .filter(
                                    (verse) =>
                                      verse.chapterId === editSelectedChapter16
                                  )
                                  .map((verse) => (
                                    <MenuItem key={verse.id} value={verse.id}>
                                      {verse.reference}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditFetchVerses}
                            sx={{ marginTop: "10px" }}
                          >
                            OK
                          </Button>
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
                        </>
                      )}
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
