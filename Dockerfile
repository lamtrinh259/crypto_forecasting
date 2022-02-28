# FROM python:3.8.6-buster

# COPY . /app
# COPY requirements.txt requirements.txt

# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt

# CMD streamlit run app.py

FROM python:3.8.6-buster

WORKDIR /app
COPY requirements.txt ./requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app
ENTRYPOINT ["streamlit", "run"]
CMD ["app.py"]
