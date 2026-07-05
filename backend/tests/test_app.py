from app import app


def test_health_check():
    client = app.test_client()
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
