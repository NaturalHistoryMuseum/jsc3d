# JSC3D (Modular Fork)

A fork of [hmu/jsc3d](https://github.com/humu2009/jsc3d) that adds a `package.json` file and generates a CJS build.
Used by the [Phenome10k](https://github.com/NaturalHistoryMuseum/phenome-10k/) project.

## Install

```
npm install naturalhistorymuseum/jsc3d
```

## Build

```
npm run build
```

## Use

```javascript
import CTM from 'jsc3d/ctm-loader';
import { Viewer, registerLoader } from 'jsc3d';

registerLoader(CTM);

const viewer = new Viewer(document.querySelector('canvas'));

// https://github.com/humu2009/jsc3d/blob/wiki/StartupParameters.md
viewer.setParameter('SceneUrl', '/my-ctm.ctm');
viewer.setParameter('RenderMode', 'smooth');
viewer.setParameter('Renderer', 'webgl');
viewer.setParameter('ModelColor', '#666666');
viewer.setParameter('Definition', 'high');
viewer.setParameter('ProgressBar', 'on');
viewer.setParameter('BackgroundColor1', '#09090a');
viewer.setParameter('BackgroundColor2', '#676767');

viewer.init();
viewer.update();
```
