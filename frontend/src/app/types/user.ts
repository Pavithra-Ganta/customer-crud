import Address from "./address";

export default interface User {
    id?: string;         
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    phoneNumber: string;
    category: string;
    addressCount: number; 
    addresses: Address[];
}
