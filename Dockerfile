FROM mcr.microsoft.com/playwright:v1.17.1-focal

USER root
RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install