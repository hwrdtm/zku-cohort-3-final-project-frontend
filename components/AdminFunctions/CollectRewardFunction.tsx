import { Container, TextField } from "@mui/material";
import ValidatingButton from "components/ValidatingButton";
import React, { useState } from "react";
import { validateAddressInput } from "utils/validation";
import { collectEpochReward } from "../../services/epochManager";
import styles from "./index.module.css";

export default function CollectRewardFunction() {
  const [
    epochAdminAddressToCollectReward,
    setEpochAdminAddressToCollectReward,
  ] = useState("");

  return (
    <Container>
      <h3>Collect Finalized Epoch Reward</h3>
      <Container>
        <TextField
          label="Epoch Admin Address"
          variant="outlined"
          placeholder="eg. 0x8070656775b16eEB9440192D3E5832f76b0f6021"
          onChange={(e) => setEpochAdminAddressToCollectReward(e.target.value)}
          className={styles.addressInput}
        />
      </Container>
      <ValidatingButton
        onButtonValidate={() =>
          validateAddressInput(epochAdminAddressToCollectReward)
        }
        onButtonSubmit={async () => {
          await collectEpochReward({
            addressOfEpochAdmin: epochAdminAddressToCollectReward,
          });
        }}
      >
        Collect Epoch Reward
      </ValidatingButton>
    </Container>
  );
}
