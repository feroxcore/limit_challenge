'use client';

import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import { SubmissionDetail } from '@/lib/types';

import {
  DetailField,
  formatDateTime,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from './detail-helpers';

export default function OverviewCard({ submission }: { submission: SubmissionDetail }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
          <DetailField label="Status">
            <Chip
              size="small"
              label={STATUS_LABEL[submission.status]}
              color={STATUS_COLOR[submission.status]}
              variant="outlined"
            />
          </DetailField>
          <DetailField label="Priority">
            <Chip
              size="small"
              label={PRIORITY_LABEL[submission.priority]}
              color={PRIORITY_COLOR[submission.priority]}
              variant="outlined"
            />
          </DetailField>
          <DetailField label="Created">
            <Typography variant="body1">{formatDateTime(submission.createdAt)}</Typography>
          </DetailField>
          <DetailField label="Updated">
            <Typography variant="body1">{formatDateTime(submission.updatedAt)}</Typography>
          </DetailField>
        </Stack>
        {submission.summary.trim() ? (
          <Box sx={{ mt: 2 }}>
            <DetailField label="Summary">
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {submission.summary}
              </Typography>
            </DetailField>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
