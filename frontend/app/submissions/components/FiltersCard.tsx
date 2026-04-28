'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Broker } from '@/lib/types';

import {
  ListFormState,
  PRIORITY_LABEL,
  PRIORITY_OPTIONS,
  STATUS_LABEL,
  STATUS_OPTIONS,
  YES_NO_ANY,
} from './list-constants';

type Props = {
  form: ListFormState;
  hasActiveFilters: boolean;
  hasInvalidDateRange: boolean;
  brokerOptions?: Broker[];
  onClearFilters: () => void;
  onUpdateFilter: <K extends keyof Omit<ListFormState, 'page'>>(
    key: K,
    value: ListFormState[K],
  ) => void;
};

export default function FiltersCard({
  form,
  hasActiveFilters,
  hasInvalidDateRange,
  brokerOptions,
  onClearFilters,
  onUpdateFilter,
}: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2.5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <Typography variant="h6">Filters</Typography>
            <Button
              size="small"
              variant="text"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              Clear all
            </Button>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(event) =>
                onUpdateFilter('status', event.target.value as ListFormState['status'])
              }
              fullWidth
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value || 'all'} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={form.priority}
              onChange={(event) =>
                onUpdateFilter('priority', event.target.value as ListFormState['priority'])
              }
              fullWidth
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value || 'all'} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Broker"
              value={form.brokerId}
              onChange={(event) => onUpdateFilter('brokerId', event.target.value)}
              fullWidth
            >
              <MenuItem value="">All brokers</MenuItem>
              {brokerOptions?.map((broker) => (
                <MenuItem key={broker.id} value={String(broker.id)}>
                  {broker.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Broker name contains"
              value={form.brokerSearch}
              onChange={(event) => onUpdateFilter('brokerSearch', event.target.value)}
              fullWidth
            />
            <TextField
              label="Company name contains"
              value={form.companyQuery}
              onChange={(event) => onUpdateFilter('companyQuery', event.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Created from"
              type="date"
              value={form.createdFrom}
              onChange={(event) => onUpdateFilter('createdFrom', event.target.value)}
              fullWidth
              error={hasInvalidDateRange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Created to"
              type="date"
              value={form.createdTo}
              onChange={(event) => onUpdateFilter('createdTo', event.target.value)}
              fullWidth
              error={hasInvalidDateRange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Has documents"
              value={form.hasDocuments}
              onChange={(event) =>
                onUpdateFilter('hasDocuments', event.target.value as ListFormState['hasDocuments'])
              }
              fullWidth
            >
              {YES_NO_ANY.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Has notes"
              value={form.hasNotes}
              onChange={(event) =>
                onUpdateFilter('hasNotes', event.target.value as ListFormState['hasNotes'])
              }
              fullWidth
            >
              {YES_NO_ANY.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          {hasActiveFilters ? (
            <Box display="flex" flexWrap="wrap" gap={1}>
              {form.status ? (
                <Chip
                  label={`Status: ${STATUS_LABEL[form.status]}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('status', '')}
                />
              ) : null}
              {form.priority ? (
                <Chip
                  label={`Priority: ${PRIORITY_LABEL[form.priority]}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('priority', '')}
                />
              ) : null}
              {form.createdFrom ? (
                <Chip
                  label={`Created from: ${form.createdFrom}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('createdFrom', '')}
                />
              ) : null}
              {form.createdTo ? (
                <Chip
                  label={`Created to: ${form.createdTo}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('createdTo', '')}
                />
              ) : null}
              {form.brokerId ? (
                <Chip
                  label={`Broker ID: ${form.brokerId}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('brokerId', '')}
                />
              ) : null}
              {form.brokerSearch ? (
                <Chip
                  label={`Broker contains: ${form.brokerSearch}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('brokerSearch', '')}
                />
              ) : null}
              {form.companyQuery ? (
                <Chip
                  label={`Company contains: ${form.companyQuery}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('companyQuery', '')}
                />
              ) : null}
              {form.hasDocuments ? (
                <Chip
                  label={`Has docs: ${form.hasDocuments === 'yes' ? 'Yes' : 'No'}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('hasDocuments', '')}
                />
              ) : null}
              {form.hasNotes ? (
                <Chip
                  label={`Has notes: ${form.hasNotes === 'yes' ? 'Yes' : 'No'}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => onUpdateFilter('hasNotes', '')}
                />
              ) : null}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Tip: set one or more filters to narrow down specific submissions.
            </Typography>
          )}
          {hasInvalidDateRange ? (
            <Alert severity="warning">
              Date range is invalid. Adjust the dates to continue fetching results.
            </Alert>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
