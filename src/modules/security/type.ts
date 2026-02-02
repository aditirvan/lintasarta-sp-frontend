export interface Rule {
    type : string,
    ethertype: string,
    protocol: string,
    port_range_min: string,
    port_range_max: string,
    sources: string,
    direction: string,
    description: string
}