const sortByGmaeName = (games) => {
  return games.sort((a, b) => {
    if (a.gameName < b.gameName) {
      return -1;
    }
    if (a.gameName > b.gameName) {
      return 1;
    }
    return 0;
  })
}
export default sortByGmaeName