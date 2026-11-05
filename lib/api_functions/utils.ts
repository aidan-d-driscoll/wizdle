import { Binary } from "mongodb";

export async function postJson<T>(url: string, data: unknown): Promise<T> {
    let targetUrl = url;

    if (!URL.canParse(url)) {
        // Fallback to your local port when executing from server scripts
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        targetUrl = `${baseUrl.replace(/\/$/, '')}${url}`;
    }

    const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${text}`);
    }
    return res.json();
}

export function toBinaryId(base64Id: string) {
    const buf = Buffer.from(base64Id, "base64url");
    return new Binary(buf, 0);
}

export function serializeRawID(id: Uint8Array): string{
    return Buffer.from(id).toString("base64url");
}

export function deserializeRawID(idString: string): Uint8Array{
    return new Uint8Array(Buffer.from(idString, "base64url"));
}