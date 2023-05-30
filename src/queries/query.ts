// We can add node rules later. For example, a root should
// have a context followed by interpreter or interpreters.
// Each dependent signifies a separate output.
export type Query = (AggregateQuery | FilterQuery) & {
	dependents?: Query[];
};

/**
 * Filter queries pass data down in a filtered context.
 * They do not refer to their dependents.
 */
type FilterQuery =
	| QueryContext
	| QueryInterpreter
	| QueryGrep
	| QuerySed
	| QueryFetch
	| QueryDig
	| QueryStackReference;

/**
 * Aggregate queries pass data up from their dependents
 * allowing the result to be transformed.
 */
type AggregateQuery = QueryJoin | QueryCondition;

export type QueryJoin =
	// Default key used for Query nodes which don't have a key
	// if spread, don't key.
	| { type: "join"; on: "merge" }
	| { type: "join"; on: "object"; key: Query }
	| { type: "join"; on: "array" }
	| { type: "join"; on: "string"; delimiter: Query };

export type QueryContext = { type: "context" } & (
	| {
			context: "clipboard" | "literal" | "for_each" | "data";
	  }
	| {
			context: "literal";
			value: string;
	  }
	| {
			context: "file_path_arg" | "arg";
			// support index or name
			arg: string | number;
	  }
);

export type QueryStackReference = {
	// allows recursion by referencing query on the stack
	type: "stack_query";
	queryId?: number;
};

export type QueryCondition = {
	type: "conditional";
	// runQuery will return an array of values
	// if any of those values are defined, this is truthy
	query: Query;
	invert?: boolean;
};

export type QueryInterpreter = {
	type: "interpreter";
	interpreter: "string" | "generic";
};

// solution: [{ match: "...match...", groups: {0:...,1:...,2:....} }] if all
// this way you can key index to name or something
export type QueryGrep = {
	type: "grep";
	find: Query;
	flags?: Query;
	all?: boolean;
};

export type QuerySed = {
	type: "sed";
	find: Query;
	flags?: Query;
	repl: Query;
};

export type QueryFetch = {
	type: "fetch";
	node: Query;
};

export type QueryDig = {
	type: "dig";
	nodes: Query[];
	// inexact means the node sequence
	// need not exactly match the data tree
	// i.e. {foo:{bar:{dog:{baz:""}}}}
	// with sequence "foo", "bar", "baz" will
	// match if inexact, but otherwise won't
	inexact?: boolean;
};
