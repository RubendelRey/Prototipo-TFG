export class Assertions {
    public static exists(value: any, message: string){
        if(value === null || value === undefined){
            throw new Error(message);
        }
    }
}