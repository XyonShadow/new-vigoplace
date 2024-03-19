import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import ReceiptLogo from "../../../assets/images/backgrounds/logo_small.png";

const ReceiptLogoIcon = () => {
  return (
    <Link href="/">
       <Image src={ReceiptLogo} alt="Receipt Logo" />
    </Link>
  );
};

export default ReceiptLogoIcon;
