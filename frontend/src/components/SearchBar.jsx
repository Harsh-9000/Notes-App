import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
    return (
        <div className="w-80 flex items-center px-4 border-2" style={{ boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.7)' }}>
            <input
                type="text"
                placeholder="Search Notes"
                className="w-full text-xs text-retroWhite bg-transparent py-[11px] outline-none"
                value={value}
                onChange={onChange}
            />
            {value && (
                <IoMdClose
                    className="text-xl text-slate-500 cursor-pointer hover:text-retroWhite mr-3"
                    onClick={onClearSearch}
                />
            )}
            <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-retroWhite" onClick={handleSearch} />
        </div>
    );
};

export default SearchBar;
