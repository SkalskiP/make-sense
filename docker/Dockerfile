FROM node:16.16.0

# Accept build arguments for user creation
ARG USRNM=developer
ARG USRUID=1000
ARG USRGID=1000

# Create group and user with specified UID/GID
RUN groupadd --gid ${USRGID} ${USRNM} || true && \
    useradd --uid ${USRUID} --gid ${USRGID} -m -s /bin/bash ${USRNM} || true

# Create app directory
RUN mkdir -p /app && chown ${USRUID}:${USRGID} /app

# Copy package files and install dependencies as root
COPY package.json package-lock.json* /app/
RUN cd /app && npm install && chown -R ${USRUID}:${USRGID} /app/node_modules

# Switch to non-root user
USER ${USRNM}

WORKDIR /app

# Expose development server port
EXPOSE 3000

CMD ["/bin/bash"]
