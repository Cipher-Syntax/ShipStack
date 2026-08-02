from celery import shared_task
from time import sleep
from .models import SoftwarePackage

@shared_task
def scan_package_for_malware(package_id):
    try:
        package = SoftwarePackage.objects.get(id=package_id)
    except SoftwarePackage.DoesNotExist:
        return "Package not found."

    # Simulate scanning process
    sleep(3)

    filename = package.file.name.lower()
    
    if "virus" in filename or "eicar" in filename:
        package.scan_status = SoftwarePackage.ScanStatusChoices.FAILED
        package.scan_results = "Malware detected in file signature."
    else:
        package.scan_status = SoftwarePackage.ScanStatusChoices.PASSED
        package.scan_results = "No malware detected."
        
    package.save()
    return f"Scan completed for package {package_id}: {package.scan_status}"
