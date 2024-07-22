# Remix Social Media
### Simple social media site built with Remix

## Local Development

The simplest way to run this app locally is with Docker Compose:

```shellscript
docker compose up
```

To create fake data to test with, open the node.js container with `docker exec` and run:

```shellscript
npm run init-data
```

## Local Development
This app was built entirely with remix loaders and actions directly querying a MySQL database with Drizzle ORM.
