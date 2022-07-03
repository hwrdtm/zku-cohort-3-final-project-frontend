import React, { useEffect, useState } from "react";
import EpochManager from "../../contracts/EpochManager.json";
import { providers, Contract } from "ethers";
import { Container } from "@mui/material";
import { Epoch } from "models";
import { fetchEpoch } from "services/epochManager";
import EpochDetails from "components/EpochDetails";
import { isAddressAdminOfEpoch, isAddressMemberOfEpoch } from "utils/epoch";
import config, { getContractAddress } from "config";
import styles from "./index.module.css";

export default function EpochListings({
  connectedWalletAddress,
}: {
  connectedWalletAddress: string;
}) {
  const [relevantEpochs, setRelevantEpochs] = useState<Epoch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const provider = new providers.JsonRpcProvider(config.browserNodeUrl);
    const epochManagerContract = new Contract(
      getContractAddress(),
      EpochManager.abi,
      provider
    );

    setIsLoading(true);

    const getAllScheduledEpochsFilter =
      epochManagerContract.filters.EpochScheduled(null);

    epochManagerContract
      .queryFilter(getAllScheduledEpochsFilter)
      .then(async (epochScheduledEvents) => {
        // Determine all epoch admins who ever scheduled an Epoch.
        const allEpochAdmins: string[] = epochScheduledEvents
          .map((event) => {
            if (event.args) {
              return event.args[0];
            }
            return "";
          })
          // de-dupe
          .reduce((prev, curr) => {
            if (prev.indexOf(curr) === -1) {
              return [...prev, curr];
            }
            return prev;
          }, []);

        // For all these unique Epoch admins, get their latest Epoch status.
        const allEpochDetails = await Promise.all(
          allEpochAdmins.map((epochAdmin) => fetchEpoch(epochAdmin))
        );

        setIsLoading(false);

        // For each Epoch, determine if relevant to the connected wallet
        // or not - if wallet is either admin or user.
        const filteredEpochs: any = allEpochDetails.filter((epochDetails) => {
          if (!epochDetails) {
            return;
          }

          return (
            isAddressAdminOfEpoch(connectedWalletAddress, epochDetails) ||
            isAddressMemberOfEpoch(connectedWalletAddress, epochDetails)
          );
        });

        if (filteredEpochs.length > 0) {
          setRelevantEpochs(filteredEpochs);
        }
      });
  }, []); // HACK to avoid infinite loop

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      {relevantEpochs.length > 0 ? (
        <Container>
          {relevantEpochs.map((relevantEpoch, idx) => (
            <EpochDetails
              key={idx}
              epoch={relevantEpoch}
              connectedWalletAddress={connectedWalletAddress}
            />
          ))}
        </Container>
      ) : (
        <Empty />
      )}
    </div>
  );
}

function Loading() {
  return (
    <Container className={styles.loading}>
      Fetching any Epochs relevant to you...
    </Container>
  );
}

function Empty() {
  return (
    <Container className={styles.empty}>
      There are no Epochs relevant to you right now.
    </Container>
  );
}
