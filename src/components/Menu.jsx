import React from 'react'

const Menu = ({ isOpen, setIsOpen }) => {

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='menu' onClick={toggleMenu}>
            <div className='menu-line'></div>
            <div className='menu-line'></div>
            <div className='menu-line'></div>
        </div>
    )
}

export default Menu