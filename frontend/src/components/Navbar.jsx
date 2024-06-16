import React, { useEffect, useState, useCallback } from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import SearchBar from './SearchBar';

const Navbar = ({ onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    const [text] = useTypewriter({
        words: ["notes"],
        loop: 1,
    });

    const debouncedSearch = useCallback((query) => {
        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func(...args);
                }, delay);
            };
        };

        debounce(onSearchNote, 10)(query);
    }, [onSearchNote]);

    const handleSearch = useCallback((query) => {
        if (query) {
            debouncedSearch(query);
        } else {
            handleClearSearch();
        }
    }, [debouncedSearch, handleClearSearch]);

    const onClearSearch = () => {
        setSearchQuery("");
        handleClearSearch();
    };
    
    const handleChange = (event) => {
        const { value } = event.target;
        setSearchQuery(value);
        handleSearch(value);
    };

    useEffect(() => {
        if (text === "notes") {
            setShowCursor(false);
        }
    }, [text]);

    return (
        <div className="bg-black flex items-center justify-between px-6 py-2 border-b-2" style={{ boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.7)' }}>
            <h2 className="text-4xl font-medium text-white py-2 uppercase" style={{ textShadow: '0px 2px 14px rgba(255, 255, 255, 0.7)' }}>
                {text}
                {showCursor && <Cursor cursorStyle='_' cursorBlinking={true} />}
            </h2>

            <SearchBar
                value={searchQuery}
                onChange={handleChange}
                handleSearch={() => handleSearch(searchQuery)}
                onClearSearch={onClearSearch}
            />
        </div>
    );
};

export default Navbar;
