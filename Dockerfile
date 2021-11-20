FROM node:14-alpine
COPY dist/ .
CMD [ "node", "bundle.js" ]
