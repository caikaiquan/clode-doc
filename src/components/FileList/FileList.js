import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from '../../hooks/useKeyPress.js'
import useContextMenu from '../../hooks/useContextMenu.js'
import { findParentDom } from '../../utils/helper.js'
import useWinResize from '../../hooks/useWinResize.js'

// style
import './FileList.css'

// 引入node模块 Menu  MenuItem

// const { remote } = window.require('electron')
// const { Menu, MenuItem } = remote;
const FileList = ({ files, onClickFile, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const inputEl = useRef(null)
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  const { winHeight } = useWinResize()
  const fileListStype = { height: `${winHeight-95}px`, overflowY: 'auto', }
  const handleEdit = (id, title) => {
    setEditStatus(id)
    setFileName(title)
  }
  const closeEdit = (file) => {
    setEditStatus('')
    setFileName('')
    if (file && !file.title && file.isNewStatus) {
      onFileDelete(file.id)
    }
  }

  useEffect(() => {
    if (enterPressed && editStatus) {
      onSaveEdit(editStatus, fileName);
      closeEdit()
    }

    if (escPressed && editStatus) {
      closeEdit()
    }
  })

  useEffect(() => {
    if (editStatus) {
      inputEl.current.focus()
    }
  }, [editStatus])

  useEffect(() => {
    files.forEach(file => {
      if (file.isNewStatus) {
        setEditStatus(file.id)
        setFileName(file.title)
        if (inputEl.current) {
          inputEl.current.focus()
        }
      }
    });
  }, [files])

  const clickedItem = useContextMenu([
    {
      label: '打开',
      click: () => {
        const parentElement = findParentDom(clickedItem.current, 'file-item');
        const fileItem = parentElement.dataset;
        if (fileItem) {
          let { id } = fileItem;
          onClickFile(id)
        }
      }
    },
    {
      label: '重命名',
      click: () => {
        const parentElement = findParentDom(clickedItem.current, 'file-item');
        const fileItem = parentElement.dataset;
        if (fileItem) {
          let { id, title } = fileItem;
          handleEdit(id, title)
        }
        console.log('111重命名', clickedItem)
      }
    },
    {
      label: '删除',
      click: () => {
        const parentElement = findParentDom(clickedItem.current, 'file-item');
        const fileItem = parentElement.dataset;
        if (fileItem) {
          let { id } = fileItem;
          onFileDelete(id)
        }
        console.log('删除3333', clickedItem)
      }
    }
  ], '.file-list')

  return (
    <ul className='file-list list-group my_scro' style={fileListStype}>
      {
        files.map((file) => (
          <li className='list-group-item bg-light d-flex align-items-center file-item row pointer mx-0 border-radius-0' key={file.id} data-id={file.id} data-title={file.title}>
            {
              editStatus !== file.id ?
                (
                  <>
                    <span className='col-2'><FontAwesomeIcon icon={faMarkdown} /></span>
                    <span className='col-6 text-over d-flex align-items-center' title={file.title} onClick={() => { onClickFile(file.id) }}>
                      <span className='text-over input-line'>{file.title}</span>
                    </span>
                    {/* <button type='button' className='icon-button col-2' onClick={() => { handleEdit(file.id, file.title) }}>
                      <FontAwesomeIcon icon={faEdit} title='编辑' />
                    </button>
                    <button type='button' className='icon-button col-2' onClick={() => { onFileDelete(file.id) }}>
                      <FontAwesomeIcon icon={faTrash} title='删除' />
                    </button> */}
                  </>
                ) :
                (
                  <>
                    <input placeholder='请输入标题' type="text" ref={inputEl} className='form-control col-10 input-line' value={fileName} onChange={(e) => { setFileName(e.target.value) }} />
                    <button type='button' className='col-2 icon-button' onClick={() => { closeEdit(file) }}><FontAwesomeIcon title='关闭' icon={faTimes} /></button>
                  </>
                )
            }
          </li>
        ))
      }
    </ul>
  )
}


FileList.propTypes = {
  files: PropTypes.array,
  onClickFile: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func
}

export default FileList