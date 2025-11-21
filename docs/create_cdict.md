# create dict
```sql
CREATE TABLE "cdict" (
"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
"word" VARCHAR(64) COLLATE NOCASE NOT NULL UNIQUE,
"phonetic" VARCHAR(64),
"translation" TEXT,
"tag" VARCHAR(64),
"bnc" INTEGER DEFAULT(NULL),
"frq" INTEGER DEFAULT(NULL),
"exchange" TEXT
);



CREATE UNIQUE INDEX "cdict_1" ON cdict (id);
CREATE UNIQUE INDEX "cdict_2" ON cdict (word);
CREATE INDEX "sd_1" ON cdict (word collate nocase);
```


# query word
```sql
SELECT * FROM cdict WHERE word like 'have' or exchange like '%:have/%' limit 2;
SELECT * FROM cdict WHERE exchange like '%:had/%';
```