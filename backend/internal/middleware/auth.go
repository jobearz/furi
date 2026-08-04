package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jobearz/furi/config"
)

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// get token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing token", http.StatusUnauthorized)
			return
		}
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		// parse and identify the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			secret := config.JWTSecret()
			return []byte(secret), nil
		})
		// if invalid, return 401 and stop
		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}
		// if valid, call next(w, r) to the actual handler
		next(w, r)
	}
}
