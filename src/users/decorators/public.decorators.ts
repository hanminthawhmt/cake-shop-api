import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** 
 
 Attach a key : value pair { isPublic : true } to the route handler
 If the endpoint is marked with Public() decorator then it will be accessible to anyone on the internet

**/