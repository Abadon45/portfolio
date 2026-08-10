"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Stack, Typography } from "@mui/material";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AlertType = "success" | "error" | "warning" | "info";
type Toast = { id: number; message: string; type: AlertType; duration: number };
type ModalOptions = { title: ReactNode; content?: ReactNode; type?: AlertType; confirmText?: string; cancelText?: string; showCancel?: boolean };
type ModalResult = { action: "confirm" | "cancel" | "dismiss" };
type AlertSystemValue = { toast: (message: string, type?: AlertType, duration?: number) => void; toastSuccess: (message: string) => void; toastInfo: (message: string) => void; toastError: (message: string) => void; notify: (message: string, type?: AlertType) => void; showModal: (options: ModalOptions) => Promise<ModalResult> };
const AlertSystemContext = createContext<AlertSystemValue | null>(null);

export function useTwcAlert() { const context = useContext(AlertSystemContext); if (!context) throw new Error("useTwcAlert must be used inside TwcAlertProvider"); return context; }

export default function TwcAlertProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]); const [modal, setModal] = useState<ModalOptions | null>(null); const [resolve, setResolve] = useState<((result: ModalResult) => void) | null>(null);
  const toast = useCallback((message: string, type: AlertType = "info", duration = 3200) => setToasts((current) => [...current, { id: Date.now() + Math.random(), message, type, duration }]), []);
  useEffect(() => { const timers = toasts.map((item) => window.setTimeout(() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id)), item.duration)); return () => timers.forEach(window.clearTimeout); }, [toasts]);
  const closeModal = useCallback((action: ModalResult["action"]) => { resolve?.({ action }); setResolve(null); setModal(null); }, [resolve]);
  const showModal = useCallback((options: ModalOptions) => new Promise<ModalResult>((finish) => { setModal(options); setResolve(() => finish); }), []);
  const value = useMemo<AlertSystemValue>(() => ({ toast, toastSuccess: (message) => toast(message, "success"), toastInfo: (message) => toast(message, "info"), toastError: (message) => toast(message, "error"), notify: (message, type = "info") => toast(message, type), showModal }), [showModal, toast]);
  return <AlertSystemContext.Provider value={value}>{children}<Box sx={{ display: "flex", flexDirection: "column", gap: 1, position: "fixed", right: 16, top: 16, width: { xs: "calc(100% - 32px)", sm: 380 }, zIndex: (theme) => theme.zIndex.snackbar + 2 }}>{toasts.map((item) => <Alert key={item.id} onClose={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))} severity={item.type} variant="filled">{item.message}</Alert>)}</Box><Snackbar open={false} /><Dialog fullWidth maxWidth="xs" onClose={() => closeModal("dismiss")} open={Boolean(modal)}><DialogTitle sx={{ pr: 6 }}>{modal?.title}<IconButton aria-label="close" onClick={() => closeModal("dismiss")} sx={{ position: "absolute", right: 8, top: 8 }}><CloseRoundedIcon /></IconButton></DialogTitle><DialogContent><Typography color="text.secondary">{modal?.content}</Typography></DialogContent><DialogActions><Stack direction="row" spacing={1} sx={{ p: 1 }}>{modal?.showCancel !== false && <Button onClick={() => closeModal("cancel")}>{modal?.cancelText ?? "Cancel"}</Button>}<Button onClick={() => closeModal("confirm")} variant="contained">{modal?.confirmText ?? "Confirm"}</Button></Stack></DialogActions></Dialog></AlertSystemContext.Provider>;
}
