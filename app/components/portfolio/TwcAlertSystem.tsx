"use client";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AlertType = "success" | "error" | "warning" | "info";

export type ModalOptions = {
  title: ReactNode;
  content?: ReactNode;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

export type ModalResult = {
  action: "confirm" | "cancel" | "dismiss";
};

type Toast = {
  id: string;
  message: string;
  type: AlertType;
  duration: number;
};

type AlertSystemValue = {
  toast: (message: string, type?: AlertType, duration?: number) => string;
  toastSuccess: (message: string) => string;
  toastInfo: (message: string) => string;
  toastWarning: (message: string) => string;
  toastError: (message: string) => string;
  notify: (message: string, type?: AlertType, duration?: number) => void;
  showModal: (options: ModalOptions) => Promise<ModalResult>;
};

const AlertSystemContext = createContext<AlertSystemValue | null>(null);

const iconByType = {
  success: <CheckCircleOutlineRoundedIcon />,
  error: <ErrorOutlineRoundedIcon />,
  warning: <WarningAmberRoundedIcon />,
  info: <InfoOutlinedIcon />,
} satisfies Record<AlertType, ReactNode>;

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useTwcAlert() {
  const context = useContext(AlertSystemContext);
  if (!context) {
    throw new Error("useTwcAlert must be used inside TwcAlertProvider");
  }
  return context;
}

export default function TwcAlertProvider({
  children,
}: {
  children: ReactNode;
}) {
  const theme = useTheme();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalOptions | null>(null);
  const resolverRef = useRef<((result: ModalResult) => void) | null>(null);

  const closeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: AlertType = "info", duration = 3200) => {
      const id = createToastId();
      setToasts((current) => [...current, { id, message, type, duration }]);
      return id;
    },
    [],
  );

  useEffect(() => {
    const timers = toasts
      .filter((item) => item.duration > 0)
      .map((item) =>
        window.setTimeout(() => closeToast(item.id), item.duration),
      );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [closeToast, toasts]);

  const closeModal = useCallback((action: ModalResult["action"]) => {
    resolverRef.current?.({ action });
    resolverRef.current = null;
    setModal(null);
  }, []);

  const showModal = useCallback((options: ModalOptions) => {
    return new Promise<ModalResult>((resolve) => {
      resolverRef.current?.({ action: "dismiss" });
      resolverRef.current = resolve;
      setModal({ ...options, showCancel: options.showCancel ?? true });
    });
  }, []);

  const value = useMemo<AlertSystemValue>(
    () => ({
      toast,
      toastSuccess: (message) => toast(message, "success"),
      toastInfo: (message) => toast(message, "info"),
      toastWarning: (message) => toast(message, "warning"),
      toastError: (message) => toast(message, "error"),
      notify: (message, type = "info", duration = 3200) =>
        toast(message, type, duration),
      showModal,
    }),
    [showModal, toast],
  );

  const modalType = modal?.type ?? "info";

  return (
    <AlertSystemContext.Provider value={value}>
      {children}
      <Stack
        aria-live="polite"
        spacing={1}
        sx={{
          position: "fixed",
          right: { xs: 16, sm: 24 },
          top: { xs: 16, sm: 24 },
          width: { xs: "calc(100% - 32px)", sm: 380 },
          zIndex: theme.zIndex.snackbar + 2,
        }}
      >
        {toasts.map((item) => (
          <Alert
            action={
              <IconButton
                aria-label="Dismiss notification"
                color="inherit"
                onClick={() => closeToast(item.id)}
                size="small"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            }
            icon={iconByType[item.type]}
            key={item.id}
            severity={item.type}
            variant="filled"
          >
            {item.message}
          </Alert>
        ))}
      </Stack>
      <Dialog
        aria-describedby={modal ? "twc-alert-dialog-description" : undefined}
        aria-labelledby={modal ? "twc-alert-dialog-title" : undefined}
        fullWidth
        maxWidth="xs"
        onClose={() => closeModal("dismiss")}
        open={Boolean(modal)}
      >
        <DialogTitle
          id="twc-alert-dialog-title"
          sx={{ alignItems: "center", display: "flex", gap: 1, pr: 6 }}
        >
          {iconByType[modalType] ?? <HelpOutlineRoundedIcon />}
          <Box component="span" sx={{ flex: 1 }}>
            {modal?.title}
          </Box>
          <IconButton
            aria-label="Close confirmation"
            onClick={() => closeModal("dismiss")}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        {modal?.content && (
          <DialogContent id="twc-alert-dialog-description">
            {typeof modal.content === "string" ? (
              <Typography color="text.secondary">{modal.content}</Typography>
            ) : (
              modal.content
            )}
          </DialogContent>
        )}
        <DialogActions sx={{ gap: 1, p: 2 }}>
          {modal?.showCancel !== false && (
            <Button onClick={() => closeModal("cancel")}>
              {modal?.cancelText ?? "Cancel"}
            </Button>
          )}
          <Button
            color={
              modalType === "error" || modalType === "warning"
                ? "error"
                : "primary"
            }
            onClick={() => closeModal("confirm")}
            variant="contained"
          >
            {modal?.confirmText ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </AlertSystemContext.Provider>
  );
}
