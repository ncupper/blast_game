/**
 * @author GaryQK
 * @date 2019/6/5
 * @Description:
*/
import {IBinding} from "../Inter/IBinding";
import IKernel from "../Inter/IKernel";
import {IBindingToSyntax} from "../Inter/IBindingToSyntax";

export  default class  BindingToSyntax implements IBindingToSyntax {
    private value:any=null;
    private c: { new (...args: any[]): any } | null = null; // ✅ Исправлено: допускает null + правильный тип
    private isSingleton:boolean=false;

    constructor(private _binding:IBinding,private _kernel: IKernel){
    }
    get kernel(){
        return this._kernel;
    }
    get binding(){
        return this._binding;
    }
    
    to<T>(c:{new():T},singleton:boolean=false) {
        //Reflect.hasMetadata('design:type',c)
        if(singleton){
            this.isSingleton=singleton;
        } else {
            this.value=null;
        }
        this.c=c;
    }
    
    toConstant<T>(value:T) {
        this.isSingleton=true;
        this.c=null;
        this.value=value;
    }
    
    get(){
        if (this.isSingleton && this.value)
            return this.value;

        if (!this.c)
            return null;
        
        let result = new this.c();

        this.kernel.inject(result);
        if (typeof result.onInjected === 'function') {
            result.onInjected();
        }

        return result;
    }
}