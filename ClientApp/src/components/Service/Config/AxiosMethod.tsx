import AxiosConfig from "./AxiosConfig";

export const AxiosPostJson = async (path: any, data = {}) => {
    const response = await AxiosConfig.post(path, data);
    return response;
}

export const AxiosGetJson = async (path: any, data = {}) => {
    const config = {} as any;
    if (data) config.params = data;
    const response = await AxiosConfig.get(path, config);
    return response.data;
}

export const AxiosBlobJson = async (path: any, data = {}) => {
    const response = await AxiosConfig.post(path, data, { responseType: "blob" });
    return response;

}