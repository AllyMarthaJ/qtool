# Overview

This tool is a prototype for a tool I will probably not eventually
write when given the chance.
This prototype essentially represents the crux of the tool that I
would ideally write, serving for the purpose of managing some
insane but consistently formatted content that is normally unreadable
to the standard human such as myself.

For example, some of our stack traces at work are formatted as follows:
["some thing here","blah blah blah",...]

This is okay with word wrap but still pretty annoying to read. So my typical
workflow with pulling these stack traces involves opening vscode, grepping for
the [] symbols, killing them, then replacing commas with newlines.

This is pain. It's, like, 2 seconds of my time that I could have used
spending writing code for our corporate overlords, and I'm filled with
shame every time I resort to such tactics. (That is to say however that
it is some people's entire jobs to do this sort of parsing work and then
fill them into various tools and services and manage the data, and so I have
the utmost respect for them).

This is not a drunken overview.

# Mindset

This tool is designed with a goal in mind: string and object normalisation.
You might notice I only support JSON with this tool. This is intentional. Most
of the work I do centres around JSON and denormalised string content, which includes
debugging messages and other insane things of the kind. In order to keep this
tool sane for the time being, I begun with synonymising the idea of an object
with one which comes from JSON.

Thus we have the idea of a Query. A Query exists for one purpose: to normalise the
data in an intentional way. It has inputs, it has outputs and it should have actions
to preserve many-to-many configurations in small datasets. Each Query should be
data-driven; it should exist for collections of objects which share similar
possibly-denormalised structures, but should similarly be intutiive to write
and traverse.

One driving principle is thus: if I want to fetch data, I want to be as specific
about it as possible. I never want unnecessary data floating around, and
each stage of processing, I should always aim to reduce the information I am taking
in and processing. This is, of course, intuitive to a person as well. One's workflow
does not typically involve adding extra information, and more often than not
only certain information becomes helpful to the issue at ahnd.

The presiding construct therefore is one of a Context. A Context defines the data
which is beign manipulated at a given time. Its existence means that the evaluation
is as intentional as possible. There is therefore only ever one Context at a time.

I need as much flexibility as I can with both strings and objects. For instance,
I should be able to switch between the two interchangably and be provided with
different, distinct and appropriate toolsets for each. For example, a common
string operation is grepping, and RegEx is by far one of the most useful
and flexible tools; so this seems appropriate for localised data transformation.
I should be able to traverse JSON objects similarly.

Thus the idea of an Interpreter comes in. An Interpreter allows one to change
the Context from one which deals with a string to one which deals with an object
interchangably.

Not only do we want input specificity, we need output specificity. A Conditional
provides the ability to omit content from the output of the process given the
process has produced undefined outputs in some part of the tree. This implicitly
encodes the idea of truthy and falsey while also maintaining complete flexibility
of intentional and unintentional information inclusion and exclusion. One should always
be able to return information which is not strictly defined or doesn't have content.

Finally, I need my inputs to be flexible. A Context should be able to derive
information from any kind of input, such as files, CLI arguments, clipboard.

# Query Structure
