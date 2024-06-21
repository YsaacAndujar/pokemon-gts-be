import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common'
  
  import { Reflector } from '@nestjs/core'
  import { JwtService, } from '@nestjs/jwt'
  import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator'
  
  @Injectable()
  export class AuthGuard implements CanActivate {
  
    constructor(
      private _jwtService: JwtService,
      private _reflector: Reflector,
    ) { }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const data: {
        token: string
        url: string
        method: string
        request: any
      } =
        this.httpAuth(context)
  
      const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
  
      if (isPublic) {
        return true
      }
  
      return await this.authenticate(
        data.request,
        data.token,
      )
    }
  
    public async authenticate(
      request: any,
      token: string,
    ) {
      if (!token) {
        throw new UnauthorizedException()
      }
      let payload
      try{
          payload = await this._jwtService.verifyAsync(token, {
            secret: process.env.PRIVATE_KEY,
          })
      }catch{
        throw new UnauthorizedException()
      }
  
      if (!payload) {
        throw new UnauthorizedException()
      }

      request['user'] = payload
  
      return true
    }
  
    private httpAuth(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest()
      const token = this._extractTokenFromHeader(request.headers)
  
      const requestURL = request?.route?.path
      const requestMethod = request?.method
  
      return {
        token,
        url: requestURL,
        method: requestMethod,
        request,
      }
    }
  
    public _extractTokenFromHeader(headers: any): string | undefined {
      const [type, token] = headers.authorization?.split(' ') ?? []
      return type === 'Bearer' ? token : undefined
    }
}