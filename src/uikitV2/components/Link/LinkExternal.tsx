import React from "react";
import Link from "./Link";
import { LinkIcon } from "../Icon";
import { LinkProps } from "./types";

const LinkExternal: React.FC<LinkProps> = ({ children, color, ...props }) => {
  return (
    <Link external color={color} {...props}>
      {children}
      <LinkIcon color={color} style={{ marginLeft: "6px" }} />
    </Link>
  );
};

export default LinkExternal;
