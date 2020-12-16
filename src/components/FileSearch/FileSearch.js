import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import useKeyPress from '../../hooks/useKeyPress.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

import './FileSearch.less'


const FileSearch = ({ title, onFileSearch }) => {
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const inputEl = useRef(null)
  const openSearch = () => {
    setInputActive(true)
  }
  const closeSearch = () => {
    setInputActive(false)
    setValue('')
  }
  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value)
    } 
    
    if (escPressed && inputActive) {
      closeSearch()
    }
  })

  useEffect(() => {
    if (inputActive) {
      inputEl.current.focus()
    }
  })

  return (
    <div className='alert alert-primary mb-0'>
      {
        !inputActive &&
        <div className="d-flex justify-content-between align-items-center input-line row">
          <span className='col-10'>{title}</span>
          <button className='icon-button col-2' onClick={openSearch}><FontAwesomeIcon title='搜索' icon={faSearch} /></button>
        </div>
      }
      {
        inputActive &&
        <div className="row">
          <input type="text" ref={inputEl} className='form-control col-10 input-line' value={value} onChange={(e) => { setValue(e.target.value) }} />
          <button type='button' className='col-2 icon-button' onClick={closeSearch}><FontAwesomeIcon title='关闭' icon={faTimes} /></button>
        </div>
      }
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch