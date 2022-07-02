import React from "react";
import { Button } from "@mui/material";
import styles from "./index.module.css";
import { shortenedWithEllipses } from "../../utils/strings";

export default function Header({
  onClick,
  connectedWalletAddress,
}: {
  onClick: () => {};
  connectedWalletAddress?: string;
}) {
  return (
    <div className={styles.container}>
      <span className={styles.title}>Anonymous Coordinape</span>
      {connectedWalletAddress ? (
        <span>
          Connected wallet: {shortenedWithEllipses(connectedWalletAddress)}
        </span>
      ) : (
        <Button onClick={onClick}>Connect MetaMask</Button>
      )}
    </div>
  );
}
