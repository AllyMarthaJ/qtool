// We can add node rules later. For example, a root should
// have a context followed by interpreter or interpreters.
// Each dependent signifies a separate output.
export type Query = (QueryContext | QueryInterpreter | QueryGrep) & {
	dependents?: Query[];
};

export type QueryContext = {
	type: "context";
	/**
	 * Clipboard pulls from clipboard
	 * File Path Arg reads file specified in arg. Undefined means pull from any.
	 * Arg pulls content from arg directly
	 * for_each reads from array parsed above interpreter
	 */
	context: "clipboard" | "file_path_arg" | "arg" | "for_each";
	arg?: string | number; // support argument notation or index
};

export type QueryInterpreter = {
	type: "interpreter";
	interpreter: "string" | "generic";
};

export type QueryGrep = {
	type: "grep";
	find: string;
	flags?: string;
	repl: string;
};
