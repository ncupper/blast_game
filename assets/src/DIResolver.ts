import SingletonFactory from "./misc/singleton";
import IKernel from "./Framework/DI/Inter/IKernel";
import StandardKernel from "./Framework/DI/Core/StandardKernel";
import INinjectModule from "./Framework/DI/Inter/INinjectModule";

const resolverFactory = new SingletonFactory<IKernel>(getKernel);

export default function getResolver() : IKernel {
    return resolverFactory.getInstance();
}

const modules:INinjectModule[] = [];

export function registerModule(module:INinjectModule) {
    modules.push(module);
}

function getKernel() : IKernel {
    return new StandardKernel(modules);
}