// We can add node rules later. For example, a root should
// have a context followed by interpreter or interpreters.
// Each dependent signifies a separate output.
export type Query = (
	| QueryContext
	| QueryInterpreter
	| QueryGrep
	| QueryFetch
	| QueryDig
) & {
	dependents?: Query[];
};

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

export type QueryInterpreter = {
	type: "interpreter";
	interpreter: "string" | "generic";
};

export type QueryGrep = {
	type: "grep";
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
