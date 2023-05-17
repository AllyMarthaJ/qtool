import { prettyPrintQuery as pp } from "./queries/pretty-print";
import { runQuery } from "./query-runner";

const data = `["pandas are","fucking hot","i love them so mucH","pandas<333"]`;

const queryResult = runQuery(data, pp);

console.log(queryResult);
