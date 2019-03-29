---
layout: base.njk
title: Typedefs — Background & Motivation
---

Typedefs is similar in spirit to [protocol-buffers](https://developers.google.com/protocol-buffers/) or [thrift](https://thrift.apache.org/) (and [many more](/related)) but subtly quite different.

Typedefs is based on an elementary mathematical theory of datatypes and is supposed to be a more natural fit for users of **proof assistants** and **purely functional, strongly typed** programming languages than the aforemention tools.

## Background and motivation

We ([statebox](https://statebox.org)) needed a minimalistic and clean theory of algebraic datatypes (ADTs) that used structures from [category theory](https://www.math3ma.com/blog/what-is-category-theory-anyway).

Once we find a suitable way to express ADTs, we futhermore want to

1. Serialize and deserialize **types** into bytes,
1. Serialize and deserialize typed **terms** into bytes,
1. Interpret definitions (as types) in various programming languages,
1. Compute new type definitions from existing onces.

We need to do all of this safely and both at compile time and runtime.

To write code that safely deals with type definitions that are not known at compile time you need a language with dependent types.

Therefor our system is implemented in the [Idris](https://www.idris-lang.org/) programming language and the code comes with various correctness proofs checked by the Idris compiler. This now allows us to programmatically manipulate types and interpret them safely as `Type` at runtime, very cool. 

Another way to work with type definitions is to generate code in a target language that describes the types and can serialize and deserialize it's terms.

To input type defintions, you *can* use Idris directly (see [Examples.idr](https://github.com/typedefs/typedefs/blob/master/examples/Examples.idr#L10)) but it is not needed and you can instead use our S-expression (LISP syntax) based frontend (see [Test/Parse.idr](https://github.com/typedefs/typedefs/blob/master/src/Test/Parse.idr#L25) for details, or just read on).

## How?

You define *algebraic datatypes* such as `Bool` or `α → List α` in terms of *least fixpoints of F-algebras*, using the following constructors:

- `0` void or the empty type
- `1` the unit type
- `+` co-products of types
- `×` products of types
- `µ` fixpoint operator

You can then 

- Generate representations of those types in supported target languages
- Generate code that translates between *typed terms* and *binary representations* of those terms

## Why?

It is supposed to be natural for users of **proof assistants** and **purely functional, strongly typed** programming languages.

If you work [categorically](https://www.math3ma.com/blog/what-is-category-theory-anyway) (as we do at [statebox](https://statebox.org)) then you want your data type definitions to fit in this paradigm or you will create a lot of friction moving between different representations.

You might want to *programmatically construct* new types, such as taking a product of two existing types.

You want correctness **proofs**.

## Where?

Try typedefs online [here](https://try-typedefs.netlify.com).

Check out our code [here](https://github.com/typedefs).

## References

- Initial Algebra, Final Coalgebra and Datatype — *Masuka Yeasin* [[2011](http://pages.cpsc.ucalgary.ca/~robin/class/617/projects-10/Masuka.pdf)]
- Initial Algebra Semantics is Enough! — *Patricia Johann and Neil Ghani* [[2007](https://personal.cis.strath.ac.uk/neil.ghani/papers/ghani-tlca07.pdf)]
- Polynomial Functors and Polynomial Monads — *Nicola Gambino, Joachim Kock* [[2010](https://arxiv.org/abs/0906.4931)]



At the basis of [statebox](https://statebox.org) we needed a type system to define the types of wires of a string diagram.

Some of our requirements are:

- Native support for *purely functional programming languages*
- Should form a *category* (see [what is category theory](https://www.math3ma.com/blog/what-is-category-theory-anyway))
- Compute new types from existing types (by constructing *products* or *co-products* of types)

In addition, we want the language to be mathematically minimalistic.

Existing tools rarely form algebraic structures that are easy to reason about. This makes **correctness proofs** of the tools and the theory or to use them in a , as we do at [statebox](https://statebox.org).



