import { Container, TextField } from "@mui/material";
import React, { useState } from "react";
import ValidatingButton from "../ValidatingButton";
import { validateAddressInput } from "../../utils/validation";
import styles from "./index.module.css";

export default function RevealEpochFunction() {
  const [epochAdminAddressToReveal, setEpochAdminAddressToReveal] =
    useState("");

  return (
    <Container>
      <h3>Reveal A Finished Epoch</h3>
      <Container>
        <TextField
          label="Epoch Admin Address"
          variant="outlined"
          placeholder="eg. 0x8070656775b16eEB9440192D3E5832f76b0f6021"
          onChange={(e) => setEpochAdminAddressToReveal(e.target.value)}
          className={styles.addressInput}
        />
      </Container>
      <ValidatingButton
        onButtonValidate={() => validateAddressInput(epochAdminAddressToReveal)}
        onButtonSubmit={async () => {
          // POST to API to have dedicated coordinator reveal token allocations
          await fetch("/api/token-allocations/reveal", {
            method: "POST",
            body: JSON.stringify({
              addressOfEpochAdmin: epochAdminAddressToReveal,
            }),
          });
        }}
      >
        Reveal
      </ValidatingButton>
    </Container>
  );
}
