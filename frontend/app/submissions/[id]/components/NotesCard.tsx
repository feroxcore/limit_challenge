'use client';

import { Alert, Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';

import { SubmissionDetail } from '@/lib/types';

import { formatDateTime } from './detail-helpers';

export default function NotesCard({ submission }: { submission: SubmissionDetail }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notes ({submission.notes.length})
        </Typography>
        {submission.notes.length === 0 ? (
          <Alert severity="info">No notes have been added yet.</Alert>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={2}>
            {submission.notes.map((note) => (
              <Box key={note.id}>
                <Typography variant="subtitle2" color="text.secondary">
                  {note.authorName} · {formatDateTime(note.createdAt)}
                </Typography>
                <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{note.body}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
