
export async function getProducts(token: string): Promise<any[]> {
    const headers: HeadersInit = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const requestOptions: RequestInit = {
        method: 'GET',
        headers,
        redirect: 'follow'
    };

    const url = `http://${process.env.ERP_URL}:${process.env.ERP_PORT}/product`;
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
}