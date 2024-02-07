import React, { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import FeatherIcon from "feather-icons-react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";

//const API_BASE_URL = "http://localhost:4000";
const API_BASE_URL = "https://vigoplace.com/server";

const Users = () => {
  const [tabValue, setTabValue] = useState(0);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const getUser = useSession();
  const user = getUser?.data?.user;
  const [data, setData] = useState({
    followerCount: [],
    postCount: [],
    commentCount: [],
    commentLikeCount: [],
    postLikeCount: [],
    postViewCount: [],
  });
  const [count, setCount] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [paginationActive, setPaginationActive] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [paginationInactive, setPaginationInactive] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [paginationBlocked, setPaginationBlocked] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const stateMapping = {
    0: {
      state: mostActiveUsers,
      setter: setMostActiveUsers,
      key: "activityRanking",
    },
    1: { state: inactiveUsers, setter: setInactiveUsers, key: "inactivity" },
    2: { state: blockedUsers, setter: setBlockedUsers, key: "blocked" },
  };

  const fetchData = async (tabIndex) => {
    setIsFetching(true);
    setIsLoading(true);

    let apiEndpoint = "";
    let paginationState;
    let countSetter = (data) => data?.data?.count ?? 0;

    switch (tabIndex) {
      case 0:
        apiEndpoint = "user-stats";
        countSetter = (data) => data?.data?.count ?? 0;
        paginationState = paginationActive;
        break;
      case 1:
        apiEndpoint = "inactive-user-stats";
        countSetter = (data) => data?.data?.count ?? 0;
        paginationState = paginationInactive;
        break;
      case 2:
        apiEndpoint = "blocked-user-stats";
        countSetter = (data) => data?.data?.count ?? 0;
        paginationState = paginationBlocked;
        break;
      default:
        break;
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/admin/console/${apiEndpoint}?perPage=${paginationState.pageSize}&page=${paginationState.pageIndex}&search=${globalFilter}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      console.log(data);
      setData({
        followerCount: data?.data?.followerCount || [],
        postCount: data?.data?.postCount || [],
        commentCount: data?.data?.commentCount || [],
        commentLikeCount: data?.data?.commentLikeCount || [],
        postLikeCount: data?.data?.postLikeCount || [],
        postViewCount: data?.data?.postViewCount || [],
      });

      const stateInfo = stateMapping[tabIndex];

      if (stateInfo) {
        const stateData = data?.data?.[stateInfo.key] || [];
        stateInfo.setter(stateData);
      }

      setCount(countSetter(data));
    } catch (err) {
      setIsError(true);
      console.error(err, `Error fetching ${apiEndpoint} statistics`);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData(tabValue);
  }, [
    tabValue,
    paginationActive,
    paginationInactive,
    paginationBlocked,
    globalFilter,
  ]);

  const getPaginationState = () => {
    switch (tabValue) {
      case 0:
        return paginationActive;
      case 1:
        return paginationInactive;
      case 2:
        return paginationBlocked;
      default:
        return paginationActive;
    }
  };

  const handlePageChange = (tabIndex, newPage) => {
    switch (tabIndex) {
      case 0:
        setPaginationActive({ ...paginationActive, pageIndex: newPage });
        break;
      case 1:
        setPaginationInactive({ ...paginationInactive, pageIndex: newPage });
        break;
      case 2:
        setPaginationBlocked({ ...paginationBlocked, pageIndex: newPage });
        break;
      default:
        break;
    }
  };

  const handleRowsPerPageChange = (tabIndex, pageSize) => {
    switch (tabIndex) {
      case 0:
        setPaginationActive({
          ...paginationActive,
          pageSize: parseInt(pageSize, 10),
        });
        break;
      case 1:
        setPaginationInactive({
          ...paginationInactive,
          pageSize: parseInt(pageSize, 10),
        });
        break;
      case 2:
        setPaginationBlocked({
          ...paginationBlocked,
          pageSize: parseInt(pageSize, 10),
        });
        break;
      default:
        break;
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "followerCount",
        label: "Follower Count",
      },
      {
        id: "postCount",
        label: "Post Count",
      },
      {
        id: "commentCount",
        label: "Comment Count",
      },
      {
        id: "commentLikeCount",
        label: "Comment Like Count",
      },
      {
        id: "postLikeCount",
        label: "Post Like Count",
      },
      {
        id: "postViewCount",
        label: "Post View Count",
      },
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      {
        id: "lastSeen",
        label: "Last Seen",
      },
      {
        id: "userId",
        label: "User",
      },
      {
        id: "followerCount",
        label: "Follower Count",
      },
      {
        id: "postCount",
        label: "Post Count",
      },
      {
        id: "commentCount",
        label: "Comment Count",
      },
      {
        id: "commentLikeCount",
        label: "Comment Like Count",
      },
      {
        id: "postLikeCount",
        label: "Post Like Count",
      },
      {
        id: "postViewCount",
        label: "Post View Count",
      },
    ],
    []
  );

  const followerCounts = data?.followerCount?.map((count) => {
    return {
      user: count.fullName,
    };
  });

  const followerCountss = data?.followerCount?.map((count) => {
    return {
      followerCount: count.followerCount,
    };
  });

  const followerCountsss = data?.followerCount?.map((count) => {
    return {
      lastSeen: count.lastSeen,
    };
  });

  const postCounts = data?.postCount?.map((count) => {
    return {
      user: count.fullName,
    };
  });

  const postCountss = data?.postCount?.map((count) => {
    return {
      postCount: count.postCount,
    };
  });

  const postCountsss = data?.postCount?.map((count) => {
    return {
      lastSeen: count.lastSeen,
    };
  });

  const commentCounts = data?.commentCount?.map((count) => {
    return {
      user: count.fullName,
    };
  });

  const commentCountss = data?.commentCount?.map((count) => {
    return {
      commentCount: count.commentCount,
    };
  });

  const commentCountsss = data?.commentCount?.map((count) => {
    return {
      lastSeen: count.lastSeen,
    };
  });

  const commentLikeCounts = data?.commentLikeCount?.map((count) => {
    return {
      user: count.fullName,
    };
  });

  const commentLikeCountss = data?.commentLikeCount?.map((count) => {
    return {
      commentLikeCount: count.totalCommentLikes,
    };
  });

  const commentLikeCountsss = data?.commentLikeCount?.map((count) => {
    return {
      lastSeen: count.lastSeen,
    };
  });

  const postLikeCounts = data?.postLikeCount?.map((count) => {
    return {
      user: count.fullName,
    };
  });

  const postLikeCountss = data?.postLikeCount?.map((count) => {
    return {
      postLikeCount: count.postLikeCount,
    };
  });

  const postLikeCountsss = data?.postLikeCount?.map((count) => {
    return {
      lastSeen: count.lastSeen,
    };
  });

  const postViewCounts = data?.postViewCount?.map((count) => {
    return {
      user: count.fullName,
    };
  });

  const postViewCountss = data?.postViewCount?.map((count) => ({
    postViewCount: count.totalViews !== null ? count.totalViews : 0,
  }));

  const postViewCountsss = data?.postViewCount?.map((count) => {
    return {
      lastSeen: count.lastSeen,
    };
  });

  //console.log(mostActiveUsers);
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={0}>
          <Grid item sm={12} xs={12} lg={12}>
            {/* Most Active Users Section */}
            <Typography
              variant="h4"
              color="text.primary"
              marginBottom={2}
              sx={{ fontWeight: "bold" }}
            >
              Most Active Users
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ width: "50%", marginBottom: 4 }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        fontWeight: "bold",
                        marginLeft: "10px",
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Activity Count
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Display the first 3 most active users */}
                  {mostActiveUsers.slice(0, 3).map((user, index) => (
                    <TableRow key={user.fullName}>
                      <TableCell
                        sx={{ borderRight: 1, borderColor: "divider" }}
                      >
                        <FeatherIcon
                          icon="award"
                          width="20"
                          height="20"
                          style={{
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                          color={
                            index === 0
                              ? "gold"
                              : index === 1
                              ? "silver"
                              : "brown"
                          }
                        />
                        {user.fullName}
                      </TableCell>
                      <TableCell>{user.totalActivityCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor="inherit"
                  centered
                  scrollButtons="auto"
                  aria-label=""
                >
                  <Tab label="Active Users" />
                  <Tab label="Inactive Users" />
                  <Tab label="Blocked Users" />
                </Tabs>
              </Box>

              {tabValue === 0 && (
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map((column, columnIndex) => (
                          <TableCell
                            key={column.id}
                            colSpan={3}
                            sx={{
                              fontWeight: "bold",
                              //borderBottom: "2px solid #4CAF50",
                              borderRight: "1px solid #000",
                              // borderRight:
                              //   columnIndex % 2 === 0
                              //     ? "1px solid #555"
                              //     : "1px solid #ddd", // Adjusted vertical line
                              textAlign: "center",
                            }}
                            align="center"
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          Last Seen
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #555",
                            fontSize: "0.75rem",
                          }}
                        >
                          Count
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          Last Seen
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #000",
                            fontSize: "0.75rem",
                          }}
                        >
                          Count
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          Last Seen
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #555",
                            fontSize: "0.75rem",
                          }}
                        >
                          Count
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          Last Seen
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #555",
                            fontSize: "0.75rem",
                          }}
                        >
                          Count
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          Last Seen
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #000",
                            fontSize: "0.75rem",
                          }}
                        >
                          Count
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          Last Seen
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            textAlign: "center",
                          }}
                        >
                          User
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            //borderRight: "1px solid #555",
                            fontSize: "0.75rem",
                          }}
                        >
                          Count
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {followerCountsss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.lastSeen &&
                                format(
                                  new Date(user.lastSeen),
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {followerCounts.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">{user.user}</TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderBottom: "1px solid #ddd",
                          borderRight: "1px solid #555",
                        }}
                      >
                        {followerCountss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.followerCount}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {postCountsss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.lastSeen &&
                                format(
                                  new Date(user.lastSeen),
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {postCounts.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">{user.user}</TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderBottom: "1px solid #ddd",
                          borderRight: "1px solid #555",
                        }}
                      >
                        {postCountss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.postCount}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {commentCountsss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.lastSeen &&
                                format(
                                  new Date(user.lastSeen),
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {commentCounts.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">{user.user}</TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderBottom: "1px solid #ddd",
                          borderRight: "1px solid #555",
                        }}
                      >
                        {commentCountss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.commentCount}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {commentLikeCountsss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.lastSeen &&
                                format(
                                  new Date(user.lastSeen),
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {commentLikeCounts.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">{user.user}</TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderBottom: "1px solid #ddd",
                          borderRight: "1px solid #555",
                        }}
                      >
                        {commentLikeCountss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.commentLikeCount}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {postLikeCountsss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.lastSeen &&
                                format(
                                  new Date(user.lastSeen),
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {postLikeCounts.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">{user.user}</TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderBottom: "1px solid #ddd",
                          borderRight: "1px solid #555",
                        }}
                      >
                        {postLikeCountss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.postLikeCount}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {postViewCountsss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.lastSeen &&
                                format(
                                  new Date(user.lastSeen),
                                  "MM/dd/yyyy HH:mm:ss"
                                )}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        {postViewCounts.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">{user.user}</TableCell>
                          </div>
                        ))}
                      </TableCell>

                      <TableCell
                        colSpan={1}
                        align="center"
                        sx={{
                          borderBottom: "1px solid #ddd",
                          //borderRight: "1px solid #555",
                        }}
                      >
                        {postViewCountss.map((user, index) => (
                          <div key={index}>
                            <TableCell height="80px">
                              {user.postViewCount}
                            </TableCell>
                          </div>
                        ))}
                      </TableCell>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tabValue === 1 && (
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      {columns2.map((column) => (
                        <TableCell
                          key={column.id}
                          colSpan={1}
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #ddd",
                            textAlign: "center",
                          }}
                          align="center"
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableHead>
                    <TableBody>
                      {inactiveUsers.map((user, index) => (
                        <TableRow key={user.userId}>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.lastSeen &&
                              format(
                                new Date(user.lastSeen),
                                "MM/dd/yyyy HH:mm:ss"
                              )}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.fullName}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.followerCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.postCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.commentCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.commentLikeCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.postLikeCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.postViewCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Show a message if there are no users in that category */}
              {tabValue === 2 && (
                <TableContainer component={Paper}>
                  <Table stickyHeader>
                    <TableHead>
                      {columns2.map((column) => (
                        <TableCell
                          key={column.id}
                          colSpan={1}
                          sx={{
                            fontWeight: "bold",
                            borderRight: "1px solid #ddd",
                            textAlign: "center",
                          }}
                          align="center"
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableHead>
                    <TableBody>
                      {blockedUsers.map((user, index) => (
                        <TableRow key={user.userId}>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.lastSeen &&
                              format(
                                new Date(user.lastSeen),
                                "MM/dd/yyyy HH:mm:ss"
                              )}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.fullName}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.followerCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.postCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.commentCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.commentLikeCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.postLikeCount}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {user.postViewCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={count}
                rowsPerPage={getPaginationState().pageSize}
                page={getPaginationState().pageIndex - 1}
                onPageChange={(event, newPage) =>
                  handlePageChange(tabValue, newPage + 1)
                }
                onRowsPerPageChange={(event) =>
                  handleRowsPerPageChange(tabValue, event.target.value)
                }
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Tooltip arrow title="Refresh Data">
                  <IconButton onClick={() => fetchData(tabValue)}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Box>
          </Grid>
        </Grid>

        <Typography
          align="center"
          marginTop={1}
          variant="h3"
          color="text.secondary"
        >
          <b>Users Statistics</b>
        </Typography>
      </Box>
    </>
  );
};

Users.auth = true;
export default Users;
