import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const BottonBtn = ({ text, colorClass, icon, onBtnClick }) => {
  return (
    <button type='button' className={`btn btn-block no-border ${colorClass}`} onClick={onBtnClick}><FontAwesomeIcon title='关闭' icon={icon} className='mr-2'/>{text}</button>
  )
}

BottonBtn.propTypes = {
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.object.isRequired,
  onBtnClick: PropTypes.func
}

export default BottonBtn