package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type User struct {
	name, email, password string
	id                    int
}

type VideoTitle struct {
	Title string `json:"title"`
	Id    int    `json:"id"`
}

func main() {
	// インスタンスを作成
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}))
	// ログイン処理

	e.POST("/login", login)
	e.POST("/signup", signup)
	e.POST("/userSearch", userSearch)
	e.POST("/videoUpload", videoUpload)
	e.GET("/video", video)
	e.POST("/videoSearch", videoSearch)
	e.GET("/videoInd/:id", videoInd)
	e.File("/vd", "file/1.mp4")
	e.Start(":8000")
}

// ハンドラーを定義
func login(c echo.Context) error {
	email := c.FormValue("email")
	password := c.FormValue("password")

	db, err := sql.Open("mysql", "root:root@tcp(mysql_container)/react-go-app")
	if err != nil {
		log.Fatalf("main sql.Open error err:%v", err)
	}
	rows, err := db.Query("select id,name,email,password from users where email = ?", email)
	if err != nil {
		//log.Fatal(err)
	}
	var userdata User
	for rows.Next() {
		err := rows.Scan(&userdata.id, &userdata.name, &userdata.email, &userdata.password)
		if err != nil {
			//log.Fatal(err)
		}
		fmt.Printf("ID: %d, Name: %s, Email: %s, Ps: %s\n", userdata.id, userdata.name, userdata.email, userdata.password)
	}
	defer db.Close()
	// username, passwordの確認
	if email == "" || password != userdata.password {
		//return echo.ErrUnauthorized
		return c.JSON(http.StatusOK, echo.Map{
			"message": "エラーです",
		})
	}

	// ペイロードの作成
	claims := jwt.MapClaims{
		"user_id": 12345678,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	// トークン生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// トークンに署名を付与
	tokenString, err := token.SignedString([]byte("SECRET_KEY"))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": tokenString,
		"id":    userdata.id,
	})
}
func signup(c echo.Context) error {
	name := c.FormValue("name")
	email := c.FormValue("email")
	password := c.FormValue("password")
	db, err := sql.Open("mysql", "root:root@tcp(mysql_container)/react-go-app")
	if err != nil {
		log.Fatalf("main sql.Open error err:%v", err)
	}
	rows, err := db.Query("select id,name,email,password from users where email = ?", email)
	if err != nil {
		//log.Fatal(err)
	}
	var userdata User
	for rows.Next() {
		err := rows.Scan(&userdata.id, &userdata.name, &userdata.email, &userdata.password)
		if err != nil {
			//log.Fatal(err)
		}
		fmt.Printf("ID: %d, Name: %s, Email: %s, Ps: %s\n", userdata.id, userdata.name, userdata.email, userdata.password)
	}
	if userdata.password == "" && userdata.name == "" {
		in, err := db.Prepare("insert into users (name,email,password) values (?, ?,?);")

		if err != nil {
			fmt.Println("データベース接続失敗")
			panic(err.Error())
		} else {
			fmt.Println("データベース接続成功")
		}

		defer db.Close()

		result, err := in.Exec(name, email, password)
		fmt.Printf("result:%d\n", result)

	}
	defer db.Close()
	return c.JSON(http.StatusOK, echo.Map{
		"email":    email,
		"password": password,
	})
}

func userSearch(c echo.Context) error {
	id := c.FormValue("id")
	fmt.Printf("id %s\n", id)
	id_int, _ := strconv.Atoi(id)
	db, err := sql.Open("mysql", "root:root@tcp(mysql_container)/react-go-app")
	if err != nil {
		log.Fatalf("main sql.Open error err:%v", err)
	}
	rows, err := db.Query("select id,name,email from users where id = ?", id_int)
	if err != nil {
		log.Fatal(err)
	}
	var userdata User

	for rows.Next() {
		err := rows.Scan(&userdata.id, &userdata.name, &userdata.email)
		if err != nil {
			//log.Fatal(err)
		}
		fmt.Printf("ID: %d, Name: %s, Email: %s\n", userdata.id, userdata.name, userdata.email)
	}
	defer db.Close()
	return c.JSON(http.StatusOK, echo.Map{
		"id":    userdata.id,
		"name":  userdata.name,
		"email": userdata.email,
	})
}

func videoUpload(c echo.Context) error {
	id := c.FormValue("id")
	title := c.FormValue("title")
	file, err := c.FormFile("video")
	if err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	src, err := file.Open()
	if err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	defer src.Close()

	db, err := sql.Open("mysql", "root:root@tcp(mysql_container)/react-go-app")
	if err != nil {
		log.Fatalf("main sql.Open error err:%v", err)
	}
	rows, err := db.Query("select max(id) from videos;")
	if err != nil {
		log.Fatal(err)
	}
	var video_id int

	for rows.Next() {
		err := rows.Scan(&video_id)
		if err != nil {
			//log.Fatal(err)
		}
		fmt.Printf("%d", video_id)
	}
	fileModel := strings.Split(file.Filename, ".")
	//fileName := fileModel[0]
	extension := fileModel[1]
	dst, err := os.Create(fmt.Sprintf("file/%d.%s", video_id+1, extension))
	if err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		fmt.Printf("%s\n", err)
		return err
	}
	fmt.Printf("oookkk")

	in, err := db.Prepare("insert into videos (title,userid,ext) values (?, ?,?);")

	if err != nil {
		fmt.Println("データベース接続失敗")
		panic(err.Error())
	} else {
		fmt.Println("データベース接続成功")
	}

	defer db.Close()

	result, err := in.Exec(title, id, extension)
	fmt.Printf("result:%d\n", result)

	defer db.Close()
	return c.JSON(http.StatusOK, echo.Map{
		"id": id,
	})
}
func video(c echo.Context) error {
	db, err := sql.Open("mysql", "root:root@tcp(mysql_container)/react-go-app")
	if err != nil {
		log.Fatalf("main sql.Open error err:%v", err)
	}
	rows, err := db.Query("select id,title from videos")
	if err != nil {
		//log.Fatal(err)
	}
	var id int
	var title string
	data := []VideoTitle{}
	for rows.Next() {
		err := rows.Scan(&id, &title)
		if err != nil {
			//log.Fatal(err)
		}
		tmp_data := VideoTitle{Title: title, Id: id}
		data = append(data, tmp_data)
		fmt.Printf("id%d title%s\n", tmp_data.Id, tmp_data.Title)
		fmt.Println(tmp_data)
	}
	json_data, _ := json.Marshal(data)
	fmt.Printf("id%d title%s\n", data[0].Id, data[0].Title)
	fmt.Println(string(json_data))
	fmt.Println(data)
	return c.JSON(http.StatusOK, data)
}

func videoSearch(c echo.Context) error {
	id := c.FormValue("id")
	fmt.Printf("id %s\n", id)
	id_int, _ := strconv.Atoi(id)
	db, err := sql.Open("mysql", "root:root@tcp(mysql_container)/react-go-app")
	if err != nil {
		log.Fatalf("main sql.Open error err:%v", err)
	}
	rows, err := db.Query("select title,userid,ext from videos where id = ?", id_int)
	if err != nil {
		log.Fatal(err)
	}
	var userid string
	var title string
	var ext string

	for rows.Next() {
		err := rows.Scan(&title, &userid, &ext)
		if err != nil {
			//log.Fatal(err)
		}
		fmt.Printf("%s\n", title)
	}
	defer db.Close()
	return c.JSON(http.StatusOK, echo.Map{
		"title":  title,
		"userid": userid,
		"ext":    ext,
	})
}
func videoInd(c echo.Context) error {
	// id := c.FormValue("id")
	// ext := c.FormValue("ext")
	// file_name := "file/" + id + "." + ext
	name := c.Param("id")
	fmt.Printf("aaa\n")
	file_name := "file/" + name
	fmt.Printf("%s\n", file_name)
	return c.File(file_name)
	// return c.JSON(http.StatusOK, echo.Map{
	// 	"title":  "a",
	// 	"userid": "userid",
	// 	"ext":    "ext",
	// })

}
