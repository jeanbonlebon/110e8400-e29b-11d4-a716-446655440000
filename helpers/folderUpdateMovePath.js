module.exports = function folderUpdateMovePath(fromFolder, toFolder, folderPath) {

    let startPos = fromFolder.path.lastIndexOf(fromFolder.name)
    let res = ''

    if(toFolder != null) {
        res = toFolder.path + folderPath.substring(startPos - 1 , folderPath.lenght)
    } else {
        res = folderPath.substring(startPos - 1 , folderPath.lenght)
    }

    return res
}
