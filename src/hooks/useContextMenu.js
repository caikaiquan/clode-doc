import { useEffect, useRef } from 'react'
// node模块
const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

// targetSelector 包含的dom元素才会弹出菜单
const useContextMenu = (menuList, targetSelector, deps) => {
  const clickedElement = useRef(null)
  useEffect(() => {
    const menu = new Menu();
    menuList.forEach(item => {
      menu.append(new MenuItem(item))
    })
    const handleContextMenu = (e) => {
      if (document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target
        menu.popup({ window: remote.getCurrentWindow() })
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  })
  return clickedElement
}

export default useContextMenu