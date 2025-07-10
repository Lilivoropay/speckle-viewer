import { ViewerApp, DefaultPlugins } from "https://unpkg.com/@speckle/viewer@2.16.6";

const streamId = "d90ed744a3";
const modelId  = "733a102ccc";
const version  = "main";

async function start() {
  const viewer = new ViewerApp({
    container: document.getElementById("viewer"),
    plugins: [...DefaultPlugins]
  });
  await viewer.init();
  await viewer.loadObject(streamId, modelId, version);

  const tree = viewer.getWorldTree();
  const objs = tree.getFlattenedItems();
  const colors = ["#7f3fbf","#1fa672","#d96528","#ffcc00","#3273dc","#f14668"];
  const groups = {};
  let i = 0;

  for (const el of objs) {
    const props = await viewer.getObjectProperties(el.id);
    const asm = props["Assembly Name"];
    if (!asm) continue;
    if (!groups[asm]) {
      groups[asm] = { color: colors[i++ % colors.length], ids: [] };
    }
    groups[asm].ids.push(el.id);
  }

  for (const g of Object.values(groups)) {
    viewer.setColor(g.ids, g.color);
  }
}

start();
