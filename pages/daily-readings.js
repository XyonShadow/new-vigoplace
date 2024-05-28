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

  const [bibleId, setBibleId] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [verses, setVerses] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState([]);
  const [confirmedVerses, setConfirmedVerses] = useState([]);

  const [dailyReadingToast, setDailyReadingToast] = React.useState({
    error: false,
    success: false,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [openModal2, setOpenModal2] = React.useState(false);

  //   const handlePassword = (event) => {
  //     setPassword({
  //       ...password,
  //       [event.target.name]: event.target.value,
  //     });
  //   };

  //   const handlePinChange = (event) => {
  //     setApproval({
  //       ...approval,
  //       [event.target.name]: event.target.value,
  //     });
  //   };
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
    setConfirmedVerses(selectedVerse);
  };

  const {
    data: latestBibleReading,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ["fetchSingleUser"],
    async () => {
      const { data } = await axios.get(
        `https://api.vigoplace.com/api/admin/console/daily-reading`,
        //`http://localhost:4000/admin/console/daily-reading`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      //console.log(data);
      return data;
    },
    {
      onError: (err) => {
        console.log(err, "err fetching latest bible reading");
      },
      enabled: !!user?.token,
    },
    { keepPreviousData: true }
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
      // "http://localhost:3001/api/admin/console/approvalpin",
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
      //setOpenModal(false);
    },
  });

  const apiKey = "1b403d7377c77b6554e9fb5b2f7dcf6b";

  useEffect(() => {
    axios
      .get(`https://api.scripture.api.bible/v1/bibles/${bibleId}/books`, {
        headers: { "api-key": apiKey },
      })
      .then((response) => {
        console.log(response);
        setBooks(response.data.data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [bibleId]);

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
          console.log(response);
          setChapters(response.data.data);
        })
        .catch((error) => console.error("Error fetching chapters:", error));
    }
  }, [selectedBook]);

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
          console.log(response);
          setVerses(response.data.data);
        })
        .catch((error) => console.error("Error fetching verses:", error));
    }
  }, [selectedChapter]);

  useEffect(() => {
    if (selectedBook && selectedChapter && confirmedVerses.length > 0) {
      console.log(confirmedVerses);
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
                      <TextField
                        fullWidth
                        label="Responsorial Psalm Verse"
                        margin="normal"
                        name="responsorialPsalmVerse"
                        onChange={handleResponsorialPsalmVerseOPT2}
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
                        onChange={handleResponsorialPsalmText1OPT2}
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
                      <TextField
                        fullWidth
                        label="Responsorial Psalm Text2"
                        margin="normal"
                        name="responsorialPsalmText2"
                        onChange={handleResponsorialPsalmText2OPT2}
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
                        onChange={handleResponsorialPsalmText3OPT2}
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
                        onChange={handleResponsorialPsalmText4OPT2}
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
                        onChange={handleResponsorialPsalmText5OPT2}
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
                      <TextField
                        fullWidth
                        label="Alleluia Text"
                        margin="normal"
                        name="alleluiaText"
                        onChange={handleAlleluiaText}
                        type="text"
                        value={alleluiaText}
                        variant="outlined"
                      />
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
                      dailyReadingMutation.mutate(
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
                      );
                      // setOpenModal2(true);
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
