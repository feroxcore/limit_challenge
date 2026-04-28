from datetime import datetime, time, timedelta

import django_filters
from django.utils import timezone

from submissions import models


class SubmissionFilterSet(django_filters.FilterSet):
    """Filters for the submissions list (query string keys match the frontend).

    List requests use a queryset annotated with `document_count` and `note_count` so
    hasDocuments / hasNotes can filter without extra subqueries.
    """

    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")
    brokerId = django_filters.NumberFilter(field_name="broker_id")
    brokerSearch = django_filters.CharFilter(method="filter_broker_search")
    companySearch = django_filters.CharFilter(method="filter_company_search")
    priority = django_filters.CharFilter(field_name="priority", lookup_expr="iexact")
    createdFrom = django_filters.DateFilter(method="filter_created_from")
    createdTo = django_filters.DateFilter(method="filter_created_to")
    hasDocuments = django_filters.BooleanFilter(method="filter_has_documents")
    hasNotes = django_filters.BooleanFilter(method="filter_has_notes")
    ordering = django_filters.CharFilter(method="filter_ordering")

    class Meta:
        model = models.Submission
        fields: list[str] = []

    @staticmethod
    def _has_annotation(queryset, annotation_name: str) -> bool:
        return annotation_name in queryset.query.annotations

    def filter_broker_search(self, queryset, name, value):
        if not value or not str(value).strip():
            return queryset
        return queryset.filter(broker__name__icontains=str(value).strip())

    def filter_company_search(self, queryset, name, value):
        if not value or not str(value).strip():
            return queryset
        return queryset.filter(company__legal_name__icontains=str(value).strip())

    def filter_has_documents(self, queryset, name, value):
        if value is None:
            return queryset
        if not self._has_annotation(queryset, "document_count"):
            if value:
                return queryset.filter(documents__isnull=False).distinct()
            return queryset.filter(documents__isnull=True)
        if value:
            return queryset.filter(document_count__gt=0)
        return queryset.filter(document_count=0)

    def filter_has_notes(self, queryset, name, value):
        if value is None:
            return queryset
        if not self._has_annotation(queryset, "note_count"):
            if value:
                return queryset.filter(notes__isnull=False).distinct()
            return queryset.filter(notes__isnull=True)
        if value:
            return queryset.filter(note_count__gt=0)
        return queryset.filter(note_count=0)

    def filter_created_from(self, queryset, name, value):
        if value is None:
            return queryset
        tz = timezone.get_current_timezone()
        start_dt = timezone.make_aware(datetime.combine(value, time.min), timezone=tz)
        return queryset.filter(created_at__gte=start_dt)

    def filter_created_to(self, queryset, name, value):
        if value is None:
            return queryset
        tz = timezone.get_current_timezone()
        next_day_start = timezone.make_aware(
            datetime.combine(value + timedelta(days=1), time.min), timezone=tz
        )
        return queryset.filter(created_at__lt=next_day_start)

    def filter_ordering(self, queryset, name, value):
        if not value:
            return queryset

        raw = str(value).strip()
        is_desc = raw.startswith("-")
        key = raw[1:] if is_desc else raw

        field_map = {
            "id": "id",
            "documentCount": "document_count",
            "noteCount": "note_count",
            "summary": "summary",
            "company": "company__legal_name",
            "broker": "broker__name",
            "owner": "owner__full_name",
            "updatedAt": "updated_at",
            "status": "status_rank",
            "priority": "priority_rank",
        }
        primary_field = field_map.get(key)
        if not primary_field:
            return queryset
        if primary_field in {"document_count", "note_count", "status_rank", "priority_rank"}:
            if not self._has_annotation(queryset, primary_field):
                # Detail querysets do not include list-only annotations.
                return queryset

        if primary_field == "id":
            return queryset.order_by("-id" if is_desc else "id")

        primary_order = f"-{primary_field}" if is_desc else primary_field
        # Always use id ascending as a deterministic tie-breaker.
        return queryset.order_by(primary_order, "id")
