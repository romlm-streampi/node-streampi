import { PluginBundle, PluginScript, PluginExport } from "@model/plugin-export";
import { IScriptDescriptor } from "@model/script";


export async function GetPlugins(names: string[]): Promise<PluginScript[]> {

	return await names.map(async (name) => {
		try {
			const pluginExports: PluginExport[] = (await import(`@plugins/${name}`)).default;
			const pluginComponents: PluginScript[] = [];
			for (let exp of pluginExports.filter(({ script, component }) => (script && component))) {
				const descriptor: IScriptDescriptor = {
					id: {
						moduleName: name,
						script: exp.script
					},
					info: {
						displayName: exp.displayName || exp.script,
						description: exp.description,
						category: exp.category
					}
				}
				const bundle: PluginBundle = new PluginBundle(descriptor.id);

				pluginComponents.push({ descriptor, bundle, component: exp.component });

			}

			return pluginComponents;
		} catch(err) {
			console.error(err.message);
			return [];
		}
	}).reduce(async (a, b) => [...(await a), ...(await b)]);
}
