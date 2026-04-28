'use client';

import { Box, Chip, Typography } from '@mui/material';

import { SubmissionPriority, SubmissionStatus } from '@/lib/types';

export const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: 'New',
  in_review: 'In review',
  closed: 'Closed',
  lost: 'Lost',
};

export const PRIORITY_LABEL: Record<SubmissionPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const STATUS_COLOR: Record<SubmissionStatus, 'default' | 'info' | 'success' | 'error'> = {
  new: 'info',
  in_review: 'default',
  closed: 'success',
  lost: 'error',
};

export const PRIORITY_COLOR: Record<SubmissionPriority, 'error' | 'warning' | 'default'> = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div">
        {label}
      </Typography>
      <Box sx={{ mt: 0.25 }}>{children}</Box>
    </Box>
  );
}

export function StatusPriorityChips({
  status,
  priority,
}: {
  status: SubmissionStatus;
  priority: SubmissionPriority;
}) {
  return (
    <>
      <Chip
        size="small"
        label={STATUS_LABEL[status]}
        color={STATUS_COLOR[status]}
        variant="outlined"
      />
      <Chip
        size="small"
        label={PRIORITY_LABEL[priority]}
        color={PRIORITY_COLOR[priority]}
        variant="outlined"
      />
    </>
  );
}
