import React, { useEffect, useState } from "react";
import EpochManager from "../../contracts/EpochManager.json";
import { providers, Contract } from "ethers";
import { Container } from "@mui/material";
import { Epoch } from "models";
import { fetchEpoch } from "services/epochManager";
import EpochDetails from "components/EpochDetails";
import { isAddressAdminOfEpoch, isAddressMemberOfEpoch } from "utils/epoch";
import config, { getContractAddress } from "config";

export default function EpochListings({
  connectedWalletAddress,
}: {
  connectedWalletAddress: string;
}) {
  const [relevantEpochs, setRelevantEpochs] = useState<Epoch[]>([]);

  useEffect(() => {
    const provider = new providers.JsonRpcProvider(config.browserNodeUrl);
    const epochManagerContract = new Contract(
      getContractAddress(),
      EpochManager.abi,
      provider
    );

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
          }, []);

        // For all these unique Epoch admins, get their latest Epoch status.
        const allEpochDetails = await Promise.all(
          allEpochAdmins.map((epochAdmin) => fetchEpoch(epochAdmin))
        );

        // For each Epoch, determine if relevant to the connected wallet
        // or not - if wallet is either admin or user.
        allEpochDetails.filter((epochDetails) => {
          if (!epochDetails) {
            return;
          }

          if (
            isAddressAdminOfEpoch(connectedWalletAddress, epochDetails) ||
            isAddressMemberOfEpoch(connectedWalletAddress, epochDetails)
          ) {
            setRelevantEpochs([...relevantEpochs, epochDetails]);
          }
        });
      });
  }, []); // HACK to avoid infinite loop

  return (
    <Container>
      <Container>
        <h1>Epoch Listings</h1>
      </Container>
      <Container>
        {relevantEpochs.map((relevantEpoch, idx) => (
          <EpochDetails
            key={idx}
            epoch={relevantEpoch}
            connectedWalletAddress={connectedWalletAddress}
          />
        ))}
      </Container>
    </Container>
  );
}
