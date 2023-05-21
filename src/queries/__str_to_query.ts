import { Query } from "./query";

// Demo query
// ["hello","world","panda","dog"]
// can be dealt with similar

/**
 * Write a string literal as a Query.
 */
export function strToQuery(str: string): Query {
	return {
		type: "context",
		context: "literal",
		value: str,
	};
}
