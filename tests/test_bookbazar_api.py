import json
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pytest

BASE_URL = "http://127.0.0.1:3000"


def api_request(path, method="GET", payload=None):
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = Request(
        f"{BASE_URL}{path}",
        data=data,
        headers=headers,
        method=method,
    )
    return urlopen(request, timeout=15)


def api_json(path, method="GET", payload=None):
    with api_request(path, method, payload) as response:
        body = response.read().decode("utf-8")
        return response.status, json.loads(body)


@pytest.fixture(scope="session")
def base_url():
    """Reusable test setup for the running BookBazar server."""
    return BASE_URL


@pytest.fixture
def authenticated_session():
    """Placeholder fixture for future authenticated integration tests.

    Current tests intentionally avoid creating or modifying database records.
    """
    return {"authenticated": False}


# 5.1 Basic assertions

def test_unauthenticated_user_is_rejected(base_url):
    with pytest.raises(HTTPError) as exc_info:
        api_request("/api/auth/me")

    assert exc_info.value.code == 401
    payload = json.loads(exc_info.value.read().decode("utf-8"))
    assert payload["success"] is False
    assert payload["error"] == "Not authenticated."


def test_books_get_returns_valid_api_envelope(base_url):
    status, payload = api_json("/api/books")

    assert status == 200
    assert payload["success"] is True
    assert "data" in payload
    assert "books" in payload["data"]
    assert isinstance(payload["data"]["books"], list)


# 5.2 Exception testing (pytest.raises)

def test_cart_requires_authentication(base_url):
    with pytest.raises(HTTPError) as exc_info:
        api_request("/api/cart")

    assert exc_info.value.code == 401


def test_orders_requires_authentication(base_url):
    with pytest.raises(HTTPError) as exc_info:
        api_request("/api/orders")

    assert exc_info.value.code == 401


# 5.3 Fixture / setup isolation

def test_fixture_state_is_fresh(authenticated_session):
    authenticated_session["temporary_value"] = "test-only"
    assert authenticated_session["temporary_value"] == "test-only"


def test_fixture_state_does_not_leak(authenticated_session):
    assert "temporary_value" not in authenticated_session


# 5.4 Parameterized testing

@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"email": ""},
        {"password": ""},
        {"email": "user@example.com"},
    ],
)
def test_login_rejects_missing_credentials(base_url, payload):
    with pytest.raises(HTTPError) as exc_info:
        api_request("/api/auth/login", "POST", payload)

    assert exc_info.value.code == 400


@pytest.mark.parametrize(
    "payload",
    [
        {"email": "invalid"},
        {"email": "user@"},
        {"email": "@example.com"},
        {"email": "user@example"},
    ],
)
def test_forgot_password_rejects_invalid_email(base_url, payload):
    with pytest.raises(HTTPError) as exc_info:
        api_request("/api/auth/forgot-password", "POST", payload)

    assert exc_info.value.code == 422


@pytest.mark.parametrize(
    "payload",
    [
        {"email": "user@example.com", "otp": "12345"},
        {"email": "user@example.com", "otp": "1234567"},
        {"email": "user@example.com", "otp": "abcdef"},
        {"email": "invalid", "otp": "123456"},
    ],
)
def test_verify_otp_rejects_invalid_input(base_url, payload):
    with pytest.raises(HTTPError) as exc_info:
        api_request("/api/auth/verify-otp", "POST", payload)

    assert exc_info.value.code == 422
