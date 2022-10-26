FROM node:16.16.0

RUN apt-get update && apt-get -y install git && rm -rf /var/lib/apt/lists/*

COPY ./ /make-sense

RUN cd /make-sense && \
  npm install

WORKDIR /make-sense

ENTRYPOINT ["npm", "run", "dev"]
