---
layout: base.njk
title: Typedefs — Background & Motivation
---

# About

Typedefs is similar to [protocol-buffers](https://developers.google.com/protocol-buffers/), [thrift](https://thrift.apache.org/) and [many more](/related).

However, it is based on an elementary mathematical theory of datatypes and aims to be a more natural fit for users of **proof assistants** and **purely functional, strongly typed** programming languages.

## Background and motivation

At ([statebox](https://statebox.org)) we needed a minimalistic and clean theory of algebraic datatypes (ADTs) that used structures from [category theory](https://www.math3ma.com/blog/what-is-category-theory-anyway).

Once we find a suitable way to express ADTs, we futhermore want to

1. Serialize and deserialize **types** into bytes,
1. Serialize and deserialize typed **terms** into bytes,
1. Interpret definitions (as types) in various programming languages,
1. Compute new type definitions from existing onces.

We need to do all of this safely and both at compile time and runtime.

## Safe runtime type manipulation

To write code that safely deals with type definitions that are not known at compile time you need a language with dependent types so our system is implemented in the [Idris](https://www.idris-lang.org/) programming language. The code comes with various correctness proofs checked by the Idris compiler and allows us to programmatically manipulate types and interpret them safely as `Type` at runtime, very cool. 

## Specifying type definitions

To input type definitions, you *can* use Idris directly but that is not needed and you can instead use our S-expression (LISP syntax) based frontend.

See the last part of the [introduction](/introduction).

## Code generation

Another way to work with type definitions is to generate code in a target language that describes the types and can serialize and deserialize it's terms.

Code generation can be seen in action in your browser, surf to [try.typedefs.com](https://try.typedefs.com).

