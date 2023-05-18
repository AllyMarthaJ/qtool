import { strToQuery } from "./pretty-print";
import { Query } from "./query";

// const data2 = '{"baz":{"bar":{"foo":[{"baz":"hi"},{"baz2":"ho"}]}}}';

export const dig: Query = {
	type: "context",
	context: "data",
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
};
