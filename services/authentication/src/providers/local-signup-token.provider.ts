import { Provider, ValueOrPromise } from "@loopback/context";
import { SignupTokenHandlerFn } from "@sourceloop/authentication-service";


export class LocalSignupTokenProvider implements Provider<SignupTokenHandlerFn> {
    constructor(){}

    value(): ValueOrPromise<SignupTokenHandlerFn> {
        return async dto=>{
            console.log(dto);
        }
    }
}