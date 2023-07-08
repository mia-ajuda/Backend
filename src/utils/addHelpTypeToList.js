const addHelpTypeToList = (helpList, type) => helpList.map((help, index) => ({ ...help, type, index: index + 1 }));
module.exports = addHelpTypeToList;
