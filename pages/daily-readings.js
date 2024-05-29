import React from "react";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import { useSession } from "next-auth/react";
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

  const [dailyReadingToast, setDailyReadingToast] = React.useState({
    error: false,
    success: false,
  });

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

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleDate = (event) => {
    setDate(event.target.value);
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
    mutationKey: ["updatePin"],
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

  const handleClose = () => {
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
                            onChange={(e) => setSelectedVerse2(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter2
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
                            onChange={(e) => setSelectedVerse3(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter3
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
                            onChange={(e) => setSelectedVerse9(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter9
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
                            onChange={(e) => setSelectedVerse4(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter4
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
                            onChange={(e) => setSelectedVerse5(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter5
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
                            onChange={(e) => setSelectedVerse6(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter6
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
                            onChange={(e) => setSelectedVerse7(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter7
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
                            onChange={(e) => setSelectedVerse8(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter8
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
                            onChange={(e) => setSelectedVerse10(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter10
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
                            onChange={(e) => setSelectedVerse11(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter11
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
                            onChange={(e) => setSelectedVerse12(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter12
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
                            onChange={(e) => setSelectedVerse13(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter13
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
                            onChange={(e) => setSelectedVerse14(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter14
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
                            onChange={(e) => setSelectedVerse15(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter15
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
                            onChange={(e) => setSelectedVerse16(e.target.value)}
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
                                (verse) => verse.chapterId === selectedChapter16
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
                        verseBeforeGospel
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
    </>
  );
}

export default DailyReadings;
