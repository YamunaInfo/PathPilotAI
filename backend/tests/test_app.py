from app import app


def test_health_check():
    client = app.test_client()
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True


def test_process_catalog_includes_rich_process_details():
    client = app.test_client()
    response = client.get('/api/processes')
    assert response.status_code == 200
    data = response.get_json()
    processes = data['processes']
    assert len(processes) >= 8

    driving = next((process for process in processes if process['name'] == 'Driving Licence'), None)
    assert driving is not None
    assert driving['id'] == 'driving-licence'
    assert driving['officialWebsite']
    assert driving['requiredDocuments']
    assert driving['applicationSteps']
    assert driving['faqs']
    assert driving['estimatedProcessingTime']

    ids = {process['id'] for process in processes}
    assert 'passport' not in ids
    assert 'income-certificate' not in ids
