export interface Project {
    name: string,
    desc: string,
    orgname: string,
    org?:any,
    datecreated: number
}

export interface ProjectList {
    id : string
    name : string
    organization_id : string
    organization_name : string
}

export interface PaginatedProjectList {
    project: ProjectList[],
    paginate: any,
}

export const defaultPaginatedProjectList: PaginatedProjectList = {
    project: [],
    paginate: null,
}