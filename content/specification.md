---
layout: base.njk
title: Typedefs — Binary Format
---

# Specification

We will collect various specification details here, at the moment this is rather incomplete.

The typedefs language `TDef` can be found in [Typedefs.idr](https://github.com/typedefs/typedefs/blob/master/src/Typedefs.idr#L14).

- `T0` **0** the empty type
- `T1` **1** the unit type
- `TSum` **+** co-product of types (also known as *sum*-types)
- `TProd` **×** products of types (also known as *tuples*)
- `TMu` **µ** fixpoint operator (also known as recursion)
- `TVar` **a**, **b**, ... variables
- `TApp` **(a b)** application

For example expressions in Idris, see [Examples.idr](https://github.com/typedefs/typedefs/blob/master/examples/Examples.idr#L10).

For details on our S-expression (LISP syntax) based frontend, see [Test/Parse.idr](https://github.com/typedefs/typedefs/blob/master/src/Test/Parse.idr#L25).

## Binary term serialization format

Terms are serialised as follows:

- Terms of type `T0` or `T1` do not need to be serialised --- the former does not exist, and the latter is trivial.
- Terms of type `TSum ts` with `|ts| = 2 + k` are serialised as the tag bits `00`, followed by an integer `i`, followed by the serialisation of a term of type `ts[i]`. (Alternative: can serialise an integer `< 2 + k`.)
- Terms of type `TProd ts` with `|ts| = 2 + k` are serialised as the tag bits `01`, followed by the integer `2 + k`, followed by the serialisation of `ts[0]`, ..., `ts[1+k]`. This relies on being able to compute the width of each serialised term.
- Terms of type `Tvar j` are not serialised, as we only deal with closed types (but encoders and decoders will have to deal with them, because of `TMu`).
- Terms of type `Tmu ts` with |ts| = k are serialised as the tag bits `10`, followed by an integer `i`, followed by the serialisation of ts[i]. (Alternative: can serialise an integer `< k`.)
- Terms of type `TApp f xs` with `|xs| = k` are serialised as the tags bits `11`, followed by the integer `k`, followed by the serialisation of `f`, followed by the serialisation of `xs[0]`, ..., `xs[k-1]`.
