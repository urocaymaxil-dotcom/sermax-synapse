import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDb = () => {
  db.serialize(() => {
    // Create Requests Table
    db.run(`
      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        studentName TEXT,
        section TEXT,
        subject TEXT,
        preferredDate TEXT,
        preferredTime TEXT,
        purpose TEXT,
        status TEXT,
        priorityScore INTEGER,
        waitDays INTEGER,
        displacementCount INTEGER,
        createdAt TEXT,
        facultyNotes TEXT,
        alternativeDate TEXT,
        alternativeTime TEXT,
        completedAt TEXT,
        outcome TEXT
      )
    `);

    // Create Availability Table
    db.run(`
      CREATE TABLE IF NOT EXISTS availability (
        id TEXT PRIMARY KEY,
        facultyId TEXT,
        dayOfWeek TEXT,
        date TEXT,
        startTime TEXT,
        endTime TEXT,
        type TEXT
      )
    `);

    // Insert dummy availability if empty
    db.get('SELECT count(*) as count FROM availability', (err, row: any) => {
      if (row && row.count === 0) {
        const stmt = db.prepare('INSERT INTO availability (id, facultyId, dayOfWeek, date, startTime, endTime, type) VALUES (?, ?, ?, ?, ?, ?, ?)');
        stmt.run('avail1', 'f1', 'Monday', '2023-11-20', '13:00', '15:00', 'available');
        stmt.run('avail2', 'f1', 'Wednesday', '2023-11-22', '10:00', '12:00', 'available');
        stmt.finalize();
      }
    });
  });
};

export default db;
