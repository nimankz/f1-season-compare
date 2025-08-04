# Formula1 Compair

## Fetching Data:
For fetching data, I use free api:
`https://api.openf1.org/v1`

Data about `Drivers`, `Races` and `Results`, would be gotten.

## Data Insertion:
Data would be inserted in database with prisma orm.
You can see the diagrams to take a look of what does each table have.
To have it generate:
```npm
    npx prisma generate
```
It would be saved in `generated/` directory.


## SQL queries:
There is the Queries which in this project asked for in `sql/` directory.


## Running Project:

for running project as developer:
- first make `.env` file and give your database address:
    `DATABASE_URL="mysql://username:password@localhost:3306/f1db"`


- then run these commands:
```npm
    npm run reset-db
    npm run dev
```

and then run sql queries.
```npm
    npx prisma db execute --file ./path/to/your/migration.sql --schema prisma/schema.prisma
    // it's better if you use smothing more visual to see these queries.
```

---

Hope you have a greate time with this project.

design and code: nimankz


