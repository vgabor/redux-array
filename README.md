# redux-list
Redux middleware to dispatch lists of actions

[![build status](https://img.shields.io/travis/vgabor/redux-list/master.svg)](https://travis-ci.org/vgabor/redux-list)
[![npm version](https://img.shields.io/npm/v/redux-list.svg)](https://www.npmjs.com/package/redux-list)

## Table of Contents
* [Install](#install)
* [Examples](#examples)


## Install

Installing redux-list npm package via npm or yarn:  
```
$ npm install --save redux-list
$ yarn add redux-list
```

Import and usage in your code:

```javascript
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxList from 'redux-list';
 
import * as reducers from './reducers';
 
const rootReducer = combineReducers(reducers);
const middlewares = applyMiddleware(
  reduxList
);
 
const store = createStore(roorReducer, middlewares);
```

## Examples

#### Mixed list of action objects and creators
```javascript
function actionCreator(type, payload) {
  return {type, payload};
}
 
store.dispatch([
  {type: "TESTM1", payload: 131},
  actionCreator("TESTM2", 132),
  {type: "TESTM3", payload: 133},
  [
    actionCreator("TESTM4", 134),
    actionCreator("TESTM5", 135),
  ],
  [
    [
      ({type: "TESTM6", payload: 136}),
      ({type: "TESTM7", payload: 137}),
    ]
  ],
]);
```
#### Pending updates
If you want pending updates, it very easy to do with redux-list.

```javascript
store.dispatch([
 {type: "FETCH_PENDING"},
 fetch(url)
   .then(response => response.json())
   .then(json     => ({type: "FETCH_SUCCESS", payload: json}))
   .catch(error   => ({type: "FETCH_ERROR", error: error}))
]);
```
In more general form:
```javascript
export const enhancedFetch = (baseType, url) => ([
  {type: baseType + "_PENDING"},
  fetch(url)
    .then(response => response.json())
    .then(json     => ({type: baseType + "_SUCCESS", payload: json}))
    .catch(error   => ({type: baseType + "_ERROR", error: error}))
]);
 
// and later in your code:
store.dispatch(enhancedFetch(baseType, url));
```

Copyright (c) 2017 Gabor Vizi, licensed with The MIT License (MIT)
