import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography>
        © {currentYear} <Link href="https://api.vigoplace.com">Vigoplace</Link>{" "}
      </Typography>
    </Box>
  );
};

export default Footer;
