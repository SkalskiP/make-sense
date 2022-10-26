FROM node:16.16.0

RUN apt-get update && apt-get -y install git && rm -rf /var/lib/apt/lists/*

RUN mkdir /workspace && \
  cd /workspace && \
  git clone https://github.com/SkalskiP/make-sense.git && \
  cd make-sense && \
  npm install

WORKDIR /workspace/make-sense

ENTRYPOINT ["npm", "start"]
