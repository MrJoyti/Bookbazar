# BookBazar PyTest Tests

These tests are black-box API tests against the running BookBazar Next.js server.
They intentionally avoid creating or deleting database records.

## Run

1. Start BookBazar in one terminal:

```bash
npm run dev
```

2. In a second terminal:

```bash
python -m pytest -v tests/test_bookbazar_api.py
```

The tests expect BookBazar at `http://127.0.0.1:3000`.
