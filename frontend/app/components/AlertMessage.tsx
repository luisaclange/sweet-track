import { CheckCircle, Error, Info } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Btn } from "./Btn";

export interface IAlertMessage {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  message: string;
  labelRightButton?: string;
  onClickRightButton?: () => void;
  labelLeftButton?: string;
  onClickLeftButton?: () => void;
  variant?: "info" | "error" | "success" | "warning";
}

export const AlertMessage = ({
  isOpen,
  message,
  setIsOpen,
  title,
  labelLeftButton,
  labelRightButton,
  onClickLeftButton,
  onClickRightButton,
  variant = "info",
}: IAlertMessage) => {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        if (reason === "escapeKeyDown") return;
        setIsOpen(false);
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          padding: "16px !important",
        }}
      >
        {variant == "info" ? (
          <Info className="mr-4 -mt-1 text-blue-400" />
        ) : variant == "error" ? (
          <Error className="mr-4 -mt-1 text-red-400" />
        ) : variant == "success" ? (
          <CheckCircle className="mr-4 -mt-1 text-green-400" />
        ) : variant == "warning" ? (
          <Error className="mr-4 -mt-1 text-yellow-300" />
        ) : (
          ""
        )}
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "16px !important",
        }}
      >
        <DialogContentText id="alert-dialog-description">
          <span className="text-[#f4f6fc]">{message}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "16px !important",
        }}
      >
        <div className="w-full flex flex-row justify-between">
          {onClickLeftButton ? (
            <Btn
              variant="secondary"
              onClick={() => {
                onClickLeftButton();
                setIsOpen(false);
              }}
              autoFocus
            >
              {labelLeftButton}
            </Btn>
          ) : (
            <div></div>
          )}
          <Btn
            onClick={() => {
              if (onClickRightButton) onClickRightButton();
              setIsOpen(false);
            }}
            autoFocus
          >
            {labelRightButton || "OK"}
          </Btn>
        </div>
      </DialogActions>
    </Dialog>
  );
};
