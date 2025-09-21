import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages || totalPages === 0}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
