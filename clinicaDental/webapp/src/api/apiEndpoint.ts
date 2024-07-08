export default function getApiEndpoint() {
    const host = process.env.DOMAIN || "localhost";
    const port = process.env.RESTAPI_PORT || "5444";
    return `https://${host}:${port}/api`;
}