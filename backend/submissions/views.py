from django.db.models import Case, Count, IntegerField, OuterRef, Subquery, Value, When
from rest_framework import viewsets

from submissions import models, serializers
from submissions.filters.submission import SubmissionFilterSet


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Submission.objects.all()
    filterset_class = SubmissionFilterSet

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == "list":
            latest_note = (
                models.Note.objects.filter(submission_id=OuterRef("pk")).order_by("-created_at")
            )
            return (
                queryset.select_related("company", "broker", "owner")
                .annotate(
                    document_count=Count("documents", distinct=True),
                    note_count=Count("notes", distinct=True),
                    latest_note_author=Subquery(latest_note.values("author_name")[:1]),
                    latest_note_body=Subquery(latest_note.values("body")[:1]),
                    latest_note_created_at=Subquery(latest_note.values("created_at")[:1]),
                    status_rank=Case(
                        When(status=models.Submission.Status.NEW, then=Value(0)),
                        When(status=models.Submission.Status.IN_REVIEW, then=Value(1)),
                        When(status=models.Submission.Status.CLOSED, then=Value(2)),
                        When(status=models.Submission.Status.LOST, then=Value(3)),
                        default=Value(99),
                        output_field=IntegerField(),
                    ),
                    priority_rank=Case(
                        When(priority=models.Submission.Priority.HIGH, then=Value(0)),
                        When(priority=models.Submission.Priority.MEDIUM, then=Value(1)),
                        When(priority=models.Submission.Priority.LOW, then=Value(2)),
                        default=Value(99),
                        output_field=IntegerField(),
                    ),
                )
                .order_by("id")
            )
        return queryset.select_related("company", "broker", "owner").prefetch_related(
            "contacts", "documents", "notes"
        )

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.SubmissionListSerializer
        return serializers.SubmissionDetailSerializer


class BrokerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Broker.objects.all()
    serializer_class = serializers.BrokerSerializer
    pagination_class = None

