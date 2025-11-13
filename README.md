# CareValidate Blog Project

A simple blog platform built with Nuxt 3, GraphQL, Prisma, and SQLite for the CareValidate technical assessment.

## Tech Used
- Nuxt 3
- Apollo Server (GraphQL)
- Prisma ORM
- SQLite
- TypeScript

## Features
- GraphQL API for posts, authors, categories, and tags
- Prisma models and seed script
- Nuxt frontend with filtering, pagination, and dynamic routes
- Local and Vercel deployment setup

## Setup

### Install
yarn install

### Run Prisma Migration
npx prisma migrate dev

### Seed the Database
npx prisma db seed

### Start Dev Server
yarn dev

## GraphQL Endpoint
/api/graphql
