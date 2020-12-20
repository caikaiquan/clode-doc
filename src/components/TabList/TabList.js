/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'

const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <div className='nav nav-pills tab-list'>
      {
        files.map(file => {
          const withUnsaved = unsaveIds.includes(file.id) || file.isNewStatus;
          const fClassName = classNames({
            'nav-link': true,
            'active': file.id === activeId,
            'with-unsaved': withUnsaved
          })
          return (
            <div className='nav-item pointer' key={file.id}>
              <a className={fClassName} onClick={(e) => { e.preventDefault(); onTabClick(file.id) }}>
                {file.title}
                <span className='ml-2'>
                  <FontAwesomeIcon title='关闭' icon={faTimes} className='close-icon' onClick={(e) => { e.stopPropagation(); onCloseTab(file.id) }} />
                  {
                    withUnsaved && <span className='rounded-circle unsave-icon'></span>
                  }
                </span>
              </a>
            </div>
          )
        })
      }
    </div>
  )
}


TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func
}

TabList.defaultProps = {
  unsaveIds: []
}
export default TabList