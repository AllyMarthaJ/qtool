import { Query } from "./query";

// Demo query
// ["hello","world","panda","dog"]
// can be dealt with similar

export function strToQuery(str: string): Query {
	return {
		type: "context",
		context: "literal",
		value: str,
	};
}
