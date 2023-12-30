# Getting Started

To get started, you need Docker, docker-compose and git setup on your machine. For Docker basics and best practices. Refer Docker [documentation](http://docs.docker.com).
After that, clone this repo:

```sh
git https://github.com/farleycanve/testing-be.git
cd testing-be
docker-compose  up -d --force-recreate --no-deps --build
```

please copy .env.example to .env.production
add The url of database (mongodb) at MONGO_URI
Wait for 1 minutes for app running on 6868
