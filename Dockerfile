# 构建编译环境
FROM node AS builder

ADD . /build/
WORKDIR /build/
RUN ["npm","install"]
RUN ["npm","run","build"]

# 构建运行环境

FROM nginx
COPY --from=builder /build/dist /usr/share/nginx/html

