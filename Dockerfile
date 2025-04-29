FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Install gunicorn
RUN pip install gunicorn

COPY . .

ENV PORT=8080

CMD ["gunicorn", "Project.wsgi:application", "--bind", "0.0.0.0:8080"]

