import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import useKeyPress from '../../hooks/useKeyPress.js'
import useContextMenu from '../../hooks/useContextMenu.js'

// 引入node模块 Menu  MenuItem

// const { remote } = window.require('electron')
// const { Menu, MenuItem } = remote;


const FileList = ({ files, onClickFile, onSaveEdit, onFileDelete }) => {

  const [editStatus, setEditStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const inputEl = useRef(null)
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  const handleEdit = (file) => {
    setEditStatus(file.id)
    setFileName(file.title)
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
        console.log('点击了打开按钮' , clickedItem)
      }
    },
    {
      label: '重命名',
      click: () => {
        console.log('111重命名' , clickedItem)
      }
    },
    {
      label: '删除',
      click: () => {
        console.log('删除3333' , clickedItem)
      }
    }
  ], '.file-list')

  return (
    <div className='file-list list-group list-group-flush file-list'>
      {
        files.map((file) => (
          <div className='list-group-item bg-light d-flex align-items-center file-item row pointer mx-0' key={file.id}>
            {
              editStatus !== file.id ?
                (
                  <>
                    <span className='col-2'><FontAwesomeIcon icon={faMarkdown} /></span>
                    <span className='col-6 text-over d-flex align-items-center' title={file.title} onClick={() => { onClickFile(file.id) }}>
                      <span className='text-over input-line'>{file.title}</span>
                    </span>
                    <button type='button' className='icon-button col-2' onClick={() => { handleEdit(file) }}>
                      <FontAwesomeIcon icon={faEdit} title='编辑' />
                    </button>
                    <button type='button' className='icon-button col-2' onClick={() => { onFileDelete(file.id) }}>
                      <FontAwesomeIcon icon={faTrash} title='删除' />
                    </button>
                  </>
                ) :
                (
                  <>
                    <input placeholder='请输入标题' type="text" ref={inputEl} className='form-control col-10 input-line' value={fileName} onChange={(e) => { setFileName(e.target.value) }} />
                    <button type='button' className='col-2 icon-button' onClick={() => { closeEdit(file) }}><FontAwesomeIcon title='关闭' icon={faTimes} /></button>
                  </>
                )
            }
          </div>
        ))
      }
    </div>
  )
}


FileList.propTypes = {
  files: PropTypes.array,
  onClickFile: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func
}

export default FileList