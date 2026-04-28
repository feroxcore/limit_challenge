'use client';

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Link as MuiLink,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { UseQueryResult } from '@tanstack/react-query';

import { SUBMISSIONS_PAGE_SIZE } from '@/lib/hooks/useSubmissions';
import { PaginatedResponse, SubmissionListItem } from '@/lib/types';

import {
  formatDateTime,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
} from './list-constants';
import { SortDirection, SubmissionSortKey } from './list-constants';

type Props = {
  query: UseQueryResult<PaginatedResponse<SubmissionListItem>, Error>;
  page: number;
  sortKey: SubmissionSortKey | null;
  sortDirection: SortDirection;
  onSortChange: (key: SubmissionSortKey) => void;
  onPageChange: (page: number) => void;
};

type SortableHeader = {
  label: string;
  key: SubmissionSortKey;
  align?: 'left' | 'right' | 'center' | 'justify' | 'inherit';
};

const SORTABLE_HEADERS: SortableHeader[] = [
  { label: 'ID', key: 'id' },
  { label: 'Summary', key: 'summary' },
  { label: 'Company', key: 'company' },
  { label: 'Broker', key: 'broker' },
  { label: 'Status', key: 'status' },
  { label: 'Priority', key: 'priority' },
  { label: 'Owner', key: 'owner' },
  { label: 'Docs', key: 'documentCount', align: 'right' },
  { label: 'Notes', key: 'noteCount', align: 'right' },
  { label: 'Updated', key: 'updatedAt' },
];

export default function SubmissionsTableCard({
  query,
  page,
  sortKey,
  sortDirection,
  onSortChange,
  onPageChange,
}: Props) {
  const total = query.data?.count ?? 0;
  const rows = query.data?.results ?? [];
  const activeSortLabel =
    sortKey && SORTABLE_HEADERS.find((header) => header.key === sortKey)?.label;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <Typography variant="h6">Submission list</Typography>
            {query.isFetching && !query.isPending ? (
              <Typography variant="body2" color="text.secondary">
                Updating...
              </Typography>
            ) : null}
          </Box>
          <Typography color="text.secondary" variant="body2">
            {query.isPending
              ? 'Loading…'
              : query.isError
                ? null
                : `${total} match${total === 1 ? '' : 'es'}`}
          </Typography>
          {activeSortLabel ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Sorted by {activeSortLabel} ({sortDirection === 'asc' ? 'ascending' : 'descending'})
            </Typography>
          ) : null}
          <Divider />
          {query.isError ? (
            <Alert severity="error">
              {query.error instanceof Error ? query.error.message : 'Failed to load submissions.'}
            </Alert>
          ) : null}
          {query.isPending ? (
            <Box py={1}>
              <Skeleton variant="rounded" height={48} />
              <Skeleton variant="rounded" height={48} sx={{ mt: 1.25 }} />
              <Skeleton variant="rounded" height={48} sx={{ mt: 1.25 }} />
              <Skeleton variant="rounded" height={48} sx={{ mt: 1.25 }} />
            </Box>
          ) : query.isError ? null : (
            <>
              <TableContainer sx={{ maxWidth: '100%' }}>
                <Table size="small" stickyHeader sx={{ minWidth: 720 }}>
                  <TableHead>
                    <TableRow>
                      {SORTABLE_HEADERS.map((header) => (
                        <TableCell
                          key={header.key}
                          align={header.align}
                          sx={{
                            bgcolor: sortKey === header.key ? 'action.selected' : 'action.hover',
                            borderBottomColor: 'divider',
                          }}
                        >
                          <TableSortLabel
                            active={sortKey === header.key}
                            direction={sortKey === header.key ? sortDirection : 'asc'}
                            onClick={() => onSortChange(header.key)}
                            hideSortIcon={false}
                            sx={{
                              cursor: 'pointer',
                              '& .MuiTableSortLabel-icon': {
                                opacity: 0.45,
                              },
                              '&.Mui-active .MuiTableSortLabel-icon': {
                                opacity: 1,
                              },
                              '&:hover .MuiTableSortLabel-icon': {
                                opacity: 0.8,
                              },
                            }}
                          >
                            {header.label}
                          </TableSortLabel>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10}>
                          <Typography color="text.secondary" sx={{ py: 2 }}>
                            No submissions match these filters.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            #{row.id}
                          </TableCell>
                          <TableCell sx={{ maxWidth: 360 }}>
                            <Stack spacing={0.25}>
                              <MuiLink
                                component={Link}
                                href={`/submissions/${row.id}`}
                                underline="hover"
                                sx={{ fontWeight: 600 }}
                              >
                                {row.summary || `Submission ${row.id}`}
                              </MuiLink>
                              {row.latestNote ? (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'block',
                                  }}
                                >
                                  Latest note by {row.latestNote.authorName}:{' '}
                                  {row.latestNote.bodyPreview}
                                </Typography>
                              ) : null}
                            </Stack>
                          </TableCell>
                          <TableCell>{row.company.legalName}</TableCell>
                          <TableCell>{row.broker.name}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={STATUS_LABEL[row.status]}
                              color={STATUS_COLOR[row.status]}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={PRIORITY_LABEL[row.priority]}
                              color={PRIORITY_COLOR[row.priority]}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{row.owner.fullName}</TableCell>
                          <TableCell align="right">{row.documentCount}</TableCell>
                          <TableCell align="right">{row.noteCount}</TableCell>
                          <TableCell>{formatDateTime(row.updatedAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={(_, newPage) => onPageChange(newPage + 1)}
                rowsPerPage={SUBMISSIONS_PAGE_SIZE}
                rowsPerPageOptions={[]}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                }
              />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
