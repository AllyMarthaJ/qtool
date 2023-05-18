import { strToQuery } from "./pretty-print";
import { Query } from "./query";

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
