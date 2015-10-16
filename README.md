# rubify.js
A rubification like system for facilitate class creation in JavaScript

## What does this do ?
This simple package adds 4 functions to the window object (or are imported as a module in node):

reader

writer

accessor

extend

If you know ruby, most of this functions will sound similar (just ad attr_ before)

extend is a function that allows you to create parent classes without much problem, it also automatically calls the "initialize" method when your object is created.

reader, writter, and accessor are just a quick way to use Object.defineProperty without all the boilerplate you require to use it.

## Show me your moves!

```js

var Parent = extend(); // by default, extend from object.

// You always need an initialize method on this objects, unless of course, your parent has one
Parent.prototype.initialize = function () {
  this._x = 0; // used as private member for 'x'
  this._y = 0; // used as private member for 'y'
}

// You can only read this variables
reader(Parent.prototype, 'x');
// You can use custom getters quickly.
reader(Parent.prototype, 'y',
 function () {
  return this._y;
 }
);

var Child = Parent.extend(); // a cleaner way to do 'extend(Parent)'

Child.prototype.initialize = function () {
 this.super.initialize(); // easier to call than Parent.prototype.initialize.call(this)
}

// The child can change it's values, so it uses an accessor
accessor(Child.prototype, 'x');
accessor(Child.prototype, 'y');

```

Just compare how in general terms, this functions do transfer more meaning while at the same time are more compact.
