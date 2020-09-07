// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === 'create-rectangles') {
  //   console.log('create rects')

  // }

  switch (msg.type) {
    case "create-rectangles": {
      createSamples(msg);
      break;
    }
    case "create-topic": {
      createTopic();
      break;
    }
    case "connect-topic": {
      connectTopic();
      break;
    }
    case "inspect": {
      inspect();
      break;
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};

function createSamples(msg: any) {
  const nodes: SceneNode[] = [];
  for (let i = 0; i < msg.count; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

function loadFont() {
  return figma.loadFontAsync({ family: "Roboto", style: "Regular" });
}

function currentFrame(): FrameNode | null {
  return figma.currentPage.findOne(
    (node) => node.type === "FRAME"
  ) as FrameNode;
}

async function createTopic() {
  await loadFont();
  const textNode = figma.createText();
  textNode.characters = "Hello world Hello worldHello world";
  textNode.resize(100, 10);
  textNode.textAutoResize = "HEIGHT";

  const frame = figma.createFrame();
  frame.layoutMode = "VERTICAL";
  frame.counterAxisSizingMode = "AUTO";
  frame.horizontalPadding = 10;
  frame.verticalPadding = 10;
  frame.cornerRadius = 5;
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 0 } }];

  frame.appendChild(textNode);

  frame.x = (Math.random() * 300) | 0;
  frame.y = (Math.random() * 300) | 0;

  console.log(textNode.width, textNode.height);

  // if (textNode.width > 100) {
  //   textNode.resize(100, 100)
  // }

  const plane = currentFrame();

  if (plane) {
    currentFrame().appendChild(frame);
    figma.currentPage.selection = [frame];
  } else {
    console.log("no top level frame");
  }
}

// selection 中的顺序，经过实验发现
// 跟选择的先后顺序无关，跟 layer 中的层级也无关
// 所以，还是根据名称来连接比较靠谱

function connectTopic() {
  const frames = figma.currentPage.selection
    .filter((sel) => sel.type === "FRAME")
    .sort((a, b) => parseInt(a.name) - parseInt(b.name)) as FrameNode[];
  if (frames.length < 2) return;
  const root = frames[0];

  for(let i=1;i<frames.length;i++) {
    _connectFrame(root, frames[i])
  }

}

function _connectFrame(from: FrameNode, to: FrameNode) {
  const line = figma.createLine()
  line.name = from.name + '-' + to.name
  // line.
}

function _center(node: SceneNode) {

}

function inspect() {
  console.log(figma.currentPage.selection)
}

class Rect {
  constructor(private node: SceneNode) {

  }

  center() {
    return 
  }


}
