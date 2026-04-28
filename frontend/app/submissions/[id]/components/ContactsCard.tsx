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

export default function ContactsCard({ submission }: { submission: SubmissionDetail }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contacts ({submission.contacts.length})
        </Typography>
        {submission.contacts.length === 0 ? (
          <Alert severity="info">No contacts have been added for this submission.</Alert>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submission.contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.role || '—'}</TableCell>
                    <TableCell>
                      {contact.email ? (
                        <MuiLink href={`mailto:${contact.email}`}>{contact.email}</MuiLink>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>{contact.phone || '—'}</TableCell>
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
