FROM python:3.8.6-buster

COPY app /crypto_forecasting
COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD streamlit run crypto_forecasting/app.py
