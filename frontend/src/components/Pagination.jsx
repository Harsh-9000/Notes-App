const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const gridTemplateColumns = `repeat(${totalPages}, minmax(0, 1fr))`;

    return (
        <div className="flex justify-center mt-4">
            <div
                className="grid"
                style={{
                    gridTemplateColumns,
                    boxShadow: '0px 2px 2px rgba(255, 255, 255, 0.7)'
                }}
            >
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        className={`py-2 px-4 border-2 ${currentPage === number ? 'bg-retroWhite text-black' : 'bg-black text-white'}`}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Pagination;
