import { Button, Container, TextField } from "@mui/material";
import React, { useState } from "react";
import { Epoch } from "../../models";
import EpochDetails from "../EpochDetails";
import {
  fetchEpoch,
  scheduleNewEpoch,
  collectEpochReward,
} from "../../services/epochManager";
import ValidatingButton from "../ValidatingButton";
import { validateAddressInput } from "../../utils/validation";
import styles from "./index.module.css";
import RevealEpochFunction from "./RevealEpochFunction";
import CollectRewardFunction from "./CollectRewardFunction";
import ViewEpochDetailsFunction from "./ViewEpochDetailsFunction";
import ScheduleNewEpochFunction from "./ScheduleNewEpochFunction";

// TODO: implement functionality to updateEpochMembers
export default function AdminFunctions({
  connectedWalletAddress,
}: {
  connectedWalletAddress: string;
}) {
  return (
    <div>
      <ScheduleNewEpochFunction />
      <ViewEpochDetailsFunction
        connectedWalletAddress={connectedWalletAddress}
      />
      <RevealEpochFunction />
      <CollectRewardFunction />
    </div>
  );
}
