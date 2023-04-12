class Exclusions {
    private exclusions: string[] = [
      'deleted',
      'deletedBy',
      'deletedOn',
      'createdOn',
      'createdBy',
      'modifiedOn',
      'modifiedBy',
      'createdBy',
    ];
  
    private static _instance: Exclusions;
  
    public static get instance() {
      return this._instance || (this._instance = new this());
    }
  
    genericExclusion = <T>(additions?: string[]): (keyof T)[] => {
      if (additions !== undefined) {
        this.exclusions = [...this.exclusions, ...additions];
      }
      return this.exclusions as (keyof T)[];
    };
  }
  
  const ExclusionsInstance = Exclusions.instance;
  
  export const genericExclusions = ExclusionsInstance.genericExclusion;