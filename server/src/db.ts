import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/synapse',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    // Create Requests Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id VARCHAR(255) PRIMARY KEY,
        "studentId" VARCHAR(255),
        "studentName" VARCHAR(255),
        section VARCHAR(255),
        "facultyId" VARCHAR(255),
        "facultyName" VARCHAR(255),
        subject VARCHAR(255),
        concern VARCHAR(255),
        mode VARCHAR(255),
        description TEXT,
        "preferredDate" VARCHAR(255),
        "preferredTime" VARCHAR(255),
        duration INTEGER,
        "hasDeadline" BOOLEAN,
        deadline VARCHAR(255),
        status VARCHAR(255),
        "priorityScore" INTEGER,
        "createdAt" VARCHAR(255),
        "facultyNotes" TEXT,
        "alternativeDate" VARCHAR(255),
        "alternativeTime" VARCHAR(255),
        "completedAt" VARCHAR(255),
        outcome VARCHAR(255)
      )
    `);

    // Create Schedule Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schedule (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        type VARCHAR(255),
        days TEXT,
        "startTime" VARCHAR(255),
        "endTime" VARCHAR(255),
        recurring BOOLEAN,
        location VARCHAR(255),
        mode VARCHAR(255),
        "studentName" VARCHAR(255),
        section VARCHAR(255)
      )
    `);
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

export default pool;
