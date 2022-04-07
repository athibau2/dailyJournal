CREATE TABLE "accounts" (
  "userid" SERIAL NOT NULL,
  "firstname" varchar(30) NOT NULL,
  "lastname" varchar(30) NOT NULL,
  "username" varchar(60) NOT NULL UNIQUE,
  "password" varchar(200) NOT NULL,
  PRIMARY KEY ("userid")
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
)
WITH (OIDS=FALSE);
CREATE INDEX "IDX_session_expire" ON "session" ("expire");


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
CREATE INDEX "random_prompt" ON "prompts" ("promptid");


CREATE TABLE "active_prompt" (
	"promptid" INTEGER NOT NULL,
	"userid" SERIAL NOT NULL,
	"dateadded" TEXT NOT NULL,
	FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);


CREATE TABLE "entries" (
  "entryid" SERIAL NOT NULL,
  "text" text NOT NULL,
  "date" timestamp NOT NULL,
  "promptid" INTEGER NOT NULL,
  "userid" SERIAL NOT NULL,
  PRIMARY KEY ("entryid"),
  FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);
create index "entries_userid" ON "entries" ("userid");


CREATE TABLE "shared_entries" (
	"entryid" SERIAL NOT NULL,
	"userid" SERIAL NOT NULL,
	"owner" SERIAL NOT NULL,
	FOREIGN KEY ("entryid") REFERENCES "entries" ("entryid") ON DELETE CASCADE,
	FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE,
	FOREIGN KEY ("userid") REFERENCES "accounts" ("userid") ON DELETE CASCADE
);
create index "shared_entries_userid" ON "shared_entries" ("userid");


INSERT INTO topics (topictext) values('Gratitude');
INSERT INTO topics (topictext) values('Goals');
INSERT INTO topics (topictext) values('Self-awareness');


INSERT INTO prompts (topicid, prompttext) values(2, 'Describe 3 things that are on your bucket list.');
INSERT INTO prompts (topicid, prompttext) values(2, 'What do you hope to accomplish this week?');
INSERT INTO prompts (topicid, prompttext) values(3, 'What is your biggest motivator right now and why?');
INSERT INTO prompts (topicid, prompttext) values(3, 'Is there anything about your current mindset you want to change? Why or why not?');
INSERT INTO prompts (topicid, prompttext) values(1, 'Name three good things about your life today.');
INSERT INTO prompts (topicid, prompttext) values(1, 'Describe someone in your life you are grateful for right now and why.');
INSERT INTO prompts (topicid, prompttext) values(1, 'Explain something you have learned recently that you are grateful for.');

