from django.core.exceptions import ValidationError
from django.db import transaction
from .models import SoftwareRequest, RequestProposal

def accept_proposal(proposal, request_user):
    """
    Accepts a proposal for a software request.
    Only the buyer of the request can accept a proposal.
    Changes request status to IN_PROGRESS.
    Changes accepted proposal status to ACCEPTED.
    Changes all other pending proposals for the same request to REJECTED.
    """
    software_request = proposal.request

    if software_request.buyer != request_user:
        raise ValidationError("Only the request owner can accept a proposal.")
    
    if software_request.status != SoftwareRequest.StatusChoices.OPEN:
        raise ValidationError("Can only accept proposals for open requests.")
        
    if proposal.status != RequestProposal.StatusChoices.PENDING:
        raise ValidationError("Can only accept pending proposals.")

    with transaction.atomic():
        # Update proposal status
        proposal.status = RequestProposal.StatusChoices.ACCEPTED
        proposal.save(update_fields=['status', 'updated_at'])

        # Reject all other pending proposals for this request
        software_request.proposals.filter(
            status=RequestProposal.StatusChoices.PENDING
        ).exclude(id=proposal.id).update(
            status=RequestProposal.StatusChoices.REJECTED
        )

        # Update request status
        software_request.status = SoftwareRequest.StatusChoices.IN_PROGRESS
        software_request.save(update_fields=['status', 'updated_at'])

    return proposal
