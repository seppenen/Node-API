# Node-API

Create .env:

SALT= Number
SECRET= "String"

Create schema.prisma file:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./db.sqlite"
}

model UserModel {
  id          Int @id @default(autoincrement())
  name        String
  email       String
  password    String
}

run npx prisma migrate dev
run npm run generate

Ready!
