import axios from '@/lib/axios'

const project:any = {}

project.findByName = async (projectName:any) => {
    const response = await axios.instance.get(`/user/project/${encodeURI(projectName)}`)
    if (response.status === 200) return response.data.data
    else return null
}
project.findById = async (projectId:any) => {
    const response = await axios.instance.get(`/user/project/detail/${projectId}`)
    if (response.status === 200) return response.data.data
    else return null
}

project.getActiveProject = async () => {
    let project = localStorage.getItem('currentProj')
    return project ? JSON.parse(project) : null
}

project.getActiveProjectID = async () => {
    const project = localStorage.getItem('currentProj')
    let data = project ? JSON.parse(project) : null
    return data && data.id ? data.id : null
}

project.getCurrentOrg = async () => {
    let currentOrg = localStorage.getItem('currentOrg')
    currentOrg = currentOrg ? JSON.parse(currentOrg) : null
    return currentOrg
}

project.getCurrentOrgID = async () => {
    let currentOrg:any = localStorage.getItem('currentOrg')
    currentOrg = currentOrg ? JSON.parse(currentOrg) : null
    const currentOrgID = currentOrg ? currentOrg.id : null
    return currentOrgID
}

const connectWS = async (url:any) => {
    // const currentProjectID = await libProject.getActiveProjectID()
    // return Vue.use(VueNativeSock, `${process.env.VUE_APP_WS_BASE_URL}/${url}?project_id=${currentProjectID}`, {
    //   connectManually: true,
    //   reconnection: true,
    //   reconnectionAttempts: 1000,
    //   reconnectionDelay: 10,
    // })
}

project.connectWSInstance = async () => {
    await connectWS('instances_status')
}

project.connectWSCustomImages = async () => {
    await connectWS('images_status')
}

export default project