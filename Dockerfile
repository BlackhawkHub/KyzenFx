FROM node:15.1.0-alpine3.10 As builder

WORKDIR /usr/src/app

COPY package.json  ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build --prod

EXPOSE 4400

# Step 2: Use build output from 'builder'
FROM nginx:stable-alpine
LABEL version="1.0"

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/remit-client-ui/ .