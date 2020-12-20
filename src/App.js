import React, { useState, useEffect } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';

import FileSearch from './components/FileSearch/FileSearch.js'
import FileList from './components/FileList/FileList.js'
import BottonBtn from './components/BottonBtn/BottonBtn'
import TabList from './components/TabList/TabList'

// moke数据
import defaultFiles from './utils/defaultFiles.js'

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'



const App = () => {
  const [files, setFiles] = useState(defaultFiles)
  const [searchFiles, setSearchFiles] = useState([])
  const [activeFileID, setActiveFileId] = useState('')
  const [openFileIDs, setOpenFileIDs] = useState([])
  const [unsaveFileIds, setUnsaveFileIds] = useState([])
  const openedFiles = openFileIDs.map(fileId => files.find(file => file.id === fileId))
  const activeFile = files.find(file => file.id === activeFileID)
  const showSearchFiles = searchFiles.length ? searchFiles : files
  // 根据输入的内容筛选markdown列表
  const onFileSearch = (value) => {
    const newFiles = files.filter(file => file.title.includes(value))
    setSearchFiles(newFiles)
  }

  // 编辑markdown文章的title
  const onSaveEdit = (id, name) => {
    const newFiles = files.map(file => {
      if(file.isNewStatus){
        delete file.isNewStatus
      }
      return file.id === id ? { ...file, title: name } : file
    })
    setFiles(newFiles)

  }

  // 删除左侧列表
  const onFileDelete = (id) => {
    setFiles(files.filter(file => file.id !== id))
  }

  // 点击右侧的tab切换显示markdown编辑器的内容
  const onTabClick = (id) => {
    setActiveFileId(id)
  }

  // 关闭右侧的tab展示的markdown选项
  const onCloseTab = (id) => {
    let openIds = openFileIDs.filter(fileId => fileId !== id)
    setOpenFileIDs([...openIds])
    activeFileID === id && setActiveFileId(openIds[0] ? openIds[0] : '')
  }

  // 选择文件添加到编辑的tab栏
  const onClickFile = (id) => {
    setActiveFileId(id)
    setOpenFileIDs([...new Set([...openFileIDs, id])])
  }

  // 编辑markdown内容
  const handleEditMarkdown = (id, value) => {
    const newFiles = files.map(file => {
      if (file.id === id && file.body !== value) {
        setUnsaveFileIds([...new Set([...unsaveFileIds, id])])
        return { ...file, body: value }
      } else {
        return file
      }
    })
    setFiles(newFiles)
  }

  // 新建markdown
  const handleAddNewFile = () => {
    if(files.find(file => file.isNewStatus)){
      return
    }
    // 生成新的id
    const newId = uuidv4()
    const newFile = {
      id: newId,
      title: '',
      body: '## this is new markdown!!!',
      createdAt: new Date().getTime(),
      isNewStatus: true,
    }
    setActiveFileId(newId)
    setOpenFileIDs([...openFileIDs,newId])
    setFiles([...files, newFile])
  }

  useEffect(() => {

  }, [])

  return (
    <div className="App container-fluid px-0">
      <div className='row no-gutters'>
        <div className='col-3 left-panel'>
          <FileSearch title='我的云文档' onFileSearch={onFileSearch} />
          <FileList files={showSearchFiles} onSaveEdit={onSaveEdit} onFileDelete={onFileDelete} onClickFile={onClickFile} />
          <div className='row no-gutters button-grounp'>
            <div className='col'>
              <BottonBtn text='新建' colorClass='btn-primary no-border' icon={faPlus} onBtnClick={handleAddNewFile}></BottonBtn>
            </div>
            <div className='col'>
              <BottonBtn text='导入' colorClass='btn-success no-border' icon={faFileImport}></BottonBtn>
            </div>
          </div>
        </div>
        <div className='col-9 right-pannel'>
          {
            !activeFile ? (
              <div className='start-page'>
                选择或者新建markdown文件
              </div>
            )
              :
              (
                <>
                  <TabList
                    files={openedFiles}
                    onTabClick={onTabClick}
                    onCloseTab={onCloseTab}
                    activeId={activeFileID}
                    unsaveIds={unsaveFileIds}
                  />
                  <SimpleMDE
                    value={activeFile.body}
                    onChange={(value) => { handleEditMarkdown(activeFile.id, value) }}
                    options={{
                      minHeight: '460px',
                    }}
                  />
                </>
              )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
