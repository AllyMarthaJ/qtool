import { dig } from "./queries/dig";
import { givePanda } from "./queries/give-panda";
import { ProseMirrorToPlaintext } from "./queries/pm-to-plaintext";
import { prettyPrintQuery as pp } from "./queries/pretty-print";
import { runQuery } from "./query-runner";

// const data = `["pandas are","fucking hot","i love them so mucH","pandas<333"]`;
const data2 = '{"baz":{"bar":{"foo":[{"baz":"hi"},{"baz2":"ho"}]}}}';
const pd = `[{"pandaName":"gary"},{"pandaName":"jerry"},{"pandaName":"ally"}]`;
const queryResult = runQuery(pd, ProseMirrorToPlaintext);

queryResult.forEach((result) => {
	console.log("RESULT");
	if (typeof result === "string") {
		console.log(result);
	} else {
		console.log(JSON.stringify(result, null, 2));
	}
});
