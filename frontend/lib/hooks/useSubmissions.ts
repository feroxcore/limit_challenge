'use client';

import { useMemo } from 'react';
import { QueryKey, useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import {
  PaginatedResponse,
  SubmissionDetail,
  SubmissionListFilters,
  SubmissionListItem,
} from '@/lib/types';

const SUBMISSIONS_QUERY_KEY = 'submissions';

/** Matches backend `REST_FRAMEWORK.PAGE_SIZE`. */
export const SUBMISSIONS_PAGE_SIZE = 10;

async function fetchSubmissions(filters: SubmissionListFilters) {
  const response = await apiClient.get<PaginatedResponse<SubmissionListItem>>('/submissions/', {
    params: {
      page: filters.page ?? 1,
      ordering: filters.ordering,
      createdFrom: filters.createdFrom,
      createdTo: filters.createdTo,
      status: filters.status,
      brokerId: filters.brokerId,
      brokerSearch: filters.brokerSearch,
      companySearch: filters.companySearch,
      priority: filters.priority,
      hasDocuments: filters.hasDocuments,
      hasNotes: filters.hasNotes,
    },
  });
  return response.data;
}

async function fetchSubmissionDetail(id: string | number) {
  if (!id) {
    throw new Error('Submission id is required');
  }

  const response = await apiClient.get<SubmissionDetail>(`/submissions/${id}/`);
  return response.data;
}

export function useSubmissionsList(filters: SubmissionListFilters, enabled = true) {
  return useQuery({
    queryKey: [SUBMISSIONS_QUERY_KEY, filters] as QueryKey,
    queryFn: () => fetchSubmissions(filters),
    enabled,
  });
}

export function useSubmissionDetail(id: string | number) {
  return useQuery({
    queryKey: [SUBMISSIONS_QUERY_KEY, id],
    queryFn: () => fetchSubmissionDetail(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useSubmissionQueryKey(filters: SubmissionListFilters) {
  return useMemo(() => [SUBMISSIONS_QUERY_KEY, filters] as QueryKey, [filters]);
}
