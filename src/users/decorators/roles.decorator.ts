import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/** 
 
 Roles decorator accepts a list of role strings and attach roles array to the handler
 Roles('admin') ->  { roles : [ 'admin' ] }
 Roles('owner', 'customer') -> { roles : [ 'owner', 'customer' ] }
**/