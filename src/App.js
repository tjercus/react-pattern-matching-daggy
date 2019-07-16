import React, { useState, useEffect } from "react";
// import {curry, match} from "ramda";
import { List, LIST_ITEMS } from "./types";
import "./App.css";

// TODO ramdify, convert to a Future (ramda-fantasy)
const mockFetchList = () => Promise.resolve(LIST_ITEMS).then(list => ({ list }));

const matchSearch = searchString => item => item.title.indexOf(searchString) !== -1; // TODO ramdify
// const matchSearch = curry((searchString, item) => match(item));

const App = () => {
  const [list, setList] = useState(List.Initial);
  const [searchString, setSearchString] = useState("");

  const fetchList = () => {
    mockFetchList()
      .then(res => wrapList(res.list))
      .catch(() => setList(List.FetchError));
  };

  const wrapList = list => {
    // TODO ramdify list.length
    const wrapperList = list.length === 0 ? List.Empty : List.Items(list);
    setList(wrapperList);
  };

  const filterList = () =>
    list.cata({
      Empty: () => List.Empty,
      Initial: () => List.Initial,
      Items: items => {
        const filteredList = items.filter(matchSearch(searchString)); // TODO ramdify
        // TODO ramdify filteredList.length
        return filteredList.length > 0
          ? List.Items(filteredList)
          : List.NotFound(searchString);
      },
      NotFound: () => List.NotFound(searchString),
      FetchError: () => List.FetchError
    });

  const onSearchFieldChange = ({ target }) =>
    setSearchString(() => target.value);

  useEffect(() => {
    setTimeout(fetchList, 4000);
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
            Empty: () => <li>{"This list is empty =("}</li>,
            Initial: () => <li>{"Loading..."}</li>,
            Items: items =>
              items.map(({ title }) => <li key={title}>{title}</li>),
            NotFound: searchMessage => (
              <li>
                `There is nothing on your request: {searchMessage}’
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
