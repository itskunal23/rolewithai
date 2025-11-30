.PHONY: install test run docker-up docker-down clean

install:
	pip install -r requirements.txt
	python -m spacy download en_core_web_sm

test:
	pytest tests/ -v

test-cov:
	pytest tests/ --cov=app --cov-report=html

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

clean:
	find . -type d -name __pycache__ -exec rm -r {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf htmlcov
	rm -rf .coverage

lint:
	flake8 app/ tests/ --max-line-length=120 --exclude=__pycache__

format:
	black app/ tests/
	isort app/ tests/

