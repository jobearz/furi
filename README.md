
# Furi

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

**[🔗 Live Demo](furidance.app)**

A structured choreography learning app for dancers. Break songs into sections, drill timestamps, track mastery over time.

## Features

- Practice with any choreography video available on YouTube
- Drill sections of choreography based on timestamps
- Different mastery levels to track your progress on a choreography
- Heatmap to visually display each day a practice session was completed


## Screenshots

![App Screenshot](https://i.postimg.cc/T1SjXyB6/Screenshot-2026-08-15-095014.png)
![App Screenshot](https://i.postimg.cc/D0DQKWR3/Screenshot-2026-08-15-100420.png)
![App Screenshot](https://i.postimg.cc/PJcbkL0h/Screenshot-2026-08-15-100921.png)

## Tech Stack

**Client:** React, Typescript

**Server:** Go, PostgreSQL, Docker, AWS

## Running Locally

### Prerequisites
- Go 1.22+
- Node.js 20+
- Docker Desktop

### With Docker (recommended)

```bash
git clone https://github.com/jobearz/furi.git
cd furi
docker-compose up --build
```

Frontend: http://localhost  
Backend: http://localhost:8080

### Without Docker

**Backend**
```bash
cd backend
go run cmd/server/main.go
```

Requires PostgreSQL running locally. Set `DATABASE_URL` environment variable:
```DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/furi?sslmode=disable```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env`:
```VITE_API_URL=http://localhost:8080```
## Support

If you need help:

- Check the [Issues](https://github.com/jobearz/furi/issues) currently open
- [Report a bug](https://github.com/jobearz/furi/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/jobearz/furi/issues/new?template=feature_request.md)

## Roadmap
- [x] User profile pages
- [ ] Shareable song libraries between users
- [ ] Thumbnail previews on song list page
- [ ] Session notes and self-rating between practices

## License

MIT License — see [LICENSE](LICENSE) for details.
