@echo off
net start postgresql-x64-18
go run cmd/server/main.go