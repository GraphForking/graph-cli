import toolbox from 'gluegun/toolbox'
import { loadManifest } from './util/load-manifest'

// Spec version to 0.0.2 uses top level templates. graph-cli no longer supports
// 0.0.1 which used nested templates.
module.exports = {
  name: 'Bump mapping specVersion from 0.0.1 to 0.0.2',
  predicate: async ({ sourceDir: _sourceDir, manifestFile }) => {
    const manifest = loadManifest(manifestFile)
    return (
      manifest &&
      typeof manifest === 'object' &&
      manifest.specVersion &&
      manifest.specVersion === '0.0.1'
    )
  },
  apply: async ({ manifestFile }) => {
    await toolbox.patching.replace(
      manifestFile,
      'specVersion: 0.0.1',
      'specVersion: 0.0.2',
    )
    await toolbox.patching.replace(
      manifestFile,
      "specVersion: '0.0.1'",
      "specVersion: '0.0.2'",
    )
    await toolbox.patching.replace(
      manifestFile,
      'specVersion: "0.0.1"',
      'specVersion: "0.0.2"',
    )
  },
}