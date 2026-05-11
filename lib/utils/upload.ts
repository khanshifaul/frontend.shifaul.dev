/**
 * Uploads a file to Cloudflare R2 using a presigned URL from the backend
 * @param file The file to upload
 * @param folder Optional folder path in the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, folder?: string): Promise<string> {
    // 1. Get presigned URL from backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/storage/presigned-url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Token should be handled by your interceptor or added here
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}`, 
        },
        body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            folder,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, fileUrl } = await response.json();
    console.log('Generated Presigned URL:', uploadUrl);

    // 2. Upload file directly to R2
    const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'No error text');
        console.error('R2 Upload failed status:', uploadResponse.status);
        console.error('R2 Upload failed body:', errorText);
        throw new Error(`Failed to upload file to storage: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    return fileUrl;
}
