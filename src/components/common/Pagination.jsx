import React from 'react'

const Pagination = ({ page, entries, setPage, totalEntries }) => {
    const handleNextPage = () => {
        if (page < Math.ceil(totalEntries / entries)) {
            setPage(page + 1);
        }
    }
    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    }
    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-neutral-700">
                Showing <span className="font-medium">
                    {(page - 1) * entries + 1}
                </span> to <span className="font-medium">
                    {Math.min(page * entries, totalEntries)}
                </span>
                {' '}of <span className="font-medium">{totalEntries}</span> results
            </div>
            <div className="flex-1 flex justify-end">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={handlePreviousPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                    >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <a
                        href="#"
                        aria-current="page"
                        className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                        {page}
                    </a>
                    <button
                        onClick={handleNextPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
                    >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    )
}

export default Pagination