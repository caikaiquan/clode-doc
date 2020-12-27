import React, { useState } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';

import FileSearch from './components/FileSearch/FileSearch.js'
import FileList from './components/FileList/FileList.js'
import BottonBtn from './components/BottonBtn/BottonBtn'
import TabList from './components/TabList/TabList'

// // moke数据
// import defaultFiles from './utils/defaultFiles.js'

// utils
import { flattenArr, objToArr } from './utils/helper.js'

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'easymde/dist/easymde.min.css'

// 文件操作 fileHelper.js
import fileHelper from './utils/fileHelper.js'

// nodejs 模块
const { join, basename, extname, dirname } = window.require('path')
const { remote } = window.require('electron')
const saveLocation = remote.app.getPath('documents') + '/markdown/'
// console.log(remote.app.getPath('documents'))
// console.log(remote.app.getPath('home'))
// console.log(join(saveLocation,'index.md'))
const Store = window.require('electron-store')
const fileStore = new Store({ 'name': 'Files Data' })
// store.set('name','张三丰')
// store.delete('name')
// console.log(store.get('name'),'store-name')

// 存储文件数据到store
const saveFilesToStore = (files) => {
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file;
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    // console.log(flattenArr)
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

// fileStore.delete('files')
console.log(fileStore.get('files'))

const App = () => {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [searchFiles, setSearchFiles] = useState([])
  const [activeFileID, setActiveFileId] = useState('')
  const [openFileIDs, setOpenFileIDs] = useState([])
  const [unsaveFileIds, setUnsaveFileIds] = useState([])
  const openedFiles = openFileIDs.map(fileId => { return objToArr(files).find(file => file.id === fileId) })
  const activeFile = activeFileID ? files[activeFileID] : null
  const showSearchFiles = searchFiles.length ? searchFiles : objToArr(files)
  // 根据输入的内容筛选markdown列表
  const onFileSearch = (value) => {
    if (!value) {
      setSearchFiles([])
      return
    }
    const newFiles = objToArr(files).filter(file => file.title.includes(value))
    setSearchFiles(newFiles)
  }

  // 编辑markdown文章的title
  const onSaveEdit = (id, name) => {
    // 如果是新建文件
    if (files[id].isNewStatus) {
      const newPath = join(saveLocation, `${name}.md`)
      files[id]['path'] = newPath;
      files[id]['title'] = name;
      delete files[id].isNewStatus
      fileHelper.writeFile(newPath, files[id].body)
        .then(() => {
          console.log('write-success')
          saveFilesToStore(files)
          setFiles({ ...files })
        })
        .catch(err => { console.log(err) })
    } else {
      const dirPath = dirname(files[id].path)
      const newPath = `${dirPath}\\${name}.md`
      const oldPath = files[id]['path'];
      files[id]['path'] = newPath;
      fileHelper.renameFile(oldPath, newPath)
        .then(() => {
          console.log('rename-success');
          files[id]['title'] = name;
          saveFilesToStore(files)
          setFiles({ ...files })
        })
        .catch(err => { console.log(err) })
    }

  }

  // 删除左侧列表
  const onFileDelete = (id) => {
    if (id === activeFileID) {
      setActiveFileId('')
    }

    if (openFileIDs.includes(id)) {
      setOpenFileIDs(openFileIDs.filter(fileId => fileId !== id))
    }

    if (unsaveFileIds.includes(id)) {
      setUnsaveFileIds(unsaveFileIds.filter(fileId => fileId !== id))
    }

    delete files[id]
    setFiles({...files})
    saveFilesToStore({...files})
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
    // 如果有正在新建的文件不能再新建
    if (activeFileID && files[activeFileID]['isNewStatus']) {
      return
    }

    console.log(openFileIDs.includes(id),'openFileIDs.includes(id)')
    console.log(openFileIDs,'openFileIDs')
    if (!openFileIDs.includes(id)) {
      setOpenFileIDs([...openFileIDs, id])
    }
    const currentFile = files[id]
    console.log(currentFile,'currentFile')
    if (!currentFile['body']) {
      fileHelper.readFile(currentFile['path'])
        .then(body => {
          currentFile['body'] = body
          setFiles({ ...files, [id]: currentFile })
        })
    }
    setActiveFileId(id)
  }

  // 编辑markdown内容
  const handleEditMarkdown = (id, value) => {
    files[id].body !== value && setUnsaveFileIds([...new Set([...unsaveFileIds, id])])
    files[id]['body'] = value;
    setFiles({ ...files })
  }

  // 新建markdown
  const handleAddNewFile = () => {
    // 如果有正在新建的文件不能再新建
    if (activeFileID && files[activeFileID]['isNewStatus']) {
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
    setOpenFileIDs([...openFileIDs, newId])
    setFiles({ ...files, [newId]: newFile })
  }

  // 保存markdown
  const handleSaveFile = () => {
    if (!activeFileID || !unsaveFileIds.includes(activeFileID)) {
      return
    }
    let title = files[activeFileID].title;
    let content = files[activeFileID].body;
    fileHelper.writeFile(join(saveLocation, `${title}.md`), content)
      .then(() => {
        console.log('write-success')
        setUnsaveFileIds(unsaveFileIds.filter(id => id !== activeFileID))
      })
      .catch(err => { console.log(err) })
  }

  // 点击导入文件
  const handleImportFile = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入的markdown',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Markdown files', extensions: ['md'] }]
    })
      .then(result => {
        // console.log(result.canceled)
        // console.log(result.filePaths)
        const paths = result.filePaths;
        const filterPath = paths.filter(path => {
          const alreadyAdded = Object.values(files).find(file => file.path === path)
          return !alreadyAdded
        })
        const importFilesArr = filterPath.map(path => {
          return {
            id: uuidv4(),
            path,
            title: basename(path, extname(path)),
            createdAt: new Date().getTime(),
          }
        })
        const newFiles = { ...files, ...flattenArr(importFilesArr) }
        setFiles(newFiles)
        saveFilesToStore(newFiles)
        if (importFilesArr.length > 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: `提示`,
            message: `成功导入${importFilesArr.length}个文件`
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

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
              <BottonBtn text='导入' colorClass='btn-success no-border' icon={faFileImport} onBtnClick={handleImportFile}></BottonBtn>
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
                    key={activeFile.id}
                    onChange={(value) => { handleEditMarkdown(activeFile.id, value) }}
                    options={{
                      minHeight: '460px',
                    }}
                  />
                  <div className='row'>
                    <div className="col-4">
                      <BottonBtn text='保存' colorClass='btn-success no-border' icon={faFileImport} onBtnClick={handleSaveFile}></BottonBtn>
                    </div>
                  </div>
                </>
              )
          }

        </div>
      </div>
    </div>
  );
}

export default App;
