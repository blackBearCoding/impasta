export const mapIdToName = (playerList, idList) => {
  if (typeof idList === 'string') {
    return playerList.find(player => player.playerId === idList).playerName;
  } else {
    return idList.map(id => {
      return playerList.find(player => player.playerId === id).playerName;
    });
  }
}