package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jobearz/furi/config"
	"github.com/jobearz/furi/internal/model"
	"github.com/jobearz/furi/internal/store"
	"golang.org/x/crypto/bcrypt"
)

type AuthorizationHandler struct {
	store store.SongStore
}

func NewAuthorizationHandler(s store.SongStore) *AuthorizationHandler {
	return &AuthorizationHandler{store: s}
}

func (h *AuthorizationHandler) Register(w http.ResponseWriter, r *http.Request) {
	var UserRequestBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// decode email and password from request body
	if err := json.NewDecoder(r.Body).Decode(&UserRequestBody); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	email := UserRequestBody.Email
	password := UserRequestBody.Password

	// hash the password using bcrypt
	hashPassword := func(password string) (string, error) {
		bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "failed to hash password", http.StatusInternalServerError)
			return "", err
		}
		return string(bytes), err
	}

	var hashedPassword string
	hashedPassword, _ = hashPassword(password)

	// create new user with the hashed password
	user := model.User{
		Email:    email,
		Password: hashedPassword,
	}

	newUser, err := h.store.CreateUser(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	newUser.Email = email
	newUser.Password = hashedPassword

	// return 201 with the user (excluding the password)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newUser)
}

func (h *AuthorizationHandler) Login(w http.ResponseWriter, r *http.Request) {
	var UserRequestBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// decode email + password from body
	if err := json.NewDecoder(r.Body).Decode(&UserRequestBody); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// get user by email
	user, err := h.store.GetUserByEmail(UserRequestBody.Email)
	if err != nil {
		http.Error(w, "user not found", http.StatusUnauthorized)
		return
	}
	// compare password with hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(UserRequestBody.Password)); err != nil {
		http.Error(w, "password does not match hashed password", http.StatusUnauthorized)
		return
	}

	// if matches, return the generated jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString([]byte(config.JWTSecret()))
	if err != nil {
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}
