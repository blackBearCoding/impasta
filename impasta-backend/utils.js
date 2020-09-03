export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export const randArrayElement = arr => {
  return arr[rand(0, arr.length - 1)];
}

export const randObjectElement = obj => {
  return randArrayElement(Object.keys(obj));
}

export const mapIdToName = (playerList, idList) => {
  if (typeof idList === 'string') {
    return playerList.find(player => player.playerId === idList).playerName;
  } else {
    return idList.map(id => {
      return playerList.find(player => player.playerId === id).playerName;
    });
  }
}