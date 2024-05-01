import { createClient } from "@libsql/client";
// const TURSO_DB_URL = process.env.TURSO_DATABASE_URL ?? "";
// const TURSO_DB_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN ?? "";

const db = createClient({
	// url: TURSO_DB_URL,
	// authToken: TURSO_DB_AUTH_TOKEN,
	url: "file:local.db",
});

async function seedDb() {
	try {
		await db.batch(
			[
				`CREATE TABLE IF NOT EXISTS users (
					id TEXT PRIMARY KEY,
					username VARCHAR2(30) DEFAULT NULL,
					email VARCHAR2(30) UNIQUE,
					hashed_password TEXT,
					token TEXT,
					created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
				);`,
				`INSERT INTO users (
					id, username, email, hashed_password, token, created_at
				) VALUES (
					'kjds-234s-s4we-wer2', 'test', 'test@gmail.com', '$2a$10$Ba99Kn4Xc.C7N.8fGP6lvOsldeit6txCliKIwQ7RbmPulWy00OHRa', 'test', CURRENT_TIMESTAMP
				);`,
				`INSERT INTO users (
					id, username, email, hashed_password, token, created_at
				) VALUES (
					'jh23s-qweuif-adsf-dsfa', 'test', 'test2@gmail.com', '$2a$10$Ba99Kn4Xc.C7N.8fGP6lvOsldeit6txCliKIwQ7RbmPulWy00OHRa', 'test', CURRENT_TIMESTAMP
				);`,
			],
			"write",
		);
	} catch (e) {
		throw new Error(e as string);
	} finally {
		db.close();
	}
}

seedDb();
