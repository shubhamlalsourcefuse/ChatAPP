import { BindingScope, injectable } from "@loopback/context";
import { AnyObject, repository } from "@loopback/repository";
import { AuthClient, AuthClientRepository } from "@sourceloop/authentication-service";


@injectable({scope:BindingScope.TRANSIENT})
export class AuthClientService {

    constructor(
        @repository(AuthClientRepository)
        private readonly authClientRepository: AuthClientRepository

    ){}

    async create (authClient: AuthClient, options: AnyObject){
        const savedAuthClient = await this.authClientRepository.create(authClient
            );
        return new AuthClient({createdOn: savedAuthClient.createdOn});
    }
}