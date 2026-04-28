'use client';

import { SubmissionPriority, SubmissionStatus } from '@/lib/types';

export const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export const PRIORITY_OPTIONS: { label: string; value: SubmissionPriority | '' }[] = [
  { label: 'All priorities', value: '' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export const YES_NO_ANY: { label: string; value: '' | 'yes' | 'no' }[] = [
  { label: 'Any', value: '' },
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

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

export type ListFormState = {
  page: number;
  ordering: string;
  status: SubmissionStatus | '';
  priority: SubmissionPriority | '';
  createdFrom: string;
  createdTo: string;
  brokerId: string;
  brokerSearch: string;
  companyQuery: string;
  hasDocuments: '' | 'yes' | 'no';
  hasNotes: '' | 'yes' | 'no';
};

export const INITIAL_FORM_STATE: ListFormState = {
  page: 1,
  ordering: '',
  status: '',
  priority: '',
  createdFrom: '',
  createdTo: '',
  brokerId: '',
  brokerSearch: '',
  companyQuery: '',
  hasDocuments: '',
  hasNotes: '',
};

export type SubmissionSortKey =
  | 'id'
  | 'summary'
  | 'company'
  | 'broker'
  | 'status'
  | 'priority'
  | 'owner'
  | 'documentCount'
  | 'noteCount'
  | 'updatedAt';

export type SortDirection = 'asc' | 'desc';

export function parseOrdering(ordering: string): {
  key: SubmissionSortKey | null;
  direction: SortDirection;
} {
  if (!ordering) {
    return { key: null, direction: 'asc' };
  }
  const direction: SortDirection = ordering.startsWith('-') ? 'desc' : 'asc';
  const raw = ordering.startsWith('-') ? ordering.slice(1) : ordering;
  const key = raw as SubmissionSortKey;
  return { key, direction };
}

export function triStateToBool(value: '' | 'yes' | 'no'): boolean | undefined {
  if (value === '') return undefined;
  return value === 'yes';
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
