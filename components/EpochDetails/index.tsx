import React from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Epoch } from "../../models";
import {
  getEpochState,
  isAddressAdminOfEpoch,
  isAddressMemberOfEpoch,
} from "../../utils/epoch";
import TokenAllocationInput from "../TokenAllocationInput";
import EpochState from "../EpochState";
import { utils } from "ethers";
import { getBlockchainCurrency } from "../../constants";
import styles from "./index.module.css";
import Paper from "@mui/material/Paper";
import { shortenedWithEllipses } from "utils/strings";

function EpochDetailsTextEntry({ children }: { children: any }) {
  return <div className={styles.textEntry}>{children}</div>;
}

export default function EpochDetails({
  epoch,
  connectedWalletAddress,
}: {
  epoch: Epoch;
  connectedWalletAddress?: string;
}) {
  const startsAtDate = new Date(parseInt(epoch.startsAt.toString()) * 1000);
  const durationSeconds = parseInt(epoch.epochDuration.toString());
  const endsAtDate = new Date(
    (parseInt(epoch.startsAt.toString()) + durationSeconds) * 1000
  );

  const isAddressMember = connectedWalletAddress
    ? isAddressMemberOfEpoch(connectedWalletAddress, epoch)
    : false;
  const isAddressAdmin = connectedWalletAddress
    ? isAddressAdminOfEpoch(connectedWalletAddress, epoch)
    : false;

  return (
    <Container className={styles.container}>
      <Container>
        <h2>Epoch Details</h2>
        <EpochDetailsTextEntry>
          <b>Admin Address</b>: {epoch.adminAddress}{" "}
          {!!connectedWalletAddress && isAddressAdmin ? "(you)" : ""}
        </EpochDetailsTextEntry>
        <EpochDetailsTextEntry>
          <b>Epoch State</b>: <EpochState epochState={getEpochState(epoch)} />
        </EpochDetailsTextEntry>
        <EpochDetailsTextEntry>
          <b>Reward Budget</b>:{" "}
          {utils.formatUnits(epoch.rewardBudget.toString(), "ether")}{" "}
          {getBlockchainCurrency()}
        </EpochDetailsTextEntry>
        <EpochDetailsTextEntry>
          <b>Starts At</b>: {startsAtDate.toISOString()}
        </EpochDetailsTextEntry>
        <EpochDetailsTextEntry>
          <b>Ends At</b>: {endsAtDate.toISOString()} (Duration:{" "}
          {epoch.epochDuration.toString()} seconds)
        </EpochDetailsTextEntry>
        <EpochDetailsTextEntry>
          <b>Dedicated Coordinator</b>: {epoch.dedicatedCoordinator}
        </EpochDetailsTextEntry>
        <EpochDetailsTextEntry>
          <b>Members</b>
        </EpochDetailsTextEntry>
        <TableContainer component={Paper}>
          <Table
            className={styles.table}
            sx={{ minWidth: 650 }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>Commitment</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Tokens Allocated To Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {epoch.members.map((memberAddress, idx) => (
                <TableRow
                  key={idx}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {memberAddress}{" "}
                    {!!connectedWalletAddress &&
                    connectedWalletAddress === memberAddress
                      ? "(you)"
                      : ""}
                  </TableCell>
                  <TableCell>
                    {shortenedWithEllipses(
                      epoch.tokenAllocationCommitments[idx]
                    )}
                  </TableCell>
                  <TableCell>
                    {epoch.tokenAllocationCommitmentsVerified[idx].toString()}
                  </TableCell>
                  <TableCell>
                    {epoch.revealedTokenAllocations[idx].toString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      {isAddressMember && (
        <Container>
          <h2>Member Actions</h2>
          <h4>Update Private Token Allocations</h4>
          <TokenAllocationInput
            epoch={epoch}
            connectedWalletAddress={connectedWalletAddress}
          />
        </Container>
      )}
    </Container>
  );
}
