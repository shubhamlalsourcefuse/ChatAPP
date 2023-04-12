import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {
  AuthDbSourceName,
  Tenant,
  TenantConfig,
  TenantConfigRepository,
  TenantRepository,
} from '@sourceloop/authentication-service';
import {DefaultSoftCrudRepository, TenantStatus} from '@sourceloop/core';
import { COMMON } from '../constants';

export class CustomTenantRepository extends DefaultSoftCrudRepository<
  Tenant,
  typeof Tenant.prototype.id
> {
  public readonly tenantConfigs: HasManyRepositoryFactory<
    TenantConfig,
    typeof Tenant.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter(COMMON.KEY.TENANT_CONFIG_REPOSITORY)
    protected tenantConfigRepositoryGetter: Getter<TenantConfigRepository>,
    @repository(TenantRepository)
    private readonly tenantRepo: TenantRepository,
    @repository(TenantConfigRepository)
    private readonly tenantConfigRepo: TenantConfigRepository,
  ) {
    super(Tenant, dataSource);

    this.tenantConfigs = this.createHasManyRepositoryFactoryFor(
      COMMON.KEY.TENANT_CONFIGS,
      tenantConfigRepositoryGetter,
    );
    this.registerInclusionResolver(
      COMMON.KEY.TENANT_CONFIGS,
      this.tenantConfigs.inclusionResolver,
    );
  }

  async createNewTenant(tenantDTO: Tenant) {
    tenantDTO.status = TenantStatus.ACTIVE;
    const savedTenant = await this.tenantRepo.create(tenantDTO);
    return new Tenant({createdOn: savedTenant.createdOn});
  }

  async createNewTenantConfig(tenantConfigDTO: TenantConfig) {
    const savedTenantConfig = await this.tenantConfigRepo.create(
      tenantConfigDTO,
    );
    return new TenantConfig({createdOn: savedTenantConfig.createdOn});
  }
}