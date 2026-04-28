'use client';

import {
  Alert,
  Card,
  CardContent,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { SubmissionDetail } from '@/lib/types';

import { formatDateTime } from './detail-helpers';

export default function DocumentsCard({ submission }: { submission: SubmissionDetail }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Documents ({submission.documents.length})
        </Typography>
        {submission.documents.length === 0 ? (
          <Alert severity="info">No documents are attached yet.</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submission.documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.docType}</TableCell>
                    <TableCell>{formatDateTime(doc.uploadedAt)}</TableCell>
                    <TableCell>
                      {doc.fileUrl ? (
                        <MuiLink href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          Open
                        </MuiLink>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
