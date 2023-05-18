import { strToQuery } from "../queries/__str_to_query";
import { Query } from "../queries/query";

export const ProseMirrorToPlaintext: Query = {
	type: "context",
	context: "clipboard",
	// i put the join originally in the interpreter
	// but the interpreter was being recursively called
	// resulting in some strange object join encoding results
	// putting it out here ensures post-recursion
	join: {
		// on: "object",
		// key: {
		// 	type: "context",
		// 	context: "data",
		// },
		// spread: true,
		on: "string",
		delimiter: strToQuery(""),
	},
	dependents: [
		{
			type: "interpreter",
			interpreter: "generic",
			dependents: [
				{
					type: "conditional",
					query: {
						type: "fetch",
						node: strToQuery("text"), // omit from result if not found
					},
					dependents: [
						{
							type: "fetch",
							node: strToQuery("text"),
						},
					],
				},
				{
					type: "conditional",
					query: {
						type: "fetch",
						node: strToQuery("text"), // omit from result if not found
					},
					invert: true,
					dependents: [
						{
							type: "conditional",
							query: {
								type: "fetch",
								node: strToQuery("content"), // omit from result if not found
							},
							invert: true,
							dependents: [
								{
									type: "context",
									context: "literal",
									value: " ",
								},
							],
						},
					],
				},
				{
					type: "conditional",
					query: {
						type: "fetch",
						node: strToQuery("content"), // omit from result if not found
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
											type: "stack_query",
											// context will reset
											// if queryId 0, causing an
											// infinite loop due to resetting
											// context EVERY TIME :sob:
											queryId: 1,
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
