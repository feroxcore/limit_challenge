'use client';

import { Alert, Box, Container, Link as MuiLink, Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';
import BrokerCompanyCard from './components/BrokerCompanyCard';
import ContactsCard from './components/ContactsCard';
import DocumentsCard from './components/DocumentsCard';
import NotesCard from './components/NotesCard';
import OverviewCard from './components/OverviewCard';

export default function SubmissionDetailPage() {
  const params = useParams<{ id: string }>();
  const submissionId = params?.id ?? '';

  const detailQuery = useSubmissionDetail(submissionId);
  const s = detailQuery.data;

  if (!submissionId) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="warning">Missing submission id.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <div>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              {detailQuery.isSuccess && s ? s.summary.trim() || `Submission ${s.id}` : 'Submission'}
            </Typography>
            <Typography color="text.secondary">
              Full submission with broker, company, owner, contacts, documents, and notes.
            </Typography>
          </div>
          <Box textAlign="right">
            <MuiLink component={Link} href="/submissions" underline="hover">
              Back to list
            </MuiLink>
            {s ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                ID #{s.id}
              </Typography>
            ) : null}
          </Box>
        </Box>

        {detailQuery.isPending ? (
          <Box py={1}>
            <Skeleton variant="rounded" height={120} />
            <Skeleton variant="rounded" height={200} sx={{ mt: 2 }} />
            <Skeleton variant="rounded" height={200} sx={{ mt: 2 }} />
          </Box>
        ) : detailQuery.isError ? (
          <Alert severity="error">
            {detailQuery.error instanceof Error
              ? detailQuery.error.message
              : 'Failed to load submission.'}
          </Alert>
        ) : s ? (
          <Stack spacing={3}>
            <OverviewCard submission={s} />
            <BrokerCompanyCard submission={s} />
            <ContactsCard submission={s} />
            <DocumentsCard submission={s} />
            <NotesCard submission={s} />
          </Stack>
        ) : (
          <Alert severity="info">Submission not loaded.</Alert>
        )}
      </Stack>
    </Container>
  );
}
