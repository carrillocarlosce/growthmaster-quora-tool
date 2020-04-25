import React, { Component } from "react";
import { withSearch } from "@elastic/react-search-ui";

function Filter({ filters, setFilter, data, clearFilters }) {
  console.log({ data });
  return (
    <div className="ce-filters-list">
      <div className="ce-filters-list__title">{data.label}</div>
      <ul className="ce-filters-list__list">
        <li
          onClick={() => clearFilters()}
          className={`${
            !data.values.length ? "active" : ""
          } ce-filters-list__item`}
        >
          All
        </li>
        {data.options.map(({ count, value, selected }, i) => (
          <li
            key={`option_${i}`}
            onClick={() => {
              const add = !data.values.includes(value);
              if (add) {
                data.onSelect(value);
              } else {
                data.onRemove(value);
              }
            }}
            className={`${selected ? "active" : ""} ce-filters-list__item`}
          >
            {value} <span class="ce-filters-list__count">({count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const FiltersList = withSearch(
  ({ filters, setFilter, clearFilters }) => ({
    filters,
    setFilter,
    clearFilters,
  })
)(Filter);
