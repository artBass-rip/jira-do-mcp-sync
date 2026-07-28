FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY grouping.config.json ./grouping.config.json
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV PORT=8080 CONFIG_PATH=/app/grouping.config.json MCP_URL=http://gateway:8080/mcp
EXPOSE 8080
CMD ["node", "src/server.mjs"]
