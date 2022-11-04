
import * as React from 'react';

function Pin(props) {

    return (

        <svg height="24" width="24">
            <text x="50%" y="50%" text-anchor="middle" fill="cyan" font-size="16px" font-family="Arial" dy=".3em">
                {props.name}
            </text>
        </svg>
    );
}

export default React.memo(Pin);