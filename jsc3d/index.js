import JSC3D from "./jsc3d.js";

export function registerLoader(loader, extension = null) {
  JSC3D.LoaderSelector.registerLoader(extension || loader.defaultExtension, loader);
}

export const Viewer = JSC3D.Viewer;
export default Viewer;
