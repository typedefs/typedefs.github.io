---
layout: base.njk
title: Typedefs — Binary Format
---

# Specification

We will collect various specification details here, at the moment this is rather incomplete.

The typedefs language `TDef` can be found in [Typedefs.idr](https://github.com/typedefs/typedefs/blob/master/src/Typedefs/Typedefs.idr#L16).

- `T0` **0** the empty or void type
- `T1` **1** the unit type
- `TSum` **+** co-product of types (also known as *sum*-types)
- `TProd` **×** products of types (also known as *tuples*)
- `TMu` **µ** fixpoint operator (also known as recursion)
- `TVar` **a**, **b**, ... variables
- `TApp` **(a b)** application

For example expressions in Idris, see [Examples.idr](https://github.com/typedefs/typedefs/blob/master/examples/Examples.idr#L10).

For details on our S-expression (LISP syntax) based frontend, see [Test/Parse.idr](https://github.com/typedefs/typedefs/blob/master/src/Typedefs/Test/ParseTests.idr#L25).

## Binary term serialization format

Terms are serialised as follows:

- `T0` does not need to be serialised as the type is uninhabited.
- `T1` does not need to be serialised as it has only a single trivial term.
- `TSum ts` with `|ts| = 2 + k` are serialised as the tag bits `00`, followed by an integer `i`, followed by the serialisation of a term of type `ts[i]`. (Alternative: can serialise an integer `< 2 + k`.)
- `TProd ts` with `|ts| = 2 + k` are serialised as the tag bits `01`, followed by the integer `2 + k`, followed by the serialisation of `ts[0]`, ..., `ts[1+k]`. This relies on being able to compute the width of each serialised term.
- `TVar j` are not serialised, as we only deal with closed types (but encoders and decoders will have to deal with them, because of `TMu`).
- `TMu ts` with `|ts| = k` are serialised as the tag bits `10`, followed by an integer `i`, followed by the serialisation of ts[i]. (Alternative: can serialise an integer `< k`.)
- `TApp f xs` with `|xs| = k` are serialised as the tags bits `11`, followed by the integer `k`, followed by the serialisation of `f`, followed by the serialisation of `xs[0]`, ..., `xs[k-1]`.
