import React from "react";
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
