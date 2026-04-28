from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from submissions import models


class SubmissionApiTests(APITestCase):
    def setUp(self):
        self.broker_alpha = models.Broker.objects.create(
            name="Alpha Brokers", primary_contact_email="alpha@example.com"
        )
        self.broker_beta = models.Broker.objects.create(
            name="Beta Brokers", primary_contact_email="beta@example.com"
        )

        self.company_a = models.Company.objects.create(
            legal_name="Acme Holdings", industry="Finance", headquarters_city="London"
        )
        self.company_b = models.Company.objects.create(
            legal_name="Beacon Retail", industry="Retail", headquarters_city="Paris"
        )

        self.owner = models.TeamMember.objects.create(
            full_name="Casey Owner", email="casey.owner@example.com"
        )

        self.submission_new = models.Submission.objects.create(
            company=self.company_a,
            broker=self.broker_alpha,
            owner=self.owner,
            status=models.Submission.Status.NEW,
            priority=models.Submission.Priority.HIGH,
            summary="New deal summary",
        )
        self.submission_closed = models.Submission.objects.create(
            company=self.company_b,
            broker=self.broker_beta,
            owner=self.owner,
            status=models.Submission.Status.CLOSED,
            priority=models.Submission.Priority.LOW,
            summary="Closed deal summary",
        )
        self.submission_closed_same_summary = models.Submission.objects.create(
            company=self.company_b,
            broker=self.broker_beta,
            owner=self.owner,
            status=models.Submission.Status.CLOSED,
            priority=models.Submission.Priority.LOW,
            summary="Closed deal summary",
        )

        models.Contact.objects.create(
            submission=self.submission_new,
            name="Primary Contact",
            role="CFO",
            email="contact@example.com",
            phone="+44 1000 000",
        )
        models.Document.objects.create(
            submission=self.submission_new,
            title="Financial Pack",
            doc_type="financial",
            file_url="https://example.com/financial-pack.pdf",
        )
        models.Note.objects.create(
            submission=self.submission_new,
            author_name="Analyst",
            body="Initial review note",
        )

        # Set deterministic dates for created_at range filter assertions.
        jan_date = timezone.make_aware(timezone.datetime(2026, 1, 15, 10, 0, 0))
        dec_date = timezone.make_aware(timezone.datetime(2026, 12, 20, 10, 0, 0))
        models.Submission.objects.filter(id=self.submission_new.id).update(
            created_at=jan_date, updated_at=jan_date
        )
        models.Submission.objects.filter(id=self.submission_closed.id).update(
            created_at=dec_date, updated_at=dec_date
        )

    def test_submissions_list_has_paginated_shape_and_annotated_fields(self):
        response = self.client.get(reverse("submission-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()

        self.assertIn("count", payload)
        self.assertIn("results", payload)
        self.assertGreaterEqual(payload["count"], 2)
        self.assertGreaterEqual(len(payload["results"]), 2)

        first_row = payload["results"][0]
        self.assertIn("documentCount", first_row)
        self.assertIn("noteCount", first_row)
        self.assertIn("latestNote", first_row)

    def test_submissions_list_filters_by_status(self):
        response = self.client.get(
            reverse("submission-list"), {"status": models.Submission.Status.CLOSED}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        result_ids = {row["id"] for row in results}
        self.assertEqual(len(results), 2)
        self.assertIn(self.submission_closed.id, result_ids)
        self.assertIn(self.submission_closed_same_summary.id, result_ids)

    def test_submissions_list_filters_by_broker_id(self):
        response = self.client.get(
            reverse("submission-list"), {"brokerId": self.broker_alpha.id}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], self.submission_new.id)

    def test_submissions_list_filters_by_company_search(self):
        response = self.client.get(reverse("submission-list"), {"companySearch": "acme"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["company"]["legalName"], "Acme Holdings")

    def test_submissions_list_filters_by_created_from_and_to(self):
        response = self.client.get(
            reverse("submission-list"),
            {"createdFrom": "2026-01-01", "createdTo": "2026-01-31"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], self.submission_new.id)

    def test_submissions_list_orders_by_document_count_desc(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "-documentCount"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(results[0]["id"], self.submission_new.id)

    def test_submissions_list_orders_by_company_asc(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "company"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(results[0]["company"]["legalName"], "Acme Holdings")

    def test_submissions_list_orders_by_status_desc(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "-status"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(results[0]["id"], self.submission_closed.id)

    def test_submissions_list_orders_by_summary_asc(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "summary"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(results[0]["id"], self.submission_closed.id)

    def test_submissions_list_orders_by_summary_uses_id_tie_breaker(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "summary"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        result_ids = [row["id"] for row in response.json()["results"]]

        lower_id = min(self.submission_closed.id, self.submission_closed_same_summary.id)
        higher_id = max(self.submission_closed.id, self.submission_closed_same_summary.id)
        self.assertLess(result_ids.index(lower_id), result_ids.index(higher_id))

    def test_submissions_list_orders_by_summary_desc_uses_id_tie_breaker(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "-summary"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        result_ids = [row["id"] for row in response.json()["results"]]

        lower_id = min(self.submission_closed.id, self.submission_closed_same_summary.id)
        higher_id = max(self.submission_closed.id, self.submission_closed_same_summary.id)
        self.assertLess(result_ids.index(lower_id), result_ids.index(higher_id))

    def test_submissions_list_orders_by_updated_at_desc(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "-updatedAt"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(results[0]["id"], self.submission_closed.id)

    def test_submissions_list_orders_by_priority_asc(self):
        response = self.client.get(reverse("submission-list"), {"ordering": "priority"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.json()["results"]
        self.assertEqual(results[0]["id"], self.submission_new.id)

    def test_submission_detail_includes_related_sections(self):
        response = self.client.get(
            reverse("submission-detail", args=[self.submission_new.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()

        self.assertEqual(payload["id"], self.submission_new.id)
        self.assertEqual(len(payload["contacts"]), 1)
        self.assertEqual(len(payload["documents"]), 1)
        self.assertEqual(len(payload["notes"]), 1)

    def test_submission_detail_returns_404_for_unknown_id(self):
        response = self.client.get(reverse("submission-detail", args=[999999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_submission_detail_allows_has_documents_filter_query_param(self):
        response = self.client.get(
            reverse("submission-detail", args=[self.submission_new.id]),
            {"hasDocuments": "true"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["id"], self.submission_new.id)

    def test_submission_detail_ignores_annotation_only_ordering(self):
        response = self.client.get(
            reverse("submission-detail", args=[self.submission_new.id]),
            {"ordering": "status"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["id"], self.submission_new.id)


class BrokerApiTests(APITestCase):
    def setUp(self):
        self.owner = models.TeamMember.objects.create(
            full_name="Owner", email="owner@example.com"
        )
        self.company = models.Company.objects.create(
            legal_name="Company", industry="Tech", headquarters_city="Berlin"
        )
        # Build enough brokers to prove endpoint is not paginated.
        for index in range(12):
            broker = models.Broker.objects.create(
                name=f"Broker {index}", primary_contact_email=f"broker{index}@example.com"
            )
            models.Submission.objects.create(
                company=self.company,
                broker=broker,
                owner=self.owner,
                status=models.Submission.Status.NEW,
                priority=models.Submission.Priority.MEDIUM,
                summary=f"Submission {index}",
            )

    def test_brokers_endpoint_returns_non_paginated_array(self):
        response = self.client.get(reverse("broker-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.json()
        self.assertIsInstance(payload, list)
        self.assertEqual(len(payload), 12)
