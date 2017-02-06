jest.autoMockOff();

import { createStore, applyMiddleware } from 'redux';
import reduxList from './index';

describe('redux full integration', () => {
  it('reducer receives correct actions', () => {
    const calls = [];
    const foo = () => (next) => (action) => {calls.push({middleware: "foo", action}); return next(action)};
    const bar = () => (next) => (action) => {calls.push({middleware: "bar", action}); return next(action)};
    let middlewares = applyMiddleware(
      foo, reduxList, bar
    );
    let reducer = jest.fn();
    let store = createStore(reducer, middlewares);

    function actionCreator(type, payload) {
      return {type, payload};
    }

    // simple action object
    store.dispatch({type: "TEST1", payload: 111});

    let list1;
    // list of action objects
    store.dispatch(list1 = [
      {type: "TESTL1", payload: 121},
      {type: "TESTL2", payload: 122},
      {type: "TESTL3", payload: 123},
    ]);

    // mixed list of action objects and creators
    let list2, sublist1, sublist2, subsublist21;
    store.dispatch(list2 = [
      {type: "TESTM1", payload: 131},
      actionCreator("TESTM2", 132),
      {type: "TESTM3", payload: 133},
      sublist1 = [
        actionCreator("TESTM4", 134),
        actionCreator("TESTM5", 135),
      ],
      sublist2 = [
        subsublist21 = [
          ({type: "TESTM6", payload: 136}),
          ({type: "TESTM7", payload: 137}),
        ]
      ],
    ]);

    expect(reducer.mock.calls[ 1][1]).toMatchObject({type: 'TEST1', payload: 111});

    expect(reducer.mock.calls[ 2][1]).toMatchObject({type: 'TESTL1', payload: 121});
    expect(reducer.mock.calls[ 3][1]).toMatchObject({type: 'TESTL2', payload: 122});
    expect(reducer.mock.calls[ 4][1]).toMatchObject({type: 'TESTL3', payload: 123});

    expect(reducer.mock.calls[ 5][1]).toMatchObject({type: 'TESTM1', payload: 131});
    expect(reducer.mock.calls[ 6][1]).toMatchObject({type: 'TESTM2', payload: 132});
    expect(reducer.mock.calls[ 7][1]).toMatchObject({type: 'TESTM3', payload: 133});
    expect(reducer.mock.calls[ 8][1]).toMatchObject({type: 'TESTM4', payload: 134});
    expect(reducer.mock.calls[ 9][1]).toMatchObject({type: 'TESTM5', payload: 135});
    expect(reducer.mock.calls[10][1]).toMatchObject({type: 'TESTM6', payload: 136});
    expect(reducer.mock.calls[11][1]).toMatchObject({type: 'TESTM7', payload: 137});

    expect(reducer.mock.calls.length).toBe(12);  // redux init + the 11 test call

    expect(calls).toEqual([
      // action object goes through untouched
      { middleware: 'foo', action: { type: 'TEST1', payload: 111 } },
      { middleware: 'bar', action: { type: 'TEST1', payload: 111 } },

      // list gets called for each element
      { middleware: 'foo', action: list1 },

      { middleware: 'foo', action: { type: 'TESTL1', payload: 121 } },  // item 1
      { middleware: 'bar', action: { type: 'TESTL1', payload: 121 } },  // item 1

      { middleware: 'foo', action: { type: 'TESTL2', payload: 122 } },  // item 2
      { middleware: 'bar', action: { type: 'TESTL2', payload: 122 } },  // item 2

      { middleware: 'foo', action: { type: 'TESTL3', payload: 123 } },  // item 3
      { middleware: 'bar', action: { type: 'TESTL3', payload: 123 } },  // item 3

      // list gets called for each element, recursively for sub lists
      { middleware: 'foo', action: list2 },

      { middleware: 'foo', action: { type: 'TESTM1', payload: 131 } },  // item 1
      { middleware: 'bar', action: { type: 'TESTM1', payload: 131 } },  // item 1

      { middleware: 'foo', action: { type: 'TESTM2', payload: 132 } },  // item 2
      { middleware: 'bar', action: { type: 'TESTM2', payload: 132 } },  // item 2

      { middleware: 'foo', action: { type: 'TESTM3', payload: 133 } },  // item 3
      { middleware: 'bar', action: { type: 'TESTM3', payload: 133 } },  // item 3

      { middleware: 'foo', action: sublist1 },

      { middleware: 'foo', action: { type: 'TESTM4', payload: 134 } },  // item 4
      { middleware: 'bar', action: { type: 'TESTM4', payload: 134 } },  // item 4

      { middleware: 'foo', action: { type: 'TESTM5', payload: 135 } },  // item 5
      { middleware: 'bar', action: { type: 'TESTM5', payload: 135 } },  // item 5

      { middleware: 'foo', action: sublist2 },

      { middleware: 'foo', action: subsublist21 },

      { middleware: 'foo', action: { type: 'TESTM6', payload: 136 } },  // item 6
      { middleware: 'bar', action: { type: 'TESTM6', payload: 136 } },  // item 6

      { middleware: 'foo', action: { type: 'TESTM7', payload: 137 } },  // item 7
      { middleware: 'bar', action: { type: 'TESTM7', payload: 137 } }   // item 7
    ]);

  });

});
