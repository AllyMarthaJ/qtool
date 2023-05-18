import { strToQuery } from "./pretty-print";
import { Query } from "./query";

export const ProseMirrorToPlaintext: Query = {
	type: "context",
	context: "clipboard",
	dependents: [
		{
			type: "interpreter",
			interpreter: "generic",
			dependents: [
				{
					type: "conditional",
					query: {
						type: "fetch",
						node: strToQuery("text"), // will be undefined if not found
					},
					dependents: [
						{
							type: "context",
							context: "literal",
							value: "hey",
						},
					],
				},
				{
					type: "conditional",
					query: {
						type: "fetch",
						node: strToQuery("content"), // will be undefined if not found
					},
					dependents: [
						{
							type: "fetch",
							node: strToQuery("content"),
							dependents: [
								{
									type: "context",
									context: "for_each",
									dependents: [
										/**need to recurse */
										{
											type: "context",
											context: "literal",
											value: "hey",
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};
