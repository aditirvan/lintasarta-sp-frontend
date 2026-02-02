interface region{
    city: string,
    regionid: string,
    regiom: string
}
export interface instance{
    __typename:'instance'
    region: region,
    instanceName:string
}
export interface storage{
    __typename: 'storage'
    region: region
}
export interface Snapshot{
    type: 'instance' | 'storage',
    instance: instance
    storage: storage
    name: string
    createddate: number,
    region: region
}