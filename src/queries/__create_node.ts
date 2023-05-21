import { Query } from "./query";

/**
 * Creates an object with the shape { key: value }.
 */
export function createNode(key: Query, value: Query): Query {
	return {
		type: "context",
		context: "data",
		join: {
			on: "object",
			key: key,
		},
		dependents: [value],
	};
}
