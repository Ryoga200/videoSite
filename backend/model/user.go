package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name" gorm:"unique;type:varchar(255);not null"`
	Password  string    `json:"password" gorm:"type:varchar(255);not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (p *User) FirstByName(name string) (tx *gorm.DB) {
	return DB.Where("name = ?", name).First(&p)
}

func (p *User) Create() (tx *gorm.DB) {
	return DB.Create(&p)
}
