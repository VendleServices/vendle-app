export const getContractorInitials= (name: string) => {
    const nameArray = name?.split(" ");
    if (nameArray?.length == 1) {
        return name[0][0]?.toUpperCase();
    }

    return `${nameArray[0][0]?.toUpperCase()}${nameArray[1][0]?.toUpperCase()}`;
}