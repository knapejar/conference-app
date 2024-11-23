# Prisma

A set of useful commands and tools

## Setup
Run a migration and create your database:
```bash
npx prisma migrate dev --name init
```

## Seed data

### Insert data	
Insert mock data (runs automatically after the migration, you should not need this):
```bash
npx prisma db seed
```

### Clean up
Clean up the seed data:
```bash
npx prisma migrate reset
```

## Visualize the schema
```bash
npx prisma studio
```
Or use this nice tool: [prisma-editor](https://prisma-editor.vercel.app/)
