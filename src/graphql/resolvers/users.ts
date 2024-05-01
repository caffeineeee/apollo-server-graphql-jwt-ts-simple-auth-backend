import { createClient } from "@libsql/client";
import { AuthenticationError } from "apollo-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET ?? "secret";
const db = createClient({
	url: "file:local.db",
});

export default {
	Mutation: {
		async registerUser(
			_: unknown,
			{
				registerInput: { username, email, password },
			}: {
				registerInput: { username: string; email: string; password: string };
			},
		) {
			email = email.toLowerCase();

			const { rows } = await db.execute({
				sql: `
				SELECT *
				FROM users
				WHERE email = (?);`,
				args: [email],
			});

			const isOldUserExists = rows[0];

			if (!isOldUserExists) {
				const hashedPassword = bcrypt.hashSync(password, 10);
				const token = jwt.sign(
					{
						user_id: uuidv4(), // uuidv4() ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
						email: email,
					},
					JWT_SECRET,
					{
						expiresIn: "2h",
					},
				);

				const transaction = await db.transaction("write");

				try {
					// do some operations with the transaction here
					await transaction.execute({
						sql: `
						INSERT INTO users
						(id, username, email, password, token)
						VALUES (?, ?, ?, ?, ?);
						`,
						args: [uuidv4(), username, email, hashedPassword, token],
					});
					// await transaction.execute({
					// 	sql: "UPDATE books SET name = ? WHERE name = ?",
					// 	args: ["Pride and Prejudice", "First Impressions"],
					// });

					// if all went well, commit the transaction
					await transaction.commit();
				} catch (e) {
					throw new Error(
						`Error occurred when adding new user❌❌❌❌❌: ${e}`,
					);
				} finally {
					// make sure to close the transaction, even if an exception was thrown
					// console.log("\nNew user successfully inserted to DB!");
					transaction.close();
				}

				const newUserData = await db.execute({
					sql: `
					SELECT *
					FROM users
					WHERE email = (?)
					ORDER BY created_at DESC
					LIMIT 1;`,
					args: [email],
				});

				const newUser = newUserData.rows[0];
				// console.log("\nNew user from registerUser: ", newUser);
				return { ...newUser };
			}
			throw new AuthenticationError(
				"A user is already registered with the email.",
				["USER_ALREADY_EXISTS"],
			);
		},
		async loginUser(
			_: unknown,
			{
				loginInput: { email, password },
			}: {
				loginInput: { email: string; password: string };
			},
		) {
			// console.log("\nemail for loginUser(): ", email);
			// console.log("\npassword for loginUser(): ", password);

			email = email.toLowerCase();

			const { rows } = await db.execute({
				sql: `
				SELECT *
				FROM users
				WHERE email = (?)
				ORDER BY created_at DESC
				LIMIT 1;`,
				args: [email],
			});

			const user = rows[0];

			const isOneUserExists = rows.length !== 0;
			// console.log("\nisOneUserExists: ", isOneUserExists);
			// console.log("They are: ", user);
			// console.log(
			// 	// "\nbcrypt.compareSync(password, user.password) returns: ",
			// 	"\nbcrypt.compareSync(password, user[password]) returns: ",
			// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			// 	bcrypt.compareSync(password, user.password as unknown as any),
			// );
			// console.log(
			// 	"password: ",
			// 	password,
			// 	"\nuser.password (existing user from DB): ",
			// 	user.password,
			// );

			if (
				isOneUserExists &&
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				bcrypt.compareSync(password, user.password as unknown as any)
			) {
				// Create token
				const token = jwt.sign(
					{
						user_id: uuidv4(),
						email: email,
					},
					JWT_SECRET,
					{
						expiresIn: "2h",
					},
				);

				const transaction = await db.transaction("write");
				try {
					// do some operations with the transaction here
					await transaction.execute({
						sql: `
						UPDATE users
						SET token = ?
						WHERE email = ?;`,
						args: [token, email],
					});

					// if all went well, commit the transaction
					await transaction.commit();
				} catch (e) {
					throw new Error(
						`Error occurred when logging in user❌❌❌❌❌: ${e}`,
					);
				} finally {
					// make sure to close the transaction, even if an exception was thrown
					transaction.close();
				}

				const { rows } = await db.execute({
					sql: `
					SELECT *
					FROM users
					WHERE email = (?)
					ORDER BY created_at DESC
					LIMIT 1;`,
					args: [email],
				});

				const user = rows[0];
				// console.log("\n----------\nUser from loginUser from db: ", user);
				return { ...user };
			}

			throw new AuthenticationError("Incorrect credentials", [
				"INVALID_CREDENTIALS",
			]);
		},
	},
	Query: {
		user: async (_: unknown, { id }: { id: string }) => {
			const { rows } = await db.execute({
				sql: `
				SELECT *
				FROM users
				WHERE id = (?)
				ORDER BY created_at DESC
				LIMIT 1;`,
				args: [id],
			});
			const user = rows[0];

			if (user) {
				return { ...user };
			}
			throw new AuthenticationError("User not found", ["USER_NOT_EXISTS"]);
		},
	},
};
