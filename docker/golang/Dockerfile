FROM golang:1.19.2
COPY ./backend /app/go
WORKDIR /app/go
RUN go get github.com/labstack/echo/v4
RUN go get github.com/labstack/echo/v4/middleware
RUN go get github.com/dgrijalva/jwt-go
RUN go install -tags mysql github.com/golang-migrate/migrate/v4/cmd/migrate@latest
#RUN go run server.go
CMD ["go","run","server.go"]
EXPOSE 8000
#RUN go build -o main .
#CMD [ "/app/go/main" ]
#CMD ["/app/go/go"," run"," main.go"]

#CMD ["go","run","/app/go/server.go"]