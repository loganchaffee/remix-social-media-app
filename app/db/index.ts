import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
});

export const db = drizzle(connection);
