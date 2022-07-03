import { Container, TextField } from "@mui/material";
import React, { useState } from "react";
import { scheduleNewEpoch } from "../../services/epochManager";
import ValidatingButton from "../ValidatingButton";
import { validateAddressInput } from "../../utils/validation";
import styles from "./index.module.css";
import { object, number } from "yup";

export default function ScheduleNewEpochFunction() {
  const [rewardBudget, setRewardBudget] = useState(0);
  const [members, setMembers] = useState<string[]>([]);
  const [startsAt, setStartsAt] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dedicatedCoordinator] = useState(
    "0xcE042AFD540Ba1eDce4eb2E28561b970E3642907"
  );

  return (
    <Container>
      <h3>Schedule New Epoch</h3>
      <Container>
        <TextField
          label="Reward Budget (in ETH)"
          type="number"
          variant="outlined"
          placeholder="eg. 5.5"
          onChange={(e) => setRewardBudget(parseFloat(e.target.value))}
          className={styles.input}
        />
        <TextField
          label="Members (comma-separated, no spaces)"
          variant="outlined"
          placeholder="eg. 0x1,0x2"
          onChange={(e) => setMembers(e.target.value.split(","))}
          className={styles.input}
        />
        <TextField
          label="Starts At (unix seconds)"
          type="number"
          variant="outlined"
          placeholder="eg. 1655854537"
          onChange={(e) => setStartsAt(parseInt(e.target.value))}
          className={styles.input}
        />
        <TextField
          label="Duration (in seconds)"
          type="number"
          variant="outlined"
          placeholder="eg. 120 (2m)"
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className={styles.input}
        />
        <TextField
          label="Dedicated Coordinator"
          variant="outlined"
          placeholder="eg. 0x8070656775b16eEB9440192D3E5832f76b0f6021"
          value="0xcE042AFD540Ba1eDce4eb2E28561b970E3642907"
          disabled
          // onChange={(e) => setDedicatedCoordinator(e.target.value)}
          className={styles.addressInput}
        />
      </Container>
      <ValidatingButton
        onButtonValidate={() =>
          validateNewEpochParameters({
            rewardBudget,
            members,
            startsAt,
            duration,
            dedicatedCoordinator,
          })
        }
        onButtonSubmit={() =>
          scheduleNewEpoch({
            rewardBudget,
            members,
            startsAt,
            duration,
            dedicatedCoordinator,
          })
        }
      >
        Schedule
      </ValidatingButton>
    </Container>
  );
}

const getNowInUnixSeconds = () => Math.floor(new Date().valueOf() / 1000);

async function validateNewEpochParameters({
  rewardBudget,
  members,
  startsAt,
  duration,
  dedicatedCoordinator,
}: {
  rewardBudget: number;
  members: string[];
  startsAt: number;
  duration: number;
  dedicatedCoordinator: string;
}): Promise<boolean> {
  // validate reward budget, startsAt, duration
  // construct validation schema
  const epochPartialValidationSchema = object({
    rewardBudget: number().required().positive(),
    startsAt: number().required().positive().min(getNowInUnixSeconds()),
    duration: number().required().positive(),
  });
  await epochPartialValidationSchema.validate({
    rewardBudget,
    startsAt,
    duration,
  });

  // validate members input
  if (members.length < 2 || members.length > 15)
    throw new Error("members length must be between 2 and 15");

  await Promise.all(members.map(validateAddressInput));

  // validate dedicated coordinator address
  await validateAddressInput(dedicatedCoordinator);

  return true;
}
