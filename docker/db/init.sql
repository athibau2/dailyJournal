CREATE TABLE "accounts" (
  "userid" SERIAL NOT NULL,
  "firstname" varchar(30) NOT NULL,
  "lastname" varchar(30) NOT NULL,
  "email" varchar(60) NOT NULL,
  "password" varchar(200) NOT NULL,
  PRIMARY KEY ("userid"),
  UNIQUE ("email")
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
)
WITH (OIDS=FALSE);
CREATE INDEX "IDX_session_expire" ON "session" ("expire");


CREATE TABLE "entries" (
  "userid" SERIAL NOT NULL,
  "entryid" SERIAL NOT NULL,
  "prompttext" text NOT NULL,
  "promptid" SERIAL NOT NULL,
  "topicid" varchar(30) NOT NULL,
  "text" text NOT NULL,
  "date" timestamptz NOT NULL,
  PRIMARY KEY ("entryid"),
  FOREIGN KEY ("userid") REFERENCES "accounts" ("userid")
);
CREATE INDEX "entry_topic" ON "entries" ("topicid");


CREATE TABLE "topics" (
  "topicid" SERIAL NOT NULL,
  "topictext" varchar(30),
  PRIMARY KEY ("topicid")
);


CREATE TABLE "prompts" (
  "promptid" SERIAL NOT NULL,
  "prompttext" text NOT NULL,
  "topicid" SERIAL NOT NULL,
  PRIMARY KEY ("promptid"),
  FOREIGN KEY ("topicid") REFERENCES "topics" ("topicid")
);



