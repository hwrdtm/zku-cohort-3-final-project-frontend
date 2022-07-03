import { Container, TextField } from "@mui/material";
import React, { useState } from "react";
import { Epoch } from "../../models";
import EpochDetails from "../EpochDetails";
import { fetchEpoch } from "../../services/epochManager";
import ValidatingButton from "../ValidatingButton";
import { validateAddressInput } from "../../utils/validation";
import styles from "./index.module.css";

export default function ViewEpochDetailsFunction({
  connectedWalletAddress,
}: {
  connectedWalletAddress: string;
}) {
  const [epochAdminAddressToViewDetails, setEpochAdminAddressToViewDetails] =
    useState("");
  const [fetchedEpoch, setFetchedEpoch] = useState<Epoch | null>(null);

  return (
    <Container>
      <h3>View Any Epoch</h3>
      <Container>
        <TextField
          label="Epoch Admin Address"
          variant="outlined"
          placeholder="eg. 0x8070656775b16eEB9440192D3E5832f76b0f6021"
          onChange={(e) => setEpochAdminAddressToViewDetails(e.target.value)}
          className={styles.addressInput}
        />
      </Container>
      <ValidatingButton
        onButtonValidate={() =>
          validateAddressInput(epochAdminAddressToViewDetails)
        }
        onButtonSubmit={async () => {
          const epoch = await fetchEpoch(epochAdminAddressToViewDetails);
          setFetchedEpoch(epoch);
        }}
      >
        View Epoch
      </ValidatingButton>
      {!!fetchedEpoch && (
        <EpochDetails
          epoch={fetchedEpoch}
          connectedWalletAddress={connectedWalletAddress}
        />
      )}
    </Container>
  );
}
