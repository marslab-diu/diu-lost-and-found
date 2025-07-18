import React, { useState } from 'react';
import logo  from '../../assets/logo.svg';
import { BsArrowRightCircle } from 'react-icons/bs';

const commonWords = ["Wallet", "Phone", "Key", "Watch", "Umbrella", "Book", "Laptop", "Charger"];


const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleCategoryClick = (category) => {
        setSearchTerm(category);
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
                />
                <BsArrowRightCircle size={20} className='text-accent -rotate-45' />
            </label>

            <div className='flex flex-wrap items-center justify-center space-x-10'>
                {
                    commonWords.map((word, index) => (
                        <span 
                            key={index} 
                            className='btn btn-outline btn-secondary btn-sm text-black hover:bg-transparent mr-3 mb-2 px-4 cursor-pointer'
                            onClick={() => handleCategoryClick(word)}
                        >
                            {word}
                        </span>
                    ))
                }
            </div>
        </div>
    );
};

export default Search;