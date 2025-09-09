FROM python:3.12-slim

RUN apt update && apt install -y make

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app ./app
COPY Makefile .

CMD ["make", "dev_run"]
