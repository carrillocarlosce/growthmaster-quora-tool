import React, { Component } from "react";
import ReactDOM from "react-dom";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import {
  SearchProvider,
  Results,
  SearchBox,
  WithSearch,
  PagingInfo,
  Sorting,
  Facet,
} from "@elastic/react-search-ui";
import { FiltersList } from "./components/FiltersList";

import "./scss/style.scss";
import { ResultItem } from "./components/ResultItem";

const connector = new AppSearchAPIConnector({
  searchKey: "search-371auk61r2bwqtdzocdgutmg",
  engineName: "search-ui-examples",
  hostIdentifier: "host-2376rb",
});

class Root extends Component {
  render() {
    return (
      <SearchProvider
        config={{
          debug: true,
          apiConnector: connector,
          searchQuery: {
            disjunctiveFacets: ["states"],
            facets: {
              states: { type: "value", size: 30 },
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
                          field="states"
                          label="States"
                          view={(data) => <FiltersList data={data} />}
                          filterType="any"
                        />

                        {/* <Sorting
                          sortOptions={[
                            {
                              name: "Relevance",
                              value: "",
                              direction: "",
                            },
                            {
                              name: "Title",
                              value: "title",
                              direction: "asc",
                            },
                          ]}
                        /> */}
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
                            title={r.title.raw}
                            description={r.description.raw}
                            link={r.nps_link.raw}
                          />
                        ))}
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
