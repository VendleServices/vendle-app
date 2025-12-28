export const getContractorInitials= (name: string) => {
    const nameArray = name?.split(" ");
    if (nameArray?.length == 1) {
        return name[0][0]?.toUpperCase();
    }

    return `${nameArray[0][0]?.toUpperCase()}${nameArray[1][0]?.toUpperCase()}`;
}

export const getSupabaseDownloadUrl = (supabase: any, url: any) => {
    const { data } = supabase.storage
        .from("vendle-claims")
        .getPublicUrl(url);

    const pdfUrl = data?.publicUrl || '';
    return pdfUrl;
}