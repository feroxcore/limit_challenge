'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';

import FiltersCard from './components/FiltersCard';
import {
  INITIAL_FORM_STATE,
  ListFormState,
  parseOrdering,
  SubmissionSortKey,
  triStateToBool,
} from './components/list-constants';
import SubmissionsTableCard from './components/SubmissionsTableCard';

export default function SubmissionsPage() {
  const [form, setForm] = useState<ListFormState>(INITIAL_FORM_STATE);
  const {
    page,
    ordering,
    status,
    priority,
    createdFrom,
    createdTo,
    brokerId,
    brokerSearch,
    companyQuery,
    hasDocuments,
    hasNotes,
  } = form;

  const updateFilter = <K extends keyof Omit<ListFormState, 'page'>>(
    key: K,
    value: ListFormState[K],
  ) => {
    setForm((current) => ({ ...current, page: 1, [key]: value }));
  };

  const hasInvalidDateRange = Boolean(createdFrom && createdTo && createdFrom > createdTo);

  const filters = useMemo(
    () => ({
      page,
      ordering: ordering || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      status: status || undefined,
      priority: priority || undefined,
      brokerId: brokerId || undefined,
      brokerSearch: brokerSearch.trim() || undefined,
      companySearch: companyQuery.trim() || undefined,
      hasDocuments: triStateToBool(hasDocuments),
      hasNotes: triStateToBool(hasNotes),
    }),
    [
      page,
      ordering,
      createdFrom,
      createdTo,
      status,
      priority,
      brokerId,
      brokerSearch,
      companyQuery,
      hasDocuments,
      hasNotes,
    ],
  );

  const submissionsQuery = useSubmissionsList(filters, !hasInvalidDateRange);
  const brokerQuery = useBrokerOptions();
  const hasBrokerSearch = Boolean(brokerSearch.trim());
  const hasCompanyQuery = Boolean(companyQuery.trim());
  const hasActiveFilters = Boolean(
    createdFrom ||
    createdTo ||
    status ||
    priority ||
    brokerId ||
    hasBrokerSearch ||
    hasCompanyQuery ||
    hasDocuments ||
    hasNotes,
  );

  const clearFilters = () => {
    setForm(INITIAL_FORM_STATE);
  };
  const { key: activeSortKey, direction: activeSortDirection } = parseOrdering(ordering);
  const handleSortChange = (key: SubmissionSortKey) => {
    setForm((current) => {
      const { key: currentKey, direction: currentDirection } = parseOrdering(current.ordering);
      let nextOrdering: string = key;
      if (currentKey === key) {
        nextOrdering = currentDirection === 'asc' ? `-${key}` : key;
      }
      return {
        ...current,
        page: 1,
        ordering: nextOrdering,
      };
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Submissions
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Browse and triage incoming opportunities with server-side filters and pagination.
          </Typography>
        </Box>

        <FiltersCard
          form={form}
          hasActiveFilters={hasActiveFilters}
          hasInvalidDateRange={hasInvalidDateRange}
          brokerOptions={brokerQuery.data}
          onClearFilters={clearFilters}
          onUpdateFilter={updateFilter}
        />
        <SubmissionsTableCard
          query={submissionsQuery}
          page={page}
          sortKey={activeSortKey}
          sortDirection={activeSortDirection}
          onSortChange={handleSortChange}
          onPageChange={(nextPage) => setForm((current) => ({ ...current, page: nextPage }))}
        />
      </Stack>
    </Container>
  );
}
