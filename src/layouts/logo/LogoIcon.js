import React from "react";
import { Link } from "@mui/material";
import Image from "next/image";
import LogoDark from "../../../assets/images/logos/Darkvigo.svg";
import Logo from "../../../assets/images/backgrounds/Gradientvigo.svg";

const LogoIcon = () => {
  return (
    <Link href="/">
      <Image src={Logo} alt={Logo} />
    </Link>
  );
};

export default LogoIcon;
