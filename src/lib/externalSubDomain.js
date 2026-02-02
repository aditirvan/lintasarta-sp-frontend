const subDomainCloudekaArray = ['master','pre-deploy','cmd','development','develop','staging','localhost','localhost:8080'];
const getSubDomain = () => {
    const host = window.location.host;
    const parts = host.split('.');
    const subDomain = parts[0];
    const subDomainCloudeka = subDomainCloudekaArray;
    let externalSubdomain = '';
    if (!subDomainCloudeka.includes(subDomain)) {
        externalSubdomain = subDomain;
    }
    return externalSubdomain;
}

export default {
    getSubDomain,
    subDomainCloudekaArray
}