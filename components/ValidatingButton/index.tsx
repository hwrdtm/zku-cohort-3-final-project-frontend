import { Button } from "@mui/material";
import React, { useState } from "react";
import styles from "./index.module.css";

const DEFAULT_ERROR_MSG = "";

export default function ValidatingButton({
  onButtonValidate,
  onButtonSubmit,
  children,
}: {
  onButtonValidate: () => Promise<boolean>;
  onButtonSubmit: () => Promise<void>;
  children: any;
}) {
  const [validationErrorMessage, setValidationErrorMessage] =
    useState(DEFAULT_ERROR_MSG);

  return (
    <div className={styles.container}>
      <Button
        onClick={async () => {
          // validate
          try {
            await onButtonValidate();
          } catch (validationError: any) {
            setValidationErrorMessage(validationError.message);
            return;
          }
          setValidationErrorMessage(DEFAULT_ERROR_MSG);
          await onButtonSubmit();
        }}
        className={styles.button}
        variant="contained"
      >
        {children}
      </Button>
      {validationErrorMessage !== "" && (
        <div className={styles.errorMsg}>{validationErrorMessage}</div>
      )}
    </div>
  );
}
