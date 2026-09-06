"use client";

import { Alert, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTwcStore } from "./TwcStoreProvider";

export default function CatalogueStatus() {
  const { catalogueUnavailable } = useTwcStore();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!catalogueUnavailable) return null;

  return (
    <Container sx={{ py: 2 }}>
      <Alert
        severity="warning"
        action={
          <Button
            color="inherit"
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
          >
            {pending ? "Retrying…" : "Retry"}
          </Button>
        }
      >
        We couldn’t load the catalogue. Please try again in a moment.
      </Alert>
    </Container>
  );
}
