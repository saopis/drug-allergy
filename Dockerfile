# ใช้ Node.js image เป็น base
FROM node:20-alpine

# ตั้ง timezone
ENV TZ=Asia/Bangkok

# ติดตั้ง tzdata และตั้ง timezone
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

# กำหนด Working Directory
WORKDIR /app

# คัดลอกไฟล์ที่จำเป็น
COPY package.json yarn.lock ./

# copy asset files to a backup location in image
# COPY ./assets ./assets-original

# ติดตั้ง dependencies
RUN yarn install

# ใช้ ARG เพื่อรับ NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# คัดลอกโค้ด (สำหรับ production เท่านั้น เพราะ dev จะใช้ mount)
COPY . .

# เปิดพอร์ต
EXPOSE 5002

CMD ["yarn", "start"]
