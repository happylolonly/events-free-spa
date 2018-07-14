import React from 'react';
import PropTypes from 'prop-types';


const propTypes = {
    // name
    // value
    // title
    // onChange
    // error
};

const ImageUploader = ({ name, value, title, error, onChange }) => {

    const handleChange = (event) => {
        const { value } = event.target;

        onChange(value, name, event);
    }

    return (
        <div>
            <label htmlFor={name}>{title}</label>
            <input
                type="file"
                value={value}
                onChange={onChange}
            />

            {value.map(item => {
                return (
                    <div key={item} className="image-item">
                        <img src={item} />
                        <span onClick={}>x</span>
                    </div>
                )
            })}

            {error && <p>{error}</p>}
        </div>
    )

}

export default ImageUploader;