<p align="center">
  <a href="https://github.com/Yonom/Correctly"><img src="https://i.imgur.com/ublWou7.png" width=600></a>
  <br>
  <a href="https://github.com/Yonom/Correctly/blob/master/docs/README.md">frontend & backend</a> |
  <b>database</b>
</p>

## Contributing

Since our database schemas are versioned, you must create a new migration file for every change.
Migration files are .sql files placed under the `migrations` folder.
Read the `How To` section to learn more about this.

## How To

### Add a migration

Create a new file in `migrations` folder. Name it as such:

```V00__description_comes_here.sql```

Replace V00 with the version number. Set the version number to one above the current version. Not more, not less!

⚠ You need TWO underscores after the version number.

#### Create a table
Write a `CREATE TABLE` statement such as:

```sql
CREATE TABLE myTable (
  id SERIAL PRIMARY KEY,
  field1 VARCHAR(64) NOT NULL,
  field2 INTEGER NOT NULL,
  field3 BYTEA,
  field4 BOOL
);
```

#### Create a pull request

Once your edits are final, make a pull request. After the review, your changes will be pushed to master and deployed to the live database!

### Edit a migration

**Important:**  
As long as your changes are not in `master`, you can alter your migration file as often as you like.  
Once a pull request is merged to `master`, no further changes to a migration is allowed and will fail.

#### Edit a table
To edit a table already created, make a new migration:
```sql
ALTER TABLE myTable ADD COLUMN field5 DATE NOT NULL;  -- add a column
ALTER TABLE myTable DROP COLUMN field3;  -- drop a column
ALTER TABLE myTable ALTER COLUMN field4 VARCHAR(64); -- change a column's data type
```

#### Drop a table
To drop a table already created, make a new migration:
```sql
DROP TABLE myTable;
```

### Use the correct type

Using the types mentioned below is RECOMMENDED.

- **id:** use `SERIAL PRIMARY KEY` (auto incrementing primary key)
- **string:** use `VARCHAR(n)`, it is a good idea to limit the size to a reasonable value
- **number:** use `INTEGER`, `FLOAT` or `NUMERIC(precision, scale)`
- **boolean:** use `BOOLEAN`
- **binary:** use `BYTEA`
- **date & time:** use `DATE`, `TIME`, `TIMESTAMPTZ` (date + time) or `INTERVAL`
- **array:** add `[]` to the end of the type, such as `INTEGER[]`
- advanced use cases
  - **json:** use `JSONB`
  - **uuid:** use `UUID`
  - **ip address:** use `INET`

### Test a configuration

Push a commit to a branch. You can then navigate to the CI/CD page.  

<img src="https://i.imgur.com/xxbYsJD.png" width="500">

On this page, you can see any build errors if any have occured.  
By navigating to the overview page (see screenshot), you can download the generated artifact, which contains an ER diagram of the database.  

<img src="https://i.imgur.com/y8WujyG.png" width="600">
