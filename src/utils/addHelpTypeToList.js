const addHelpTypeToList = (helpList, type) => helpList.map((help) => ({ ...help, type }));
module.exports = addHelpTypeToList;
