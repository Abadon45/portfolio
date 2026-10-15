import type { Metadata } from "next";
import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { FloatingHomeButton } from "../components/FloatingHomeButton";

export const metadata: Metadata = {
  title: "Privacy Policy | Noy Pangan",
  description:
    "Learn how the Noy Pangan portfolio handles account, contact, and usage information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" sx={{ fontWeight: 800 }} variant="h2">
              Privacy policy
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Last updated October 15, 2026
            </Typography>
          </Box>
          <Typography color="text.secondary">
            This portfolio is operated by Emmanuel Noy Pangan. This policy explains what information
            may be processed when you browse the portfolio or use its demonstrations.
          </Typography>
          <Box>
            <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
              Information you provide
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              If you contact me by email, I receive the information included in your message and use
              it to respond. The account demonstration may process the email address and profile
              information you submit to authenticate you and maintain your demo account.
            </Typography>
          </Box>
          <Box>
            <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
              Demonstration data and payments
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Portfolio demonstrations may use sample or demonstration data. Do not submit sensitive
              personal, financial, health, or confidential information. Payment demonstrations should
              be used only with the provider’s test credentials and test payment methods.
            </Typography>
          </Box>
          <Box>
            <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
              Analytics and cookies
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              This site does not currently include a configured third-party analytics service. The
              authentication demo may set cookies required to maintain a signed-in session. Your
              browser and hosting provider may also process standard technical request logs.
            </Typography>
          </Box>
          <Box>
            <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
              Your choices and contact
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              You can avoid submitting information and can clear site cookies through your browser.
              For privacy questions or requests about information you have submitted, contact{" "}
              <Link href="mailto:noypangan5@gmail.com">noypangan5@gmail.com</Link>.
            </Typography>
          </Box>
        </Stack>
      </Container>
      <FloatingHomeButton />
    </>
  );
}
