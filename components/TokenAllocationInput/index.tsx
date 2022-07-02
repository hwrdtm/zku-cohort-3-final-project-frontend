import React, { useState } from "react";
import { Container, TextField } from "@mui/material";
import { Epoch } from "../../models";
import {
  CIRCUIT_TOKEN_ALLOCATION_INPUT_LENGTH,
  MAX_TOKENS_TO_ALLOCATE,
} from "../../constants";
import { updateTokenAllocations } from "services/epochManager";
import ValidatingButton from "components/ValidatingButton";

function getDefaultTokenAllocations(numberOfEpochMembersToAllocateTo: number) {
  return Array.apply(null, Array(numberOfEpochMembersToAllocateTo)).map(
    (_) => 0
  );
}

export default function TokenAllocationInput({
  epoch,
  connectedWalletAddress,
}: {
  epoch: Epoch;
  connectedWalletAddress?: string;
}) {
  const [tokenAllocations, setTokenAllocations] = useState<number[]>(
    getDefaultTokenAllocations(CIRCUIT_TOKEN_ALLOCATION_INPUT_LENGTH)
  );
  const allocatingMemberIdx = epoch.members.indexOf(
    connectedWalletAddress || ""
  );

  return (
    <Container>
      <Container>
        <h4>
          Remaining Tokens:{" "}
          {MAX_TOKENS_TO_ALLOCATE -
            tokenAllocations.reduce((prev, curr) => prev + curr, 0)}
        </h4>
      </Container>
      {epoch.members.map((epochMemberAddress, idx) => {
        // do not render anything for the connected wallet address
        if (idx === allocatingMemberIdx) return null;

        return (
          <Container key={idx}>
            <h5>Allocation for Member: {epochMemberAddress}</h5>
            <TextField
              label={epochMemberAddress}
              type="number"
              variant="outlined"
              placeholder="eg. 1655854537"
              onChange={(e) => {
                // clone token allocations
                const newTokenAllocations = [...tokenAllocations];

                // set new value at index
                newTokenAllocations[idx] = parseInt(e.target.value || "0");

                // set new state
                setTokenAllocations(newTokenAllocations);
              }}
              style={{ width: "100%" }}
            />
          </Container>
        );
      })}
      <Container>
        <ValidatingButton
          onButtonValidate={() =>
            validateTokenAllocationsInput(tokenAllocations)
          }
          onButtonSubmit={() =>
            updateTokenAllocations(
              epoch.adminAddress,
              allocatingMemberIdx,
              epoch.members.length,
              tokenAllocations
            )
          }
        >
          Update
        </ValidatingButton>
      </Container>
    </Container>
  );
}

async function validateTokenAllocationsInput(
  tokenAllocations: number[]
): Promise<boolean> {
  // check positive numbers
  if (tokenAllocations.filter((n) => n < 0).length > 0)
    throw new Error("Negative allocations not allowed");

  // check sum to 10000
  if (
    tokenAllocations.reduce((prev, curr) => prev + curr, 0) !==
    MAX_TOKENS_TO_ALLOCATE
  )
    throw new Error("Token allocations must sum to 10000");

  return true;
}
