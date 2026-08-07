FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11

RUN apt-get update \
 && apt-get install -y ffmpeg \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

ENV WEB_CONCURRENCY=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY ./app /app
