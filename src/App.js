import React, { useState, useEffect } from "react";
import { Future } from "ramda-fantasy";
import { includes, filter, isEmpty } from "ramda";
import { List, LIST_ITEMS } from "./types";
import "./App.css";

const mockFetchList = new Future((reject, resolve) => resolve(LIST_ITEMS));

const hasInTitle = searchString => item => includes(searchString, item.title);

const App = () => {
  const [list, setList] = useState(List.Initial);
  const [searchString, setSearchString] = useState("");

  const fetchList = () =>
    mockFetchList.fork(() => setList(List.FetchError), wrapList);

  const wrapList = list =>
    setList(isEmpty(list) ? List.Empty : List.Items(list));

  const filterList = () =>
    list.cata({
      Empty: () => List.Empty,
      Initial: () => List.Initial,
      Items: items => {
        const filteredList = filter(hasInTitle(searchString), items);
        return isEmpty(filteredList)
          ? List.NotFound(searchString)
          : List.Items(filteredList);
      },
      NotFound: () => List.NotFound(searchString),
      FetchError: () => List.FetchError
    });

  const onSearchFieldChange = ({ target }) =>
    setSearchString(() => target.value);

  useEffect(() => {
    setTimeout(() => fetchList(), 4000);
  });

  return (
    <div className="App">
      <header className="App-header">
        {"Pattern matching in React with Daggy"}
      </header>
      <article className={"App-body"}>
        <input onChange={onSearchFieldChange} />
        <ul className={"center"}>
          {filterList().cata({
            Empty: () => <li>{"This list is empty"}</li>,
            Initial: () => <li>{"Loading..."}</li>,
            Items: items =>
              items.map(({ title }) => <li key={title}>{title}</li>),
            NotFound: searchMessage => (
              <li>
                {"There are no results for"} '{searchMessage}'
              </li>
            ),
            FetchError: () => <li>{"Oooooops..."}</li>
          })}
        </ul>
      </article>
    </div>
  );
};

export default App;
