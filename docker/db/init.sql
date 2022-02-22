CREATE TABLE "accounts" (
  "userId" SERIAL NOT NULL,
  "firstName" varchar(30) NOT NULL,
  "lastName" varchar(30) NOT NULL,
  "email" varchar(50) NOT NULL,
  "password" varchar(30) NOT NULL,
  PRIMARY KEY ("userId")
  UNIQUE ("email"),
);

CREATE TABLE "entries" (
  "userId" SERIAL NOT NULL,
  "entryId" SERIAL NOT NULL,
  "promptText" text NOT NULL,
  "promptId" SERIAL NOT NULL,
  "topic" varchar(30) NOT NULL,
  "text" text NOT NULL,
  "date" timestamptz NOT NULL,
  PRIMARY KEY ("entryId"),
  FOREIGN KEY ("userId") REFERENCES "accounts" ("userId")
);

CREATE TABLE "prompts" (
  "promptId" SERIAL NOT NULL,
  "promptText" text NOT NULL,
  "topicId" SERIAL NOT NULL,
  PRIMARY KEY ("promptId"),
  FOREIGN KEY ("topicId") REFERENCES "topics" ("topicId")
);

CREATE TABLE "topics" (
  "topicId" SERIAL NOT NULL,
  "topicText" varchar(30),
  PRIMARY KEY ("topicId")
);


-- CREATE INDEX "tasks_account_id" ON "tasks" ("account_id");
-- CREATE INDEX "tasks_due_date" ON "tasks" ("account_id", "due_date");
-- CREATE INDEX "tasks_completed" ON "tasks" ("account_id", "completed");