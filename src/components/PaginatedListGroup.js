import React, { useState } from 'react';
import { ListGroup, Nav, Pagination } from 'react-bootstrap';

function PaginatedListGroup({ itemsPerPage, data }) {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the indexes of the items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    //number of pagination item
    const maxPages = Math.ceil(data.length / itemsPerPage);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <ListGroup>
                {currentItems}
            </ListGroup>

            {/* Pagination controls */}
            <Nav>
                <Pagination>
                    <Pagination.First onClick={() => {handlePageChange(1)}}></Pagination.First>
                    {Array(maxPages )
                        .fill()
                        .map((_, index) => (
                            <Pagination.Item
                                key={index}
                                className={`page-item${currentPage === index + 1 ? ' active' : ''}`}
                                onClick={() =>  handlePageChange(index+1)}>
                                {index+1}
                            </Pagination.Item>
                        ))}
                    <Pagination.Last onClick={() => {handlePageChange(maxPages)}}></Pagination.Last>

                </Pagination>
            </Nav>
        </>
    );
}

export default PaginatedListGroup;
