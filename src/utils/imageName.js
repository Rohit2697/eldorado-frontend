const imageName = (path) => {
  const pathArr = path.split('/')
  return pathArr[pathArr.length - 1]
}

export default imageName