import React from "react";
import { withSearch } from "@elastic/react-search-ui";
import Pagination from "rc-pagination";
import enUsLocale from "rc-pagination/lib/locale/en_US";
function PagingContainer({ current, resultsPerPage, totalPages, setCurrent }) {
  return (
    <Pagination
      current={current}
      pageSize={resultsPerPage}
      total={totalPages * resultsPerPage}
      onChange={setCurrent}
      locale={enUsLocale}
      className="ce-paging"
    />
  );
}

export const Paging = withSearch(
  ({ current, resultsPerPage, totalPages, setCurrent }) => ({
    current,
    resultsPerPage,
    totalPages,
    setCurrent,
  })
)(PagingContainer);
