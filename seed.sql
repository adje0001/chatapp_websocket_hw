-- Testdata til chat-databasen.
-- Kør den EFTER første start af appen, så TypeORM har lavet tabellerne.
-- OBS: Tømmer tabellerne først, så alt eksisterende data forsvinder.

TRUNCATE messages, thread_participants, threads, users RESTART IDENTITY CASCADE;

INSERT INTO users (username) VALUES ('adam'), ('sofie'), ('oliver');

INSERT INTO threads (title) VALUES ('Generelt'), ('Eksamensprojekt');

-- Many-to-many: hvem er med i hvilke tråde
INSERT INTO thread_participants (thread_id, user_id) VALUES
  (1, 1), (1, 2), (1, 3),
  (2, 1), (2, 2);

-- Many-to-one: hver besked har én forfatter og én tråd
INSERT INTO messages (content, author_id, thread_id) VALUES
  ('Hej allesammen!', 1, 1),
  ('Hej Adam', 2, 1),
  ('Er der nogen der har styr på TypeORM?', 3, 1),
  ('Skal vi mødes på tirsdag?', 1, 2),
  ('Ja, kl. 10 passer mig fint', 2, 2);
