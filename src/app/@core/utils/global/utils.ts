export class Utils{
    arrayValuesCompare(array1: any[], array2: any[]):boolean{
       if(!array1 || !array2 || array1.length!=array2.length)
           return false;
       for(let i=0;i<array2.length;i++){
           if(array1[i]!=array2[i])
               return false;
       }
       return true;
   }
} 