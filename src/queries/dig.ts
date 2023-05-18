import { parseQuery } from "./__parse_query";
import { strToQuery } from "./__str_to_query";
import { Query } from "./query";

const data2 = '{"baz":{"bar":{"foo":[{"baz":"hi"},{"baz2":"ho"}]}}}';

export const dig: Query = parseQuery(data2, {
	type: "context",
	context: "data", // noop but good practice
	dependents: [
		{
			type: "interpreter",
			interpreter: "generic",
			dependents: [
				{
					type: "dig",
					nodes: [strToQuery("foo"), strToQuery("baz2")],
					inexact: true,
				},
			],
		},
	],
});
