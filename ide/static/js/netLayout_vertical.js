// Assumption: test differs from train in the source of input and
// some additions of accuracy layer

// designed to work with  alexNet, vgg, googleNet and resNet.
// will work with all prototxts which follows our assumption
// but the UI may not be clean.

export default function(net){
// map[x] = [y1, y2, y3]
let map = {};
let position = {};
let processed = {};

Object.keys(net).forEach(layerId => {
  processed[layerId] = false;
});
function isProcessPossible(layerId){
  let inputs = net[layerId].connection.input;
  let i = 0;
  for(i = 0; i < inputs.length; i++){
    if (processed[inputs[i]] === false) {
      return false;
    }
  }
  return true;
}

// allocatePosition finds the closest position available to preferred position
function allocatePosition(layerId, preferredPosition){
  if (!map.hasOwnProperty(preferredPosition[1])) {
    map[preferredPosition[1]] = [];
  }
  let positionsX = map[preferredPosition[1]];
  if (positionsX.indexOf(preferredPosition[0]) != -1) {
    let temp = preferredPosition[0], i=2;
    while (1) {
      if(positionsX.indexOf(temp+i) === -1){
        // may be avoid overlapping edges
        if (map[preferredPosition[1] - 1].indexOf(temp + i) === -1) {
          position[layerId] = [preferredPosition[1], temp + i];
          map[preferredPosition[1]].push(position[layerId][1]);
          return;
        }
      }
      if(positionsY.indexOf(temp-i) === -1){
        // may be avoid overlapping edges
        if (map[preferredPosition[1] - 1].indexOf(temp - i) === -1) {
          position[layerId] = [preferredPosition[1], temp - i];
          map[preferredPosition[1]].push(position[layerId][1]);
          return;
        }
      }
      i = i + 2;
    }

  } else {
    position[layerId] = preferredPosition;
    map[preferredPosition[1]].push(position[layerId][1]);
    return;
  }
}

let stack = [];
let parentMap = {};
let i = null, layerId = null, parentId =  null, inputLength = null, outputLength = null;

// finding the input layers to start DFS
Object.keys(net).forEach(layerId => {
  if (net[layerId].info.type === 'Data' || net[layerId].info.type === 'Input' || net[layerId].info.type === 'HDF5Data') {
    stack.push(layerId);
    parentMap[layerId] = null;
  }
});

// custom DFS
while (stack.length) {
  i = stack.length - 1;
  while (isProcessPossible(stack[i]) === false) {
    i = i - 1;
  }
  layerId = stack[i];
  stack.splice(i, 1);
  parentId = parentMap[layerId];
  inputLength = net[layerId].connection.input.length;
  if (parentId != null){
    outputLength = net[parentId].connection.output.length;
  }
  if (parentId === null) {
    position[layerId] = [0,0];
  } else if(inputLength === 1 && outputLength === 1){
    allocatePosition(layerId, [position[parentId][0], position[parentId][1]+1]);
  } else if (inputLength > 1){
    // x position = max of inputs + 1
    // y position = mean of inputs
    let sum = 0, mean = 0, max = 0;
    net[layerId].connection.input.forEach(inputId => {
      sum = sum + position[inputId][0];
      if (position[inputId][1] > max) {
        max = position[inputId][1];
      }
    });
    mean = Math.floor(sum / inputLength);
    allocatePosition(layerId, [mean, max + 1]);
  } else if (inputLength === 1 && outputLength != 1) {
    let index = net[parentId].connection.output.indexOf(layerId);
    allocatePosition(layerId, [position[parentId][0] + (outputLength - 1) - 2 * index, position[parentId][1] + 1]);
  }

  net[layerId].connection.output.forEach(outputId => {
    if (stack.indexOf(outputId) === -1) {
      stack.push(outputId);
      parentMap[outputId] = layerId;
    }
  });

  processed[layerId] = true;

}
return position;
}
