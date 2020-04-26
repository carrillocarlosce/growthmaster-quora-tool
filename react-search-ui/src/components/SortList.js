import React from "react";
import { withSearch } from "@elastic/react-search-ui";
function findSortOption(sortOptions, sortString) {
  const [value, direction] = sortString.split("|||");
  return sortOptions.find(
    (option) => option.value === value && option.direction === direction
  );
}
function formatValue(sortField, sortDirection) {
  return `${sortField}|||${sortDirection}`;
}
function formatSelectOption(sortOption) {
  return {
    label: sortOption.name,
    field: sortOption.value,
    direction: sortOption.direction,
    value: formatValue(sortOption.value, sortOption.direction),
  };
}
export function SortListContainer({
  label,
  setSort,
  sortDirection,
  sortField,
  sortOptions,
}) {
  return (
    <div className="ce-filters-list">
      <div className="ce-filters-list__title">{label}</div>
      <ul className="ce-filters-list__list">
        {/* <li
          onClick={() => clearFilters()}
          className={`${
            !data.values.length ? "active" : ""
          } ce-filters-list__item`}
        >
          No Sort
        </li> */}

        {sortOptions.map(formatSelectOption).map((option, i) => (
          <li
            key={`option_${i}`}
            onClick={() => {
              let direction;
              if (sortField) {
                direction = sortDirection === "asc" ? "desc" : "asc";
              } else {
                direction = option.direction;
              }
              setSort(option.field, direction);
            }}
            className={`${
              sortField === option.field ? "active" : ""
            } ce-filters-list__item`}
          >
            {option.label} {sortDirection ? `(${sortDirection})` : ""}
          </li>
        ))}
        {sortField ? (
          <li
            className="ce-filters-list__item"
            onClick={() => {
              setSort(null);
            }}
          >
            Clear
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export const SortList = withSearch(({ sortDirection, sortField, setSort }) => ({
  sortDirection,
  sortField,
  setSort,
}))(SortListContainer);
