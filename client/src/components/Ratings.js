import React from 'react'
import StarRatings from 'react-star-ratings'

/**
 * 
 * @param {*} value 
 * @param {*} count 
 * @returns a non-editable Ratings component
 */
export default function Ratings({value, count}) {
	const val = Number(value)
	if (isNaN(val)) {
		return <p> ratings not available</p>
	}
	return (
		<div className="ratings-row">
			<StarRatings
				rating={val}
				starRatedColor={'#FFFFFF'}
				starEmptyColor={'#76bddc'}
			/>
			<span style={{marginLeft: '20px'}}>{val}&nbsp;&nbsp;({count}&nbsp;Ratings)</span>
		</div>
	)
}