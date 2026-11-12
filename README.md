# Chatapp

NestJS + TypeORM + PostgreSQL. Tre entities, der viser alle relationstyper:

| Relation | Hvor | Betyder |
| --- | --- | --- |
| One-to-many | `User.messages`, `Thread.messages` | En user skriver mange beskeder. En tråd har mange beskeder |
| Many-to-one | `Message.author`, `Message.thread` | Hver besked har én forfatter og hører til én tråd |
| Many-to-many | `Thread.participants` / `User.threads` | En tråd har mange deltagere, og en user er med i mange tråde |

Many-to-many gemmes i join-tabellen `thread_participants`. Den laves af `@JoinTable` på `Thread`.

## Kom i gang

```
createdb chat
npm install
npm run start:dev
```

TypeORM laver selv tabellerne ved første start (`synchronize: true`). Fyld derefter testdata i:

```
psql chat -f seed.sql
```

Database-login ligger i `.env` (se `.env.example`).

## Routes

| Metode | URL | |
| --- | --- | --- |
| GET | `/users` | Alle users |
| GET | `/users/:id` | En user med beskeder og tråde |
| POST / PATCH / DELETE | `/users`, `/users/:id` | CRUD |
| GET | `/threads` | Alle tråde med deltagere |
| GET | `/threads/:id` | En tråd med deltagere og beskeder |
| POST / PATCH / DELETE | `/threads`, `/threads/:id` | CRUD. `participantIds` sætter deltagere |
| POST / DELETE | `/threads/:id/participants/:userId` | Tilføj eller fjern en deltager |
| GET | `/messages?threadId=1` | Beskeder, evt. kun fra én tråd |
| GET | `/messages/:id` | En besked med forfatter og tråd |
| POST / PATCH / DELETE | `/messages`, `/messages/:id` | CRUD. Den der skriver, bliver automatisk deltager |

Alle requests ligger klar i Bruno-kollektionen i `bruno/chatapp`.

## WebSockets

`ChatGateway` lytter på samme port som API'et.

- Klienten sender `joinThread` (eller `leaveThread`) med et tråd-id.
- Når en besked oprettes via `POST /messages`, sender serveren `newMessage` til alle, der følger tråden.

Åbn http://localhost:3000 i to faner, vælg forskellige users og skriv. Beskederne dukker op i begge faner med det samme.
