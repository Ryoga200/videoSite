package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/x-color/simple-webapp/handler"
)

func newRouter() *echo.Echo {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.Static("/assets", "public/assets")

	e.File("/", "public/index.html")        // GET /
	e.File("/signup", "public/signup.html") // GET /signup
	e.POST("/signup", handler.Signup)       // POST /signup
	e.File("/login", "public/login.html")   // GET /login
	e.POST("/login", handler.Login)         // POST /login
	e.File("/todos", "public/todos.html")   // GET /todos

	api := e.Group("/api")
	api.Use(middleware.JWTWithConfig(handler.Config))   // /api 下はJWTの認証が必要
	api.GET("/todos", handler.GetTodos)                 // GET /api/todos
	api.POST("/todos", handler.AddTodo)                 // POST /api/todos
	api.DELETE("/todos/:id", handler.DeleteTodo)        // DELETE /api/todos/:id
	api.PUT("/todos/:id/completed", handler.UpdateTodo) // PUT /api/todos/:id/completed

	return e
}
