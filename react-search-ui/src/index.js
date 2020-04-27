import React, { Component } from "react";
import ReactDOM from "react-dom";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import {
  SearchProvider,
  Results,
  SearchBox,
  WithSearch,
  PagingInfo,
  Facet,
} from "@elastic/react-search-ui";
import { FiltersList } from "./components/FiltersList";

import "./scss/style.scss";
import { ResultItem } from "./components/ResultItem";
import { SortList } from "./components/SortList";
import { Paging } from "./components/Paging";

const connector = new AppSearchAPIConnector({
  searchKey: "search-24ocrwykfz9j6vkqw2tm9nvo",
  engineName: "growthmasters-viral-content-tool",
  hostIdentifier: "host-n5kv8j",
});
const itemsPerPage = 20;
class Root extends Component {
  render() {
    return (
      <SearchProvider
        config={{
          apiConnector: connector,
          trackUrlState: false,
          searchQuery: {
            disjunctiveFacets: ["audience"],
            facets: {
              audience: { type: "value", size: 30 },
            },
          },
        }}
      >
        <WithSearch
          mapContextToProps={({ searchTerm, setSearchTerm, results }) => ({
            searchTerm,
            setSearchTerm,
            results,
          })}
        >
          {({ searchTerm, setSearchTerm, results }) => {
            return (
              <div className="ce-search">
                <div className="row">
                  <div className="ce-search__header">
                    <div className="ce-search__input-box">
                      <input
                        className="ce-search__text-input"
                        placeholder="Enter your search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <section className="ce-search__body">
                  <div className="row">
                    <div className="col-1-of-4">
                      <div className="ce-search__sidebar">
                        <Facet
                          field="audience"
                          label="Audience"
                          view={(data) => <FiltersList data={data} />}
                          filterType="any"
                          show={20}
                        />

                        <SortList
                          label="Sort"
                          sortOptions={[
                            {
                              name: "Upvotes",
                              value: "upvotes",
                              direction: "desc",
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="col-3-of-4">
                      <div className="ce-search__results">
                        <div className="ce-search__results-count">
                          {<PagingInfo />}
                        </div>
                        {results.map((r) => (
                          <ResultItem
                            key={r.id.raw}
                            id={r.id.raw}
                            upvotes={r.upvotes.raw}
                            title={r.question.raw}
                            description={r.opener_answer.raw}
                            link={r.popular_answer.raw}
                          />
                        ))}
                        <Paging />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            );
          }}
        </WithSearch>
      </SearchProvider>
    );
  }
}
let container = document.getElementById("app");
let component = <Root />;
ReactDOM.render(component, container);
