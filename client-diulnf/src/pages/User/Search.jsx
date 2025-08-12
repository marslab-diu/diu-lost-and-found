import React, { useState } from 'react';
import { useNavigate } from 'react-router'; 
import logo from '../../assets/logo.svg';
import { BsArrowRightCircle } from 'react-icons/bs';

const commonWords = [
    "Wallet", "Phone", "Keys", "Watch", "Umbrella", "Book", "Laptop", "Charger",
    "Backpack", "Headphones", "Glasses", "Jewelry", "ID Card", "Credit Card",
    "Water Bottle", "Notebook", "Pen", "Calculator", "Flash Drive", "Mouse",
    "Tablet", "Earbuds", "Sunglasses", "Bracelet", "Ring", "Necklace",
    "Student ID", "Library Card", "Bus Card", "Jacket", "Sweater", "Cap",
    "Scarf", "Gloves", "Shoes", "Lunch Box", "Thermos", "Power Bank"
];

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/user/search-results?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCategoryClick = (category) => {
        setSearchTerm(category);
        navigate(`/user/search-results?q=${encodeURIComponent(category)}`); 
    };

    return (
        <div className='flex flex-col items-center justify-center h-[calc(100vh-172px)] space-y-10'>
            <img src={logo} alt="" className='w-70'/>

            <label className='input input-xl rounded-2xl shadow-md outline-none focus-within:outline-none focus-within:shadow-lg w-150'>
                <input 
                    type="search" 
                    className="py-7 text-lg" 
                    placeholder="Search for an item that you want to find" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <BsArrowRightCircle 
                    size={20} 
                    className='text-accent -rotate-45 cursor-pointer' 
                    onClick={handleSearch}
                />
            </label>

            <div className='w-1/4 overflow-hidden relative'>
                <div 
                    className='flex items-center space-x-4 scrolling-container'
                    onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                    onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                    {[...commonWords, ...commonWords].map((word, index) => (
                        <span 
                            key={index} 
                            className='btn btn-outline btn-secondary btn-sm text-black transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0'
                            onClick={() => handleCategoryClick(word)}
                        >
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .scrolling-container {
                    width: max-content;
                    animation: scroll 120s linear infinite;
                }

                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .scrolling-container:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default Search;