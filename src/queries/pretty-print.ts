import { Query } from "./query";

// Demo query
// ["hello","world","panda","dog"]
// can be dealt with similar
export const prettyPrintQuery: Query = {
	type: "context",
	context: "clipboard",
	dependents: [
		{
			type: "interpreter",
			interpreter: "string",
			dependents: [
				{
					type: "grep",
					// prettier-ignore
					find: "[[]]",
					repl: "",
					dependents: [
						{
							type: "grep",
							find: ",",
							repl: "\n",
							dependents: [
								{ type: "interpreter", interpreter: "generic" },
							],
						},
					],
				},
			],
		},
	],
};
