'use client';

import { Card, CardContent, Link as MuiLink, Stack, Typography } from '@mui/material';

import { SubmissionDetail } from '@/lib/types';

import { DetailField } from './detail-helpers';

export default function BrokerCompanyCard({ submission }: { submission: SubmissionDetail }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Broker & company
        </Typography>
        <Stack spacing={3}>
          <DetailField label="Broker">
            <Typography variant="body1" component="div">
              {submission.broker.name}
              {submission.broker.primaryContactEmail ? (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  ·{' '}
                  <MuiLink
                    href={`mailto:${submission.broker.primaryContactEmail}`}
                    underline="hover"
                  >
                    {submission.broker.primaryContactEmail}
                  </MuiLink>
                </Typography>
              ) : null}
            </Typography>
          </DetailField>
          <DetailField label="Company">
            <Typography variant="body1">{submission.company.legalName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {[submission.company.industry, submission.company.headquartersCity]
                .filter(Boolean)
                .join(' · ') || '—'}
            </Typography>
          </DetailField>
          <DetailField label="Owner">
            <Typography variant="body1" component="div">
              {submission.owner.fullName}
              <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                (
                <MuiLink href={`mailto:${submission.owner.email}`} underline="hover">
                  {submission.owner.email}
                </MuiLink>
                )
              </Typography>
            </Typography>
          </DetailField>
        </Stack>
      </CardContent>
    </Card>
  );
}
