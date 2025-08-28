import { UserEntity } from '@/modules/user/domain/entities';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface GraphQLContext {
  res?: FastifyReply;
  req: FastifyRequest & {
    correlationId: string;
    user: UserEntity;
  };
}
