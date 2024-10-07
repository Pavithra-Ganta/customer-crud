// address.ts
export default interface Address {
    id: number;           
    address: string;      
    city: string;         
    state: string;        
    pincode: string;      
    isDefault?: boolean;  
    userId: number;       
}
