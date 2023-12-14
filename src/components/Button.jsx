import React from "react";

const Button = ({text, className, ...props}) =>{
    return(
        <button {...props} className={className}>
            {text}
        </button>
    )
}

export default Button;