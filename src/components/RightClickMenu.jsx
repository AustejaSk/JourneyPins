import React from 'react'

const RightClickMenu = ({ x, y, onAddPin }) => {
    return (
        <div className='right-click-menu' style={{ left: `${x}px`, top: `${y}px`, display: 'block'}}>
            <button onClick={(e) => {
                e.stopPropagation()
                onAddPin()
            }}>Add a pin</button>
        </div>
    )
}

export default RightClickMenu