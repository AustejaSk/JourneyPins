import React from 'react'
import Menu from './Menu'
import earthIcon from '../assets/earth-icon.png'
import pinIcon from '../assets/pin-icon.png'

const Header = ({ isOpen, setIsOpen }) => {

    return (
        <header className='header'>
            <Menu isOpen={isOpen} setIsOpen={setIsOpen}/>
            <div className='header__logo'>
                <p>J<span><img className='header__earth-icon' src={earthIcon} /></span>urneyPins</p>
                <img className='header__pin-icon' src={pinIcon} />
            </div>
        </header>
    )
}

export default Header